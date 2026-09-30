import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export type RecentDonation = {
  id: string;
  bloodType: string;
  packs: number;
  date: string;
  amount?: number;
  location: string;
  status: "completed" | "pending";
  title?: string;
};

type RecentDonationCardProps = {
  donation: RecentDonation;
};

export function RecentDonationCard({ donation }: RecentDonationCardProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { shadowColor: theme.text }]}>
      <ThemedView style={styles.topRow}>
        <ThemedView style={styles.leftGroup}>
          <ThemedView
            style={[styles.bloodTypeBadge, { borderColor: theme.primary }]}
          >
            <ThemedText
              style={[styles.bloodTypeText, { color: theme.primary }]}
            >
              {donation.bloodType}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.details}>
            <ThemedText style={styles.title}>
              {donation.title ??
                `${donation.packs} Pack${donation.packs > 1 ? "s" : ""} Donated`}
            </ThemedText>
            <ThemedText style={[styles.date, { color: theme.textSecondary }]}>
              {donation.date}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {donation.amount != null ? (
          <ThemedText style={[styles.amount, { color: theme.primary }]}>
            {formatNaira(donation.amount)}
          </ThemedText>
        ) : null}
      </ThemedView>

      <ThemedView style={styles.bottomRow}>
        <ThemedView style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={theme.status.info} />
          <ThemedText
            numberOfLines={1}
            style={[styles.location, { color: theme.textSecondary }]}
          >
            {donation.location}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statusRow}>
          <ThemedView style={styles.statusIcon}>
            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
          </ThemedView>
          <ThemedText
            style={[styles.statusText, { color: theme.status.success }]}
          >
            Completed
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "transparent",
  },
  leftGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  bloodTypeBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    backgroundColor: "#FFE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  bloodTypeText: {
    fontFamily: Fonts.inter.bold,
    fontSize: 13,
  },
  details: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  date: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  amount: {
    fontFamily: Fonts.inter.bold,
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
  },
  locationRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  location: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  statusIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
  },
});
