import Arrow from "@/assets/icons/arrow-back.svg";
import { useTheme } from "@/hooks/use-theme";
import { Pressable } from "react-native";

export const BackBtn = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 25,
      }}
    >
      <Arrow width={16} height={16} color={theme.border ?? "#000000"} />
    </Pressable>
  );
};
