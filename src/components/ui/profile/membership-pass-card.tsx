import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

type MembershipPassCardProps = {
  tier: string;
  description: string;
};

export const MembershipPassCard = ({
  tier,
  description,
}: MembershipPassCardProps) => {
  const theme = useTheme();

  return (
    <ThemedView
      style={[styles.card, { backgroundColor: theme.primary }]}
    >
      <ThemedView style={styles.headerStrip}>
        <ThemedText style={styles.passLabel}>MEMBERSHIP PASS</ThemedText>
      </ThemedView>
      <ThemedView style={styles.body}>
        <ThemedText style={styles.tier}>{tier}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  headerStrip: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  passLabel: {
    color: "#ffffff",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 8,
  },
  tier: {
    color: "#ffffff",
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  description: {
    color: "rgba(255, 255, 255, 0.85)",
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
});
