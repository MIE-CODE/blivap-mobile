import Arrow from "@/assets/icons/arrow-back.svg";
import { useTheme } from "@/hooks/use-theme";
import { Pressable } from "react-native";

export const BackBtn = ({
  onPress,
  size = 45,
}: {
  onPress: () => void;
  size?: number;
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        width: size,
        height: size,
      }}
    >
      <Arrow width={16} height={16} color={theme.border ?? "#000000"} />
    </Pressable>
  );
};
