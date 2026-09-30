import BloodIcon from "@/assets/icons/blood.svg";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

type DonorsEmptyStateProps = {
  title?: string;
  message?: string;
};

export function DonorsEmptyState({
  title = "No donors yet",
  message = "People who finish donor registration will show up here.",
}: DonorsEmptyStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { borderColor: theme.border }]}>
      <ThemedView style={[styles.iconWrap, { backgroundColor: "#F8E8EA" }]}>
        <BloodIcon width={22} height={22} />
      </ThemedView>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: "dashed",
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginTop: 8,
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
