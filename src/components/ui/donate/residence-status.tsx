import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet } from "react-native";
import { ResidenceOption } from "./residence-toggle";

type ResidenceStatusProps = {
  value: ResidenceOption;
  onChange: (value: ResidenceOption) => void;
};

const OPTIONS: { value: ResidenceOption; label: string }[] = [
  { value: "nigeria", label: "I live in Nigeria" },
  { value: "abroad", label: "I live abroad" },
];

export function ResidenceStatus({ value, onChange }: ResidenceStatusProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Residence Status</ThemedText>
      <ThemedView style={styles.options}>
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => onChange(option.value)}
            >
              <ThemedView
                style={[
                  styles.radio,
                  selected
                    ? {
                        borderColor: theme.primary,
                        backgroundColor: theme.primary,
                      }
                    : { borderColor: "#D1D5DB" },
                ]}
              >
                {selected ? <ThemedView style={styles.radioInner} /> : null}
              </ThemedView>
              <ThemedText
                style={[
                  styles.optionLabel,
                  {
                    fontFamily: selected
                      ? Fonts.inter.semiBold
                      : Fonts.inter.regular,
                  },
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    backgroundColor: "transparent",
  },
  label: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  options: {
    gap: 14,
    backgroundColor: "transparent",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FFFFFF",
  },
  optionLabel: {
    fontSize: 14,
  },
});
