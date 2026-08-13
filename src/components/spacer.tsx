import { View } from "react-native";
interface SpacerProps {
  height?: number;
  width?: number;
}
export const Spacer = (props: SpacerProps) => {
  return (
    <View style={{ height: props.height ?? 10, width: props.width ?? 10 }} />
  );
};
