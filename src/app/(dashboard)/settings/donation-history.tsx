import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

const DONATIONS = [
  {
    date: "October 14, 2025",
    location: "San Francisco General Hospital",
    type: "Whole Blood",
    points: 250,
  },
  {
    date: "July 22, 2025",
    location: "Red Cross Donation Center",
    type: "Whole Blood",
    points: 250,
  },
  {
    date: "April 05, 2025",
    location: "Stanford Blood Center",
    type: "Double Red Cells",
    points: 500,
  },
  {
    date: "January 11, 2025",
    location: "Pacific Heights Clinic",
    type: "Whole Blood",
    points: 250,
  },
];

export default function DonationHistory() {
  const theme = useTheme();

  return (
    <SettingsScreenLayout title="Donation History">
      <ThemedView style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.summaryLabel}>DONOR IMPACT SUMMARY</ThemedText>
        <Line strokeWidth={1} strokeColor="rgba(255,255,255,0.35)" />
        <ThemedText style={styles.summaryTitle}>12 Total Donations</ThemedText>
        <ThemedText style={styles.summaryBody}>
          You have consistently supported local clinics. Your gold donor status
          helps prioritize your future matching requests.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Donation Timeline" />
        <ThemedView style={styles.timeline}>
          {DONATIONS.map((item) => (
            <ThemedView
              key={item.date}
              style={[styles.timelineCard, { shadowColor: theme.text }]}
            >
              <ThemedView style={styles.timelineHeader}>
                <ThemedText style={[styles.date, { color: theme.textSecondary }]}>
                  {item.date}
                </ThemedText>
                <ThemedView
                  style={[
                    styles.statusBadge,
                    { backgroundColor: "#DCFCE8" },
                  ]}
                >
                  <ThemedText
                    style={[styles.statusText, { color: theme.status.success }]}
                  >
                    Completed
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.location}>{item.location}</ThemedText>
              <ThemedView style={styles.timelineFooter}>
                <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                  Type:{" "}
                  <ThemedText style={{ color: theme.primary, fontFamily: Fonts.inter.bold }}>
                    {item.type}
                  </ThemedText>
                </ThemedText>
                <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                  Points Earned:{" "}
                  <ThemedText
                    style={{ color: theme.status.success, fontFamily: Fonts.inter.bold }}
                  >
                    +{item.points}
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
