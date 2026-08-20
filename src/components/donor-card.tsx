import { useTheme } from "@/hooks/use-theme";
import { SimpleLineIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Donor } from "../../types/donor";
import { Button } from "./button";
import { Spacer } from "./spacer";
import { ThemedIcon } from "./themed-icon";
import { Skeleton } from "./themed-skeleton";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface Card {
  data?: Donor;
  skeleton?: boolean;
}
export const DonorCard = ({ data, skeleton }: Card) => {
  const theme = useTheme();

  return skeleton ? (
    <ThemedView
      style={[
        styles.card,
        { shadowColor: theme.text, backgroundColor: theme.background },
      ]}
    >
      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton width={80} height={20} />

        <Skeleton width={25} height={25} borderRadius={25} />
      </ThemedView>
      <Spacer />
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
          <Skeleton width={30} height={18} />
          <Skeleton width={80} height={18} />
        </ThemedView>

        <Skeleton width={120} height={18} />
      </ThemedView>
      <Spacer height={8} />
      <Skeleton width={100} height={18} />
      <Spacer height={9} />
      <Skeleton height={35} />
    </ThemedView>
  ) : (
    <ThemedView
      style={[
        styles.card,
        { shadowColor: theme.text, backgroundColor: theme.background },
      ]}
    >
      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <ThemedText>{data?.id.slice(0, 6)}</ThemedText>

        <ThemedView
          style={{
            paddingHorizontal: 3,
            borderRadius: "50%",
            backgroundColor: "#FFE2E2",
          }}
        >
          <ThemedText type="xSmall" style={{ color: theme.primary }}>
            O+
          </ThemedText>
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
          <ThemedView
            style={{
              flexDirection: "row",
              gap: 6.67,
              alignItems: "center",
            }}
          >
            <ThemedIcon name="star" size={13.33} color="#FFD000" />
            <ThemedText type="xSmallMedium">
              {data?.ratingCount ?? 0.0}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              gap: 6.67,
              alignItems: "center",
            }}
          >
            <SimpleLineIcons name="drop" size={9.33} color={theme.primary} />
            <ThemedText type="xSmallMedium">
              {0} {0 > 1 ? "donations" : "donation"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText type="xSmallMedium">₦ 150,000 per unit</ThemedText>
      </ThemedView>
      <ThemedText type="xSmall" style={{ color: theme.border }}>
        {data?.areaLocation.state ?? "Lagos, Nigeria"},{" "}
        {data?.areaLocation.city}
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
