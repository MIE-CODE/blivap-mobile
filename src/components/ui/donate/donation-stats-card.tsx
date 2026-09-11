import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

type DonationStatsCardProps = {
  totalDonated: string;
  livesSaved: string;
};

export function DonationStatsCard({
  totalDonated,
  livesSaved,
}: DonationStatsCardProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.primary }]}>
      <ThemedView style={styles.stat}>
        <ThemedText style={styles.label}>TOTAL DONATED</ThemedText>
        <ThemedText style={styles.value}>{totalDonated}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.divider} />

      <ThemedView style={styles.stat}>
        <ThemedText style={styles.label}>LIVES SAVED</ThemedText>
        <ThemedText style={styles.value}>{livesSaved}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  value: {
    color: "#FFFFFF",
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    lineHeight: 28,
  },
});
