import { StyleProp, ViewStyle } from "react-native";
import { ThemedView } from "./themed-view";
interface LineProps {
  strokeColor?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}
export const Line = ({
  strokeColor = "#000000",
  strokeWidth = 1,
  style,
}: LineProps) => (
  <ThemedView
    style={[style, { height: strokeWidth, backgroundColor: strokeColor }]}
  />
);
