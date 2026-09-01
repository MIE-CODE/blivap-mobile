import BloodIcon from "@/assets/icons/blood.svg";
import { DonorCard } from "@/components/donor-card";
import { Spacer } from "@/components/spacer";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useDonors } from "@/hooks/use-donors";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { useAppSelector } from "../../../../stores/hooks";
export const BloodDonorTab = () => {
  const { donors } = useAppSelector((s) => s.donors);
  const { loading } = useDonors();

  const theme = useTheme();
  return (
    <ThemedView style={{ gap: 8, backgroundColor: "transparent" }}>
      <ThemedText>Recent blood donors</ThemedText>
      <Spacer height={8} />

      {[...Array(3)].map((_, index) => (
        <ThemedView
          key={index}
          style={[
            styles.card,
            {
              shadowColor: theme.text,
              backgroundColor: theme.background,
              flexDirection: "row",
              alignItems: "center",
              gap: 13,
            },
          ]}
        >
          <ThemedView style={styles.droplet}>
            <BloodIcon width={16} height={16} />
          </ThemedView>
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedView>
              <ThemedText
                style={{ fontSize: 12, fontFamily: Fonts.poppins.regular }}
              >
                o+ Blood
              </ThemedText>
              <ThemedText
                type="xSmall"
                style={{
                  fontSize: 12,
                  fontFamily: Fonts.poppins.regular,
                  color: theme.textSecondary,
                }}
              >
                2 pack
              </ThemedText>
            </ThemedView>
            <ThemedView>
              <ThemedText
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.poppins.medium,
                  color: theme.text,
                }}
              >
                ₦ 100,000
              </ThemedText>
              <ThemedView
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <ThemedView
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 7,
                    backgroundColor: theme.status.success,
                  }}
                />
                <ThemedText
                  type="xSmall"
                  style={{ color: theme.textSecondary }}
                >
                  Completed
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ))}
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
          <Link href="/donors">View All</Link>
        </ThemedText>
      </ThemedView>
      <Spacer height={8} />

      {loading &&
        [...Array(4)].map((_, index) => <DonorCard key={index} skeleton />)}
      {!donors?.length ? (
        <ThemedView style={{ alignItems: "center", marginTop: 50 }}>
          <ThemedIcon name="cloud-offline-outline" size={60} />
        </ThemedView>
      ) : (
        donors
          ?.slice(0, 6)
          .map((donor) => <DonorCard key={donor.id} data={donor} />)
      )}
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  card: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 10,
    padding: 10,
  },
  droplet: {
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    padding: 7,
  },
});
