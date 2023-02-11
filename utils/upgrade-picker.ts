import upgradesTrunk from '../data/upgrades-trunk.json'
import upgradesBranch from '../data/upgrades-branch.json'
import upgradesRoot from '../data/upgrades-root.json'

export function pickUpgrades(numUpgrades: number) {
  const availableUpgrades = [...upgradesTrunk.items, ...upgradesBranch.items, ...upgradesRoot.items]

  const randomIndexSet = new Set<number>()

  for (let i = 0; i < 100 && randomIndexSet.size < numUpgrades; ++i) {
    const index = Math.floor(Math.random() * availableUpgrades.length)
    randomIndexSet.add(index)
  }

  return Array.from(randomIndexSet).map((i) => availableUpgrades[i])
}
