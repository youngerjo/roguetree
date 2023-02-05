import { Ionicons } from "@expo/vector-icons";
import { Weather } from "../utils/store";

const iconNames = {
  sunny: "sunny-outline",
  "partly-sunny": "partly-sunny-outline",
  cloudy: "cloud-outline",
  rainy: "md-rainy-outline",
  stormy: "thunderstorm-outline",
  snowy: "snow-outline",
};

export interface WeatherIndicatorProps {
  weather: Weather;
}

export default function WeatherIndicator(props: WeatherIndicatorProps) {
  const { weather } = props;
  const iconName = iconNames[weather] as string;

  // @ts-ignore
  return <Ionicons name={iconName} size={64} color="white" />;
}
