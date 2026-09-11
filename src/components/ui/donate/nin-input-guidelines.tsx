import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

const DO_GUIDELINES = [
  "Enter your 11-digit NIN number",
  "Use the number exactly as it appears on your NIN slip",
];

const DONT_GUIDELINES = [
  "Add spaces or hyphens",
  "Enter a number that is not 11 digits long",
];

export function NinInputGuidelines() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.column}>
        <ThemedText style={[styles.heading, { color: theme.status.success }]}>
          Do
        </ThemedText>
        {DO_GUIDELINES.map((item) => (
          <ThemedView key={item} style={styles.bulletRow}>
            <ThemedText style={[styles.bullet, { color: theme.status.success }]}>
              •
            </ThemedText>
            <ThemedText style={styles.bulletText}>{item}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.column}>
        <ThemedText style={[styles.heading, { color: theme.status.danger }]}>
          Don't
        </ThemedText>
        {DONT_GUIDELINES.map((item) => (
          <ThemedView key={item} style={styles.bulletRow}>
            <ThemedText style={[styles.bullet, { color: theme.status.danger }]}>
              •
            </ThemedText>
            <ThemedText style={styles.bulletText}>{item}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "transparent",
  },
  column: {
    flex: 1,
    gap: 4,
    backgroundColor: "transparent",
  },
  heading: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 12,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "transparent",
  },
  bullet: {
    fontSize: 12,
    lineHeight: 16,
  },
  bulletText: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
    lineHeight: 16,
  },
});
