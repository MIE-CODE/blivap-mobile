import { useTheme } from "@/hooks/use-theme";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Donor } from "../../types/donor";
import { RequestBloodDonationModal } from "@/components/ui/donors/request-blood-donation-modal";
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
  const [requestModalVisible, setRequestModalVisible] = useState(false);

  return skeleton ? (
    <ThemedView
      style={[
        styles.card,
        { shadowColor: theme.shadow, backgroundColor: theme.card },
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
    <>
      <ThemedView
        style={[
          styles.card,
          { shadowColor: theme.shadow, backgroundColor: theme.card },
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
        {data?.profileImage ? (
          <Image source={{ uri: data.profileImage }} style={styles.avatar} />
        ) : (
          <ThemedView
            style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}
          />
        )}

        <ThemedView
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
            backgroundColor: theme.tint,
          }}
        >
          <ThemedText type="xSmall" style={{ color: theme.primary }}>
            {data?.bloodType}
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

        <ThemedView
          style={[
            styles.reimbursement,
            {
              backgroundColor:
                data?.expenseCoverage === "requested" ? theme.tint : theme.muted,
            },
          ]}
        >
          <ThemedText
            type="xSmallMedium"
            style={{
              color:
                data?.expenseCoverage === "requested"
                  ? theme.primary
                  : theme.textSecondary,
            }}
          >
            {data?.expenseCoverage === "requested"
              ? "Welfare support"
              : "Own welfare"}
          </ThemedText>
        </ThemedView>
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
        onPress={() => setRequestModalVisible(true)}
      >
        Request Donation
      </Button>
      </ThemedView>

      <RequestBloodDonationModal
        visible={requestModalVisible}
        donor={data}
        onClose={() => setRequestModalVisible(false)}
      />
    </>
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
  reimbursement: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  droplet: {
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    padding: 7,
  },
});
