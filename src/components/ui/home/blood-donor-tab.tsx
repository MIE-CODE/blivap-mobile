import BloodIcon from "@/assets/icons/blood.svg";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
export const BloodDonorTab = () => {
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
              <ThemedText style={{ fontSize: 20, fontWeight: 400 }}>
                o+ Blood
              </ThemedText>
              <ThemedText type="xSmall" style={{ color: theme.border }}>
                2 pack
              </ThemedText>
            </ThemedView>
            <ThemedView>
              <ThemedText style={{ fontSize: 20, fontWeight: 400 }}>
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
                <ThemedText type="xSmall" style={{ color: theme.border }}>
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
          <Link href="/donors/donors">View All</Link>
        </ThemedText>
      </ThemedView>
      <Spacer height={8} />
      <ThemedView style={styles.card}>
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <ThemedText>John Doe</ThemedText>

          <ThemedView
            style={{
              paddingVertical: 1,
              paddingHorizontal: 5,
              borderRadius: 12,
              backgroundColor: "#FFE2E2",
            }}
          >
            <ThemedText type="xSmall">O+</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              backgroundColor: "transparent",
            }}
          >
            <ThemedText type="xSmallMedium">4.8</ThemedText>
            <ThemedText type="xSmallMedium">4 donations</ThemedText>
          </ThemedView>

          <ThemedText type="xSmallMedium">₦ 150,000 per unit</ThemedText>
        </ThemedView>
        <ThemedText type="xSmall" style={{ color: theme.border }}>
          Lagos, Nigeria
        </ThemedText>
        <Spacer height={8} />
        <Button
          style={{
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          textStyle={{
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Request Donation
        </Button>
      </ThemedView>
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
