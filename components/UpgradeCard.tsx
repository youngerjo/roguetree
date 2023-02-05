import { Box, Pressable, HStack, Text, Badge, Spacer } from "native-base";

export interface UpgradeCardProps {
  title: string;
  description?: string;
  tag?: string;
  tagColor?: string;
  level?: number;
  onPress?: () => void;
}

export default function UpgradeCard(props: UpgradeCardProps) {
  const { title, description, tag, tagColor, level, onPress } = props;

  return (
    <Box alignItems="center">
      <Pressable w="240" onPress={onPress}>
        {({ isPressed }) => {
          return (
            <Box
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}
              p="5"
              rounded="8"
              shadow={3}
              borderWidth="1"
              borderColor="coolGray.300"
              bgColor="dark.200"
              pointerEvents="none"
            >
              <HStack alignItems="center">
                {tag && (
                  <Badge
                    colorScheme={tagColor}
                    _text={{
                      color: "white",
                    }}
                    variant="solid"
                    rounded="4"
                  >
                    {tag}
                  </Badge>
                )}
                <Spacer />
                {level && (
                  <Text fontSize={14} fontWeight="medium" color="coolGray.100">
                    Level {level}
                  </Text>
                )}
              </HStack>
              <Text
                color="coolGray.50"
                mt="3"
                fontWeight="medium"
                fontSize="xl"
              >
                {title}
              </Text>
              <Text h="120" mt="2" fontSize="sm" color="coolGray.200">
                {description}
              </Text>
            </Box>
          );
        }}
      </Pressable>
    </Box>
  );
}
