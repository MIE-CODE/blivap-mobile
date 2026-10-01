import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet } from "react-native";

export type ResidenceOption = "nigeria" | "abroad";

type ResidenceToggleProps = {
  value: ResidenceOption;
  onChange: (value: ResidenceOption) => void;
};

function ToggleOption({
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
    <Pressable
      style={[
        styles.option,
        {
          borderColor: selected ? theme.primary : theme.hairline,
          backgroundColor: theme.card,
        },
      ]}
      onPress={onPress}
    >
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
      <ThemedText
        style={[
          styles.optionLabel,
          { fontFamily: selected ? Fonts.inter.semiBold : Fonts.inter.regular },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function ResidenceToggle({ value, onChange }: ResidenceToggleProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Where do you live?</ThemedText>
      <ThemedView style={styles.row}>
        <ToggleOption
          label="Nigeria"
          selected={value === "nigeria"}
          onPress={() => onChange("nigeria")}
        />
        <ToggleOption
          label="Abroad"
          selected={value === "abroad"}
          onPress={() => onChange("abroad")}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    backgroundColor: "transparent",
  },
  label: {
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
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
    fontSize: 13,
  },
});
