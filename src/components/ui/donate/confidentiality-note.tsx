import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

export function ConfidentialityNote() {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: theme.tint,
          borderLeftColor: theme.primary,
        },
      ]}
    >
      <ThemedText style={[styles.title, { color: theme.primary }]}>
        CONFIDENTIALITY NOTE
      </ThemedText>
      <ThemedText style={[styles.body, { color: theme.primary }]}>
        Your answers are protected under medical secrecy regulations.
        High-integrity data ensures the safety of both donor and recipient.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 3,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  body: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
});
