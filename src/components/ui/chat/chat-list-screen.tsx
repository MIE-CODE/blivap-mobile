import NotificationsIcon from "@/assets/icons/notification.svg";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AppBooking, formatWhen, parseBookings } from "@/utils/bookings";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { openRoute } from "@/utils/open-route";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { getErrorMessage } from "../../../../utils/lib";

type ChatThread = {
  id: string;
  name: string;
  avatar: string;
  hospital: string;
  when: string;
  roleLabel: string;
};

function toThread(booking: AppBooking, role: "donor" | "requester"): ChatThread {
  const asDonor = role === "donor";
  return {
    id: booking.id,
    name: asDonor ? booking.requesterName : booking.donorName,
    avatar: asDonor ? booking.requesterAvatar : booking.donorAvatar,
    hospital: booking.hospitalName,
    when: formatWhen(booking.scheduledAt),
    roleLabel: asDonor ? "Requester" : "Donor",
  };
}

export function ChatListScreen() {
  const theme = useTheme();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        $api.bookings.received(),
        $api.bookings.sent(),
      ]);
      const received = parseBookings(receivedRes, { hideUnfunded: true });
      const sent = parseBookings(sentRes);
      setThreads([
        ...received
          .filter((booking) => booking.status === "accepted")
          .map((booking) => toThread(booking, "donor")),
        ...sent
          .filter((booking) => booking.status === "accepted")
          .map((booking) => toThread(booking, "requester")),
      ]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not load chats"),
      });
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const hasLoaded = useRef(false);

  useFocusEffect(
    useCallback(() => {
      void load(hasLoaded.current);
      hasLoaded.current = true;
    }, [load]),
  );

  return (
    <ThemedView safe style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Chat</ThemedText>
        <Pressable
          style={[styles.bell, { borderColor: theme.primary }]}
          onPress={() => openRoute("/notification")}
        >
          <NotificationsIcon color={theme.text} width={22} height={22} />
        </Pressable>
      </ThemedView>
      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {threads.map((thread) => (
          <Pressable
            key={thread.id}
            style={[
              styles.row,
              { backgroundColor: theme.card, borderColor: theme.hairline },
            ]}
            onPress={() =>
              openRoute({
                pathname: "/chat/[bookingId]",
                params: { bookingId: thread.id, title: thread.name },
              })
            }
          >
            {thread.avatar ? (
              <Image source={{ uri: thread.avatar }} style={styles.avatar} />
            ) : (
              <ThemedView
                style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}
              />
            )}
            <ThemedView style={styles.copy}>
              <ThemedText style={styles.name}>{thread.name}</ThemedText>
              <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                {thread.roleLabel} · {thread.hospital}
              </ThemedText>
              <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                {thread.when}
              </ThemedText>
            </ThemedView>
            <Feather name="chevron-right" size={18} color={theme.textSecondary} />
          </Pressable>
        ))}
        {!loading && !threads.length ? (
          <ThemedText style={[styles.empty, { color: theme.textSecondary }]}>
            No chats yet. They appear here once a booking is accepted.
          </ThemedText>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 32,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  copy: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
  name: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  meta: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  empty: {
    textAlign: "center",
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    marginTop: 40,
  },
});
