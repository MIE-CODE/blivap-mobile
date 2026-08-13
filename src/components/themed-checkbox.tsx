import { useTheme } from "@/hooks/use-theme";
import { Pressable } from "react-native";

import CheckIcon from "@/assets/icons/check-mark.svg";
interface CheckBoxProps {
  value?: boolean;
  handleCheck?: () => void;
}
export const ThemedCheckbox = ({ value, handleCheck }: CheckBoxProps) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={handleCheck}
      style={{
        width: 20,
        height: 17,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: theme.border,
      }}
    >
      {value && <CheckIcon color={theme.text} />}
    </Pressable>
  );
};
