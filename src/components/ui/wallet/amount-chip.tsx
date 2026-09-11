import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Pressable, StyleSheet } from "react-native";

type AmountChipProps = {
  amount: number;
  selected: boolean;
  onPress: () => void;
  variant?: "filled" | "outline";
};

export const AmountChip = ({
  amount,
  selected,
  onPress,
  variant = "filled",
}: AmountChipProps) => {
  const theme = useTheme();

  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        isOutline
          ? {
              backgroundColor: "#ffffff",
              borderColor: selected ? theme.primary : Colors.gray[5],
            }
          : selected
            ? { backgroundColor: theme.primary, borderColor: theme.primary }
            : { backgroundColor: "#ffffff", borderColor: theme.border },
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          {
            color: isOutline
              ? theme.primary
              : selected
                ? "#ffffff"
                : theme.textSecondary,
          },
        ]}
      >
        {formatNaira(amount)}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: Fonts.inter.medium,
    fontSize: 12,
  },
});
