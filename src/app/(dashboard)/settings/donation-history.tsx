import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AppBooking, formatWhen, parseBookings } from "@/utils/bookings";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { getErrorMessage } from "../../../../utils/lib";

export default function DonationHistory() {
  const theme = useTheme();
  const [bookings, setBookings] = useState<AppBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [received, sent] = await Promise.all([
        $api.bookings.received(),
        $api.bookings.sent(),
      ]);
      const rows = [...parseBookings(received), ...parseBookings(sent)]
        .filter((booking) => booking.status === "completed")
        .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
      setBookings(rows);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not load donation history"),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SettingsScreenLayout title="Donation History">
      <ThemedView
        style={[styles.summaryCard, { backgroundColor: theme.primary }]}
      >
        <ThemedText style={styles.summaryLabel}>
          DONOR IMPACT SUMMARY
        </ThemedText>
        <Line strokeWidth={1} strokeColor="rgba(255,255,255,0.35)" />
        <ThemedText style={styles.summaryTitle}>
          {bookings.length} Total Donations
        </ThemedText>
        <ThemedText style={styles.summaryBody}>
          Completed bookings from your donor and requester history show up here.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Donation Timeline" />
        <ThemedView style={styles.timeline}>
          {loading ? <ActivityIndicator color={theme.primary} /> : null}
          {!loading && !bookings.length ? (
            <ThemedText style={{ color: theme.textSecondary }}>
              No completed donations yet.
            </ThemedText>
          ) : null}
          {bookings.map((item) => (
            <ThemedView
              key={item.id}
              style={[
                styles.timelineCard,
                { backgroundColor: theme.card, shadowColor: theme.shadow },
              ]}
            >
              <ThemedView style={styles.timelineHeader}>
                <ThemedText
                  style={[styles.date, { color: theme.textSecondary }]}
                >
                  {formatWhen(item.scheduledAt)}
                </ThemedText>
                <ThemedView
                  style={[styles.statusBadge, { backgroundColor: "#DCFCE8" }]}
                >
                  <ThemedText
                    style={[styles.statusText, { color: theme.status.success }]}
                  >
                    Completed
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.location}>
                {item.hospitalName}
              </ThemedText>
              <ThemedView style={styles.timelineFooter}>
                <ThemedText
                  style={[styles.meta, { color: theme.textSecondary }]}
                >
                  Type:{" "}
                  <ThemedText
                    style={{
                      color: theme.primary,
                      fontFamily: Fonts.inter.bold,
                    }}
                  >
                    {item.bloodType}
                  </ThemedText>
                </ThemedText>
                <ThemedText
                  style={[styles.meta, { color: theme.textSecondary }]}
                >
                  Status:{" "}
                  <ThemedText
                    style={{
                      color: theme.status.success,
                      fontFamily: Fonts.inter.bold,
                    }}
                  >
                    {item.status}
                  </ThemedText>
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  summaryTitle: {
    color: "#ffffff",
    fontFamily: Fonts.inter.bold,
    fontSize: 24,
    lineHeight: 30,
  },
  summaryBody: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    gap: 12,
  },
  timeline: {
    gap: 12,
  },
  timelineCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.06,
    elevation: 2,
    shadowRadius: 4,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  date: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
  },
  location: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  timelineFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  meta: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
});
