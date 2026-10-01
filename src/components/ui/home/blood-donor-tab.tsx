import BloodIcon from "@/assets/icons/blood.svg";
import { DonorCard } from "@/components/donor-card";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DonorsEmptyState } from "@/components/ui/donors/donors-empty-state";
import { Fonts } from "@/constants/theme";
import { useDonors } from "@/hooks/use-donors";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { useAppSelector } from "../../../../stores/hooks";
import { Donor } from "../../../../types/donor";

const DONATION_LABELS: Record<string, string> = {
  whole_blood: "Whole blood",
  plasma: "Plasma",
  platelets: "Platelets",
  double_red_cells: "Double red cells",
};

function donorPlace(donor: Donor) {
  const city = donor.areaLocation?.city?.trim();
  const state = donor.areaLocation?.state?.trim();
  if (city && state && city.toLowerCase() !== state.toLowerCase()) {
    return `${city}, ${state}`;
  }
  return city || state || "Location unavailable";
}

function donorMeta(donor: Donor) {
  const kind = DONATION_LABELS[donor.donationType] ?? "Blood donor";
  const last = donor.lastDonationAt ? new Date(donor.lastDonationAt) : null;
  if (last && !Number.isNaN(last.getTime())) {
    const when = last.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return { kind, detail: `Last donated ${when}` };
  }
  const completed = donor.reliability?.completedBookings;
  if (typeof completed === "number" && completed > 0) {
    return {
      kind,
      detail: `${completed} donation${completed === 1 ? "" : "s"}`,
    };
  }
  return { kind, detail: "Available to donate" };
}
export const BloodDonorTab = () => {
  const { donors } = useAppSelector((s) => s.donors);
  const { loading } = useDonors();

  const theme = useTheme();
  const hasDonors = Boolean(donors?.length);

  return (
    <ThemedView style={{ gap: 8, backgroundColor: "transparent" }}>
      {hasDonors ? (
        <>
          <ThemedText>Recent donors</ThemedText>
          <Spacer height={8} />
        </>
      ) : null}

      {donors?.slice(0, 3).map((donor) => {
        const meta = donorMeta(donor);
        return (
          <ThemedView
            key={donor.id}
            style={[
              styles.card,
              {
                shadowColor: theme.shadow,
                backgroundColor: theme.card,
              },
            ]}
          >
            <ThemedView style={[styles.droplet, { backgroundColor: theme.muted }]}>
              <BloodIcon width={18} height={18} />
            </ThemedView>
            <ThemedView style={styles.identity}>
              <ThemedView style={styles.titleRow}>
                <ThemedText style={styles.bloodType}>
                  {donor.bloodType} Blood
                </ThemedText>
                <ThemedView
                  style={[
                    styles.status,
                    {
                      backgroundColor: donor.isActiveDonor
                        ? "#E8F8EC"
                        : theme.muted,
                    },
                  ]}
                >
                  <ThemedView
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: donor.isActiveDonor
                          ? theme.status.success
                          : theme.textSecondary,
                      },
                    ]}
                  />
                  <ThemedText
                    type="xSmall"
                    style={{
                      color: donor.isActiveDonor
                        ? theme.status.success
                        : theme.textSecondary,
                    }}
                  >
                    {donor.isActiveDonor ? "Active" : donor.eligibilityStatus}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText
                type="xSmall"
                style={{ color: theme.textSecondary }}
                numberOfLines={1}
              >
                {donorPlace(donor)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        );
      })}
      <Spacer height={24} />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText>Available Donors</ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          <Link href="/donors" dangerouslySingular>
            View All
          </Link>
        </ThemedText>
      </ThemedView>
      <Spacer height={8} />

      {loading && !hasDonors
        ? [...Array(3)].map((_, index) => <DonorCard key={index} skeleton />)
        : null}
      {!loading && !hasDonors ? <DonorsEmptyState /> : null}
      {hasDonors
        ? donors
            ?.slice(0, 6)
            .map((donor) => <DonorCard key={donor.id} data={donor} />)
        : null}
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  droplet: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  bloodType: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.poppins.medium,
    lineHeight: 22,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
  },
});
