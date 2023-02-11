import { Button, Flex, Heading, VStack, Text, HStack } from 'native-base'
import { useBearStore } from '../utils/store'

export default function GameOverUI() {
  const reset = useBearStore((state) => state.reset)
  const gameTime = useBearStore((state) => state.gameTime)
  const score = Math.floor(gameTime) * 100

  return (
    <Flex
      position="absolute"
      bgColor="rgba(1, 0, 0, 0.2)"
      w="100vw"
      h="100vh"
      pointerEvents="none"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <VStack space={10}>
        <Heading size="4xl" fontWeight="light">
          GAME OVER
        </Heading>

        <VStack space={20} pointerEvents="auto" alignItems="center">
          <HStack w={200} justifyContent="space-between">
            <Heading fontSize="xl" textAlign="center">
              SCORE
            </Heading>
            <Heading fontSize="xl" textAlign="center">
              {score}
            </Heading>
          </HStack>
          <Button variant="ghost" colorScheme="white" onPress={reset}>
            <Heading>BACK TO TITLE</Heading>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  )
}
