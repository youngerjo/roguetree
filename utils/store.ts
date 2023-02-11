import { create } from 'zustand'
import { ProcTreeProps, DefaultTreePartProps, DefaultRootPartProps } from '../lib/proctree-types'
import weatherEffect from '../data/weather-effect.json'
import upgradesTrunk from '../data/upgrades-trunk.json'
import upgradesBranch from '../data/upgrades-branch.json'
import upgradesRoot from '../data/upgrades-root.json'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function clampPercent(value: number) {
  return clamp(value, 0, 100)
}

export type GameState = 'title' | 'playing' | 'gameover'

export type Weather = 'sunny' | 'partly-sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'

function getRandomWeather(): Weather {
  return ['sunny', 'partly-sunny', 'cloudy', 'rainy', 'stormy', 'snowy'][Math.floor(Math.random() * 6)] as Weather
}

export interface Stats {
  durability: number
  photosynthesisArea: number
  waterAbsorptionArea: number
  waterAbsorptionEfficiency: number
  nutritionReachability: number
  nutritionDigestEfficiency: number
  heatResistance: number
  windResistance: number
  floodingResistance: number
}

export interface BearState {
  gameState: GameState
  gameTime: number

  level: number
  exp: number
  expProgress: number

  weather: Weather
  weatherElapsedTime: number
  weatherChangeTime: number
  weatherDuration: number

  environment: {
    skyColor?: string
    groundColor?: string
    ambientLight?: {
      color: string
    }
    directionalLight?: {
      color: string
      position: number[]
    }
    shadow?: {
      color: string
      opacity: number
    }
  }

  health: number
  sunlight: number
  water: number
  nutrition: number

  stats: Stats

  upgrades: {
    [name: string]: number
  }
  numPendingUpgrades: number

  treeProps: ProcTreeProps
  rootProps: ProcTreeProps

  tick: (deltaTime: number) => void
  tickWeather: (deltaTime: number) => void
  tickStatus: (deltaTime: number) => void
  collectExp: (value: number) => void
  doUpgrade: (name: string) => void

  play: () => void
  reset: () => void
}

const initialWeather: Weather = 'partly-sunny'

const initialState = {
  gameState: 'title' as GameState,
  gameTime: 0,

  level: 1,
  exp: 0,
  expProgress: 0,

  weather: initialWeather,
  weatherElapsedTime: 0,
  weatherChangeTime: 20,
  weatherDuration: 20,

  environment: weatherEffect.items.find((i) => i.name == initialWeather)?.environment ?? {},

  health: 100,
  sunlight: 5,
  water: 10,
  nutrition: 5,

  stats: {
    durability: 10,
    photosynthesisArea: 0,
    waterAbsorptionArea: 10,
    waterAbsorptionEfficiency: 50,
    nutritionReachability: 5,
    nutritionDigestEfficiency: 20,
    heatResistance: 20,
    windResistance: 50,
    floodingResistance: 0,
  },

  upgrades: {},
  numPendingUpgrades: 0,

  treeProps: {
    ...DefaultTreePartProps,
    seed: Math.floor(Math.random() * 256),
    twigScale: 0.1,
    levels: 1,
    treeSteps: 0,
    trunkLength: 0.1,
    maxRadius: 0.02,
    initalBranchLength: 0.1,
    lengthFalloffPower: 1,
  },
  rootProps: {
    ...DefaultRootPartProps,
    seed: Math.floor(Math.random() * 256),
    levels: 1,
    treeSteps: 0,
    trunkLength: 0.1,
    maxRadius: 0.02,
    initalBranchLength: 0.1,
    lengthFalloffPower: 1,
  },
}

export const useBearStore = create<BearState>()((set) => ({
  ...initialState,

  tick: (deltaTime) =>
    set(({ gameState, gameTime, health, numPendingUpgrades, collectExp, tickWeather, tickStatus }) => {
      if (gameState != 'playing') {
        return {}
      }

      if (numPendingUpgrades > 0) {
        return {}
      }

      const newGameTime = gameTime + deltaTime

      collectExp(deltaTime)

      tickWeather(deltaTime)
      tickStatus(deltaTime)

      let newGameState: GameState = gameState

      if (health <= 0) {
        newGameState = 'gameover'
      }

      return {
        gameState: newGameState,
        gameTime: newGameTime,
      }
    }),

  tickWeather: (deltaTime) =>
    set(
      ({
        weather,
        weatherElapsedTime,
        weatherChangeTime,
        weatherDuration,
        environment,
        health,
        sunlight,
        water,
        nutrition,
      }) => {
        const weatherItem = weatherEffect.items.find((i) => i.name == weather)

        if (!weatherItem) {
          return {}
        }

        let newWeather = weather
        let newWeatherElapsedTime = weatherElapsedTime + deltaTime
        let newWeatherChangeTime = weatherChangeTime

        if (newWeatherElapsedTime > weatherChangeTime) {
          newWeatherElapsedTime -= weatherChangeTime
          newWeatherChangeTime = newWeatherElapsedTime + weatherDuration
          newWeather = getRandomWeather()
        }

        let newHealth = health
        let newSunlight = sunlight
        let newWater = water
        let newNutrition = nutrition

        Object.keys(weatherItem.modifiers).forEach((key) => {
          const valueChange = weatherItem.modifiers[key] * deltaTime

          if (key == 'health') {
            newHealth += valueChange
          } else if (key == 'sunlight') {
            newSunlight += valueChange
          } else if (key == 'water') {
            newWater += valueChange
          } else if (key == 'nutrition') {
            newNutrition += valueChange
          }
        })

        return {
          weather: newWeather,
          weatherElapsedTime: newWeatherElapsedTime,
          weatherChangeTime: newWeatherChangeTime,
          environment: weatherItem.environment,
          health: clampPercent(newHealth),
          sunlight: clampPercent(newSunlight),
          water: clampPercent(newWater),
          nutrition: clampPercent(newNutrition),
        }
      }
    ),

  tickStatus: (deltaTime) =>
    set(({ weather, health, sunlight, water, nutrition, stats }) => {
      let newHealth = health

      if (sunlight > 90) {
        newHealth -= deltaTime * (4 - stats.heatResistance * 0.02)
      } else if (sunlight > 80) {
        newHealth -= deltaTime * (2 - stats.heatResistance * 0.02)
      }

      if (water < 1) {
        newHealth -= deltaTime * (4 - stats.heatResistance * 0.02)
      } else if (water < 10) {
        newHealth -= deltaTime * (2 - stats.heatResistance * 0.02)
      } else if (water > 90) {
        newHealth -= deltaTime * (1 - stats.floodingResistance * 0.01)
      }

      if (weather == 'stormy') {
        newHealth -= deltaTime * (4 - stats.windResistance * 0.04)
      }

      const waterAbsorbed = stats.waterAbsorptionArea * 0.01 * (stats.waterAbsorptionEfficiency * 0.01)

      const nutritionAbsorbed =
        nutrition * (stats.nutritionDigestEfficiency * 0.01) * (stats.nutritionReachability * 0.01)

      newHealth += deltaTime * stats.durability * 0.001
      newHealth += deltaTime * (stats.photosynthesisArea * 0.01) * (waterAbsorbed * 0.01)
      newHealth += deltaTime * (nutritionAbsorbed * 0.02)

      newHealth = clampPercent(newHealth)

      return {
        health,
        sunlight,
        water,
        nutrition,
        stats,
      }
    }),

  collectExp: (value) =>
    set(({ level, exp, numPendingUpgrades }) => {
      let newExp = exp + value

      const newLevel = Math.floor(exp / 5) + 1
      const prevExp = (newLevel - 1) * 5
      const nextExp = newLevel * 5
      const expProgress = clampPercent(((exp - prevExp) / (nextExp - prevExp)) * 100)

      if (numPendingUpgrades == 0 && newLevel > 0) {
        return {
          level: newLevel,
          exp: newExp,
          expProgress,
          numPendingUpgrades: Math.abs(newLevel - level),
        }
      } else {
        return {}
      }
    }),

  doUpgrade: (name) =>
    set(({ upgrades, numPendingUpgrades, stats, treeProps, rootProps }) => {
      const allUpgrades = [...upgradesTrunk.items, ...upgradesBranch.items, ...upgradesRoot.items]

      const upgrade = allUpgrades.find((i) => i.name == name)

      if (upgrade && numPendingUpgrades > 0) {
        let level = 1

        if (upgrades[name]) {
          level = upgrades[name] + 1
        }

        console.log(`>> ${name} level ${level - 1} -> ${level}`)

        const newStats = {
          ...stats,
        }

        const newTreeProps = {
          ...treeProps,
        }
        const newRootProps = {
          ...rootProps,
        }

        Object.keys(upgrade.modifiers).forEach((key) => {
          const [propCategory, propName] = key.split('.')

          const valueChange = upgrade.modifiers[key]

          let oldValue
          let newValue

          if (propCategory == 'stats') {
            oldValue = newStats[propName]
            newStats[propName] += valueChange
            newValue = newStats[propName]
          } else if (propCategory == 'tree') {
            oldValue = newTreeProps[propName]
            newTreeProps[propName] += valueChange
            newValue = newTreeProps[propName]
          } else if (propCategory == 'root') {
            oldValue = newRootProps[propName]
            newRootProps[propName] += valueChange
            newValue = newRootProps[propName]
          }

          console.log(`${key}: ${oldValue.toFixed(2)} -> ${newValue.toFixed(2)}`)
        })

        return {
          upgrades: {
            ...upgrades,
            [name]: level,
          },
          numPendingUpgrades: numPendingUpgrades - 1,
          stats: newStats,
          treeProps: newTreeProps,
          rootProps: newRootProps,
        }
      } else {
        return {}
      }
    }),
  play: () => {
    set(({ gameState }) => {
      if (gameState !== 'title') {
        return {}
      }

      return {
        gameState: 'playing',
      }
    })
  },

  reset: () => {
    set(initialState)
  },
}))
