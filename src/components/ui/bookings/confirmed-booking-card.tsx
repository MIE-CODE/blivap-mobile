import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet } from "react-native";

export type ConfirmedBookingCardData = {
  id: string;
  name: string;
  avatar: string;
  when: string;
  hospital: string;
  bloodType: string;
  roleLabel: string;
};

type ConfirmedBookingCardProps = {
  booking: ConfirmedBookingCardData;
  onOpenMeetup: (id: string) => void;
  onOpenChat: (id: string) => void;
};

export function ConfirmedBookingCard({
  booking,
  onOpenMeetup,
  onOpenChat,
}: ConfirmedBookingCardProps) {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.hairline },
      ]}
    >
      <ThemedView style={styles.headerRow}>
        <ThemedView style={styles.person}>
          {booking.avatar ? (
            <Image source={{ uri: booking.avatar }} style={styles.avatar} />
          ) : (
            <ThemedView
              style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}
            />
          )}
          <ThemedView style={styles.nameBlock}>
            <ThemedText style={styles.name}>{booking.name}</ThemedText>
            <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
              {booking.roleLabel} · {booking.when}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.badges}>
          <ThemedView style={styles.acceptedBadge}>
            <ThemedText style={styles.acceptedText}>Accepted</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.bloodBadge, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.bloodText}>{booking.bloodType}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.locationRow}>
        <Feather name="map-pin" size={12} color={theme.status.info} />
        <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
          {booking.hospital}
        </ThemedText>
      </ThemedView>

      <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
        Meet at the hospital, verify each other&apos;s code, then confirm the
        donation.
      </ThemedText>

      <ThemedView style={styles.actions}>
        <Pressable
          style={[styles.chatBtn, { borderColor: theme.border }]}
          onPress={() => onOpenChat(booking.id)}
        >
          <ThemedText style={styles.chatText}>Chat</ThemedText>
        </Pressable>
        <Button
          style={styles.meetupBtn}
          textStyle={{ fontFamily: Fonts.inter.semiBold, fontSize: 13 }}
          onPress={() => onOpenMeetup(booking.id)}
        >
          Open meetup
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
    borderColor: "#E5E7EB",
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
  person: {
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
  meta: {
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  acceptedBadge: {
    backgroundColor: "#DCFCE8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  acceptedText: {
    color: "#166534",
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
  bloodText: {
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
  hint: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "transparent",
  },
  chatBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  chatText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
  },
  meetupBtn: {
    flex: 1.4,
    borderRadius: 100,
    paddingVertical: 12,
  },
});
