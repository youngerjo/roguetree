import { Button, Flex, Heading, VStack } from "native-base";
import { useBearStore } from "../utils/store";

export default function TitleUI() {
  const play = useBearStore((state) => state.play);

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
          ROGUE TREE
        </Heading>

        <VStack space={4} pointerEvents="auto">
          <Button variant="ghost" colorScheme="white" onPress={play}>
            <Heading>PLAY</Heading>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
}
