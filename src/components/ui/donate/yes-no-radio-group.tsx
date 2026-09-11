import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

export type YesNoAnswer = "yes" | "no" | null;

type YesNoRadioGroupProps = {
  value: YesNoAnswer;
  onChange: (value: YesNoAnswer) => void;
};

function RadioOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable style={styles.option} onPress={onPress}>
      <ThemedView
        style={[
          styles.radio,
          selected
            ? { borderColor: theme.primary, backgroundColor: theme.primary }
            : { borderColor: "#D1D5DB" },
        ]}
      >
        {selected ? <ThemedView style={styles.radioInner} /> : null}
      </ThemedView>
      <ThemedText style={styles.optionLabel}>{label}</ThemedText>
    </Pressable>
  );
}

export function YesNoRadioGroup({ value, onChange }: YesNoRadioGroupProps) {
  return (
    <ThemedView style={styles.group}>
      <RadioOption
        label="Yes"
        selected={value === "yes"}
        onPress={() => onChange("yes")}
      />
      <RadioOption
        label="No"
        selected={value === "no"}
        onPress={() => onChange("no")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    gap: 24,
    backgroundColor: "transparent",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  optionLabel: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
});
