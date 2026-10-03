import NotificationsIcon from "@/assets/icons/notification.svg";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BookingEmptyState } from "@/components/ui/bookings/booking-empty-state";
import { ConfirmedBookingCard } from "@/components/ui/bookings/confirmed-booking-card";
import {
  PendingDonationRequest,
  PendingRequestCard,
} from "@/components/ui/donate/pending-request-card";
import {
  RecentDonation,
  RecentDonationCard,
} from "@/components/ui/donate/recent-donation-card";
import { WelfareBreakdown } from "@/components/ui/donate/welfare-breakdown";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  AppBooking,
  formatWhen,
  isActiveAcceptedBooking,
  isPastBooking,
  parseBookingPatch,
  parseBookings,
  pastBookingLabel,
} from "@/utils/bookings";
import { parseMeetupEnsure } from "@/utils/meetups";
import { useFocusEffect } from "expo-router";
import { openRoute } from "@/utils/open-route";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { getErrorMessage } from "../../../../utils/lib";

type BookingsTab = "pending" | "confirmed" | "past";

function toPending(booking: AppBooking): PendingDonationRequest {
  return {
    id: booking.id,
    requesterName: booking.requesterName,
    requesterAvatar: booking.requesterAvatar,
    requestedAt: formatWhen(booking.scheduledAt),
    bloodType: booking.bloodType,
    location: booking.hospitalName,
    description: booking.description,
    urgent: booking.status === "pending",
    welfare: booking.welfare,
  };
}

function toRecent(booking: AppBooking): RecentDonation {
  const label = pastBookingLabel(booking);
  return {
    id: booking.id,
    bloodType: booking.bloodType,
    packs: 1,
    date: formatWhen(booking.scheduledAt),
    location: booking.hospitalName,
    status: booking.status === "completed" ? "completed" : "pending",
    statusLabel: label,
    title: label,
  };
}

export function BookingsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<BookingsTab>("pending");
  const [received, setReceived] = useState<AppBooking[]>([]);
  const [sent, setSent] = useState<AppBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        $api.bookings.received(),
        $api.bookings.sent(),
      ]);
      setReceived(parseBookings(receivedRes, { hideUnfunded: true }));
      setSent(parseBookings(sentRes));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not load bookings"),
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

  const coverWelfare = async (id: string) => {
    try {
      await $api.welfare.fund(id);
      Toast.show({ type: "success", text1: "Welfare expenses held" });
      await load();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not cover welfare expenses"),
      });
    }
  };

  const respond = async (id: string, accept: boolean) => {
    const previous = received.find((booking) => booking.id === id);
    const nextStatus = accept ? "accepted" : "rejected";
    setReceived((rows) =>
      rows.map((booking) =>
        booking.id === id ? { ...booking, status: nextStatus } : booking,
      ),
    );
    if (accept) setActiveTab("confirmed");
    try {
      const response = accept
        ? await $api.bookings.accept(id)
        : await $api.bookings.decline(id);
      const patch = parseBookingPatch(response);
      Toast.show({
        type: "success",
        text1: accept
          ? "Request accepted. Open the meetup when you meet."
          : "Request declined",
      });
      await load(true);
      setReceived((rows) =>
        rows.map((booking) =>
          booking.id === id
            ? { ...booking, status: patch?.status ?? nextStatus, ...patch }
            : booking,
        ),
      );
    } catch (error) {
      if (previous) {
        setReceived((rows) =>
          rows.map((booking) => (booking.id === id ? previous : booking)),
        );
      }
      if (accept) setActiveTab("pending");
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not update the request"),
      });
    }
  };

  const openMeetup = (id: string) => {
    openRoute({ pathname: "/bookings/meetup", params: { bookingId: id } });
  };

  const openChat = (id: string, title: string) => {
    openRoute({
      pathname: "/chat/[bookingId]",
      params: { bookingId: id, title },
    });
  };

  const cancelBooking = (id: string, isRequester: boolean) => {
    Alert.alert(
      "Cancel booking?",
      "This ends the meetup for both of you. You can’t undo it.",
      [
        { text: "Keep booking", style: "cancel" },
        {
          text: "Cancel booking",
          style: "destructive",
          onPress: () => void runCancel(id, isRequester),
        },
      ],
    );
  };

  const runCancel = async (id: string, isRequester: boolean) => {
    setCancellingId(id);
    try {
      if (isRequester) {
        await $api.bookings.cancel(id);
      } else {
        const ensured = await $api.meetups.ensureSession(id);
        const session = parseMeetupEnsure(ensured);
        if (!session?.sessionId) {
          throw new Error("Could not open the meetup session to cancel");
        }
        await $api.meetups.terminate(session.sessionId, {
          reason: "Cancelled by donor",
        });
      }
      Toast.show({ type: "success", text1: "Booking cancelled" });
      setActiveTab("past");
      await load(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not cancel this booking"),
      });
    } finally {
      setCancellingId(null);
    }
  };

  const pendingRequests = received
    .filter((booking) => booking.status === "pending")
    .map(toPending);
  const confirmed = [
    ...received
      .filter((booking) => isActiveAcceptedBooking(booking))
      .map((booking) => ({
        id: booking.id,
        name: booking.requesterName,
        avatar: booking.requesterAvatar,
        when: formatWhen(booking.scheduledAt),
        hospital: booking.hospitalName,
        bloodType: booking.bloodType,
        roleLabel: "Requester",
        isRequester: false,
      })),
    ...sent
      .filter((booking) => isActiveAcceptedBooking(booking))
      .map((booking) => ({
        id: booking.id,
        name: booking.donorName,
        avatar: booking.donorAvatar,
        when: formatWhen(booking.scheduledAt),
        hospital: booking.hospitalName,
        bloodType: booking.bloodType,
        roleLabel: "Donor",
        isRequester: true,
      })),
  ];
  const awaitingWelfare = sent.filter(
    (booking) =>
      booking.status === "awaiting_welfare_funding" && booking.welfare,
  );
  const past = [...received, ...sent]
    .filter((booking) => isPastBooking(booking))
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
    .map(toRecent);

  const tabs: { key: BookingsTab; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: pendingRequests.length },
    { key: "confirmed", label: "Confirmed", count: confirmed.length },
    { key: "past", label: "Past", count: past.length },
  ];
  const tabEmpty =
    !loading &&
    (activeTab === "pending"
      ? !pendingRequests.length && !awaitingWelfare.length
      : activeTab === "confirmed"
        ? !confirmed.length
        : !past.length);

  return (
    <ThemedView safe style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Bookings</ThemedText>
        <Pressable
          style={[styles.bell, { borderColor: theme.primary }]}
          onPress={() => openRoute("/notification")}
        >
          <NotificationsIcon color={theme.text} width={22} height={22} />
        </Pressable>
      </ThemedView>
      <ThemedView style={[styles.tabs, { borderBottomColor: theme.hairline }]}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={styles.tab}
              onPress={() => setActiveTab(tab.key)}
            >
              <ThemedView style={styles.tabLabelRow}>
                <ThemedText
                  style={{
                    color: selected ? theme.primary : theme.textSecondary,
                    fontFamily: selected ? Fonts.inter.semiBold : Fonts.inter.regular,
                    fontSize: 14,
                  }}
                >
                  {tab.label}
                </ThemedText>
                {tab.count > 0 ? (
                  <ThemedView
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          tab.key === "confirmed" ? "#166534" : theme.primary,
                      },
                    ]}
                  >
                    <ThemedText style={styles.badgeText}>{tab.count}</ThemedText>
                  </ThemedView>
                ) : null}
              </ThemedView>
              {selected ? (
                <ThemedView
                  style={[styles.indicator, { backgroundColor: theme.primary }]}
                />
              ) : null}
            </Pressable>
          );
        })}
      </ThemedView>

      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          tabEmpty && styles.scrollEmpty,
        ]}
      >
        {activeTab === "pending" ? (
          <>
            {awaitingWelfare.length ? (
              <>
                <ThemedText style={styles.sectionTitle}>Welfare expenses</ThemedText>
                <Spacer height={12} />
                <ThemedView style={styles.list}>
                  {awaitingWelfare.map((booking) =>
                    booking.welfare ? (
                      <ThemedView
                        key={booking.id}
                        style={[
                          styles.welfareCard,
                          {
                            backgroundColor: theme.card,
                            borderColor: theme.hairline,
                          },
                        ]}
                      >
                        <ThemedText style={styles.sectionTitle}>
                          {booking.hospitalName}
                        </ThemedText>
                        <WelfareBreakdown
                          welfare={booking.welfare}
                          covering={false}
                          onCover={() => void coverWelfare(booking.id)}
                        />
                      </ThemedView>
                    ) : null,
                  )}
                </ThemedView>
                <Spacer height={20} />
              </>
            ) : null}
            <ThemedView style={styles.list}>
              {pendingRequests.map((request) => (
                <PendingRequestCard
                  key={request.id}
                  request={request}
                  onDecline={(id) => void respond(id, false)}
                  onAccept={(id) => void respond(id, true)}
                />
              ))}
            </ThemedView>
            {tabEmpty ? (
              <BookingEmptyState
                icon="inbox"
                title="Nothing pending"
                message="New requests show up here."
              />
            ) : null}
          </>
        ) : null}

        {activeTab === "confirmed" ? (
          <>
            <ThemedView style={styles.list}>
              {confirmed.map((booking) => (
                <ConfirmedBookingCard
                  key={booking.id}
                  booking={booking}
                  onOpenMeetup={openMeetup}
                  onOpenChat={(id) => openChat(id, booking.name)}
                  onCancel={cancelBooking}
                  cancelling={cancellingId === booking.id}
                />
              ))}
            </ThemedView>
            {tabEmpty ? (
              <BookingEmptyState
                icon="check-circle"
                title="None confirmed"
                message="Accepted bookings show up here."
              />
            ) : null}
          </>
        ) : null}

        {activeTab === "past" ? (
          <>
            <ThemedView style={styles.list}>
              {past.map((donation) => (
                <RecentDonationCard key={donation.id} donation={donation} />
              ))}
            </ThemedView>
            {tabEmpty ? (
              <BookingEmptyState
                icon="clock"
                title="No past bookings"
                message="Finished meetups show up here."
              />
            ) : null}
          </>
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
    marginBottom: 8,
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
  tabs: {
    flexDirection: "row",
    gap: 18,
    marginTop: 18,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "transparent",
  },
  tab: {
    paddingBottom: 10,
  },
  tabLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: Fonts.inter.bold,
    lineHeight: 12,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scrollEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 16,
  },
  list: {
    gap: 12,
    backgroundColor: "transparent",
  },
  welfareCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 10,
  },
});
