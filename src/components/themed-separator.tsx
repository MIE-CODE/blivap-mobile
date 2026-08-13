import { DimensionValue, View } from "react-native";
interface ThemedSeparatorProps {
  color?: string;
  thickness?: number;
  width?: DimensionValue;
}
export const ThemedSeparator = ({
  color = "#E0E0E0",
  thickness = 1,
  width = "100%",
}: ThemedSeparatorProps) => {
  return (
    <View style={[{ backgroundColor: color, height: thickness, width }]} />
  );
};
