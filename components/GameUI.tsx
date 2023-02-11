import { useMemo } from 'react'
import * as THREE from 'three'
import { Flex, HStack, Progress, VStack, Text } from 'native-base'
import UpgradeCard from './UpgradeCard'
import WeatherIndicator from './WeatherIndicator'
import { pickUpgrades } from '../utils/upgrade-picker'
import { useBearStore } from '../utils/store'

const tags = {
  trunk: {
    text: 'Trunk',
    color: 'amber',
  },
  branch: {
    text: 'Branch',
    color: 'tertiary',
  },
  root: {
    text: 'Root',
    color: 'pink',
  },
}

export default function GameUI() {
  const health = useBearStore((state) => state.health)
  const weather = useBearStore((state) => state.weather)
  const sunlight = useBearStore((state) => state.sunlight)
  const water = useBearStore((state) => state.water)
  const nutrition = useBearStore((state) => state.nutrition)
  const level = useBearStore((state) => state.level)
  const expProgress = useBearStore((state) => state.expProgress)
  const collectedUpgrades = useBearStore((state) => state.upgrades)
  const doUpgrade = useBearStore((state) => state.doUpgrade)
  const numPendingUpgrades = useBearStore((state) => state.numPendingUpgrades)

  const randomUpgrades = useMemo(() => {
    if (numPendingUpgrades > 0) {
      return pickUpgrades(3)
    } else {
      return []
    }
  }, [numPendingUpgrades])

  const availableUpgrades = randomUpgrades.map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    tag: item.type ? tags[item.type].text : null,
    tagColor: item.type ? tags[item.type].color : 'gray',
    level: collectedUpgrades[item.name] ? collectedUpgrades[item.name] + 1 : 1,
  }))

  const onUpgradePress = (name: string) => {
    doUpgrade(name)
  }

  return (
    <Flex
      position="absolute"
      bgColor="rgba(1, 0, 0, 0.2)"
      w="100vw"
      h="100vh"
      pointerEvents="box-none"
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex p={4} flexDir="row" justifyContent="space-between" pointerEvents="box-none">
        <VStack w="33.333%">
          <HStack alignItems="center">
            <Text w="6rem" fontWeight="bold">
              HEALTH
            </Text>
            <Progress colorScheme="red" value={health} w="12rem" />
          </HStack>
          <HStack alignItems="center">
            <Text w="6rem" fontWeight="bold">
              SUNLIGHT
            </Text>
            <Progress colorScheme="yellow" value={sunlight} w="12rem" />
          </HStack>
          <HStack alignItems="center">
            <Text w="6rem" fontWeight="bold">
              WATER
            </Text>
            <Progress colorScheme="blue" value={water} w="12rem" />
          </HStack>
          <HStack alignItems="center">
            <Text w="6rem" fontWeight="bold">
              NUTRITION
            </Text>
            <Progress colorScheme="orange" value={nutrition} w="12rem" />
          </HStack>
        </VStack>
        <VStack w="33.333%" alignItems="center">
          <WeatherIndicator weather={weather} />
        </VStack>
        <VStack w="33.333%"></VStack>
      </Flex>
      <Flex p={4} pointerEvents="box-none"></Flex>
      <Flex p={4} pointerEvents="box-none">
        <VStack space={1}>
          {availableUpgrades.length > 0 && (
            <HStack space={4} justifyContent="center" pointerEvents="auto">
              {availableUpgrades.map((upgrade, index) => (
                <UpgradeCard key={index} {...upgrade} onPress={() => onUpgradePress(upgrade.name)} />
              ))}
            </HStack>
          )}
          <Text fontSize="1.2rem" fontWeight="bold">
            Lv {level}
          </Text>
          <Progress size="xl" colorScheme="emerald" value={expProgress} />
        </VStack>
      </Flex>
    </Flex>
  )
}
