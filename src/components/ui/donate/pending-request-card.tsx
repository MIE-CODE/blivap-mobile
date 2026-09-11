import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet } from "react-native";

export type PendingDonationRequest = {
  id: string;
  requesterName: string;
  requesterAvatar: string;
  requestedAt: string;
  bloodType: string;
  location: string;
  description: string;
  urgent?: boolean;
};

type PendingRequestCardProps = {
  request: PendingDonationRequest;
  onDecline?: (id: string) => void;
  onAccept?: (id: string) => void;
};

export function PendingRequestCard({
  request,
  onDecline,
  onAccept,
}: PendingRequestCardProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { borderColor: "#E5E7EB" }]}>
      <ThemedView style={styles.headerRow}>
        <ThemedView style={styles.requesterInfo}>
          <Image
            source={{ uri: request.requesterAvatar }}
            style={styles.avatar}
          />
          <ThemedView style={styles.nameBlock}>
            <ThemedText style={styles.name}>{request.requesterName}</ThemedText>
            <ThemedText style={[styles.requestedAt, { color: theme.textSecondary }]}>
              {request.requestedAt}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.badges}>
          {request.urgent ? (
            <ThemedView style={[styles.urgentBadge, { backgroundColor: "#FEE8E8" }]}>
              <ThemedText style={[styles.urgentText, { color: theme.primary }]}>
                URGENT
              </ThemedText>
            </ThemedView>
          ) : null}
          <ThemedView style={[styles.bloodBadge, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.bloodBadgeText}>{request.bloodType}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.locationRow}>
        <Feather name="map-pin" size={12} color={theme.status.info} />
        <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
          {request.location}
        </ThemedText>
      </ThemedView>

      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        {request.description}
      </ThemedText>

      <ThemedView style={styles.actions}>
        <Pressable
          style={[styles.declineBtn, { borderColor: theme.border }]}
          onPress={() => onDecline?.(request.id)}
        >
          <ThemedText style={[styles.declineText, { color: theme.text }]}>
            Decline
          </ThemedText>
        </Pressable>
        <Button
          style={styles.acceptBtn}
          textStyle={{ fontFamily: Fonts.inter.semiBold, fontSize: 13 }}
          onPress={() => onAccept?.(request.id)}
        >
          Accept Request
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "transparent",
  },
  requesterInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  nameBlock: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
  name: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  requestedAt: {
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  urgentText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  bloodBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  bloodBadgeText: {
    color: "#FFFFFF",
    fontFamily: Fonts.inter.bold,
    fontSize: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  location: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  description: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "transparent",
  },
  declineBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  declineText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
  },
  acceptBtn: {
    flex: 1.4,
    borderRadius: 100,
    paddingVertical: 12,
  },
});
