import { useTheme } from "@/hooks/use-theme";
import { StyleProp, ViewStyle } from "react-native";
import { ThemedView } from "./themed-view";
interface LineProps {
  strokeColor?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}
export const Line = ({
  strokeColor,
  strokeWidth = 1,
  style,
}: LineProps) => {
  const theme = useTheme();
  return (
    <ThemedView
      style={[
        style,
        { height: strokeWidth, backgroundColor: strokeColor ?? theme.hairline },
      ]}
    />
  );
};
