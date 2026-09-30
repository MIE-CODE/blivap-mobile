import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DonationStatsCard } from "@/components/ui/donate/donation-stats-card";
import {
  DonationsTab,
  DonationsTabBar,
} from "@/components/ui/donate/donations-tab-bar";
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
import { AppBooking, formatWhen, parseBookings } from "@/utils/bookings";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { getErrorMessage } from "../../../../utils/lib";

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
  return {
    id: booking.id,
    bloodType: booking.bloodType,
    packs: 1,
    date: formatWhen(booking.scheduledAt),
    location: booking.hospitalName,
    status: booking.status === "completed" ? "completed" : "pending",
    title: booking.status.replace(/_/g, " "),
  };
}

export function MyDonationsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<DonationsTab>("history");
  const [received, setReceived] = useState<AppBooking[]>([]);
  const [sent, setSent] = useState<AppBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        $api.bookings.received(),
        $api.bookings.sent(),
      ]);
      setReceived(parseBookings(receivedRes, { hideUnfunded: true }));
      setSent(parseBookings(sentRes));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not load donations"),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
    try {
      if (accept) await $api.bookings.accept(id);
      else await $api.bookings.decline(id);
      Toast.show({
        type: "success",
        text1: accept ? "Request accepted" : "Request declined",
      });
      await load();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not update the request"),
      });
    }
  };

  const pendingRequests = received
    .filter((booking) => booking.status === "pending")
    .map(toPending);
  const awaitingWelfare = sent.filter(
    (booking) =>
      booking.status === "awaiting_welfare_funding" && booking.welfare,
  );
  const history = [...received, ...sent]
    .filter(
      (booking) =>
        booking.status !== "pending" &&
        booking.status !== "awaiting_welfare_funding",
    )
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
    .map(toRecent);

  return (
    <ThemedView safe style={styles.container}>
      <Spacer height={18} />
      <ThemedText
        style={{
          textAlign: "center",
          fontFamily: Fonts.inter.bold,
          fontSize: 20,
        }}
      >
        My Donations
      </ThemedText>
      <Spacer height={26} />
      <DonationsTabBar
        activeTab={activeTab}
        pendingCount={pendingRequests.length}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "history" ? (
          <>
            <DonationStatsCard
              totalDonated={`${history.length}`}
              livesSaved={`${pendingRequests.length}`}
              totalLabel="COMPLETED"
              livesLabel="PENDING"
            />

            <Spacer height={20} />
            {awaitingWelfare.length ? (
              <>
                <ThemedText style={styles.sectionTitle}>
                  Welfare expenses
                </ThemedText>
                <Spacer height={12} />
                <ThemedView style={styles.list}>
                  {awaitingWelfare.map((booking) =>
                    booking.welfare ? (
                      <ThemedView key={booking.id} style={styles.welfareCard}>
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

            <ThemedText style={styles.sectionTitle}>
              Recent Donations
            </ThemedText>
            <Spacer height={12} />

            <ThemedView style={styles.list}>
              {history.map((donation) => (
                <RecentDonationCard key={donation.id} donation={donation} />
              ))}
              {!history.length ? (
                <ThemedText
                  style={[styles.emptyText, { color: theme.textSecondary }]}
                >
                  No donation history yet.
                </ThemedText>
              ) : null}
            </ThemedView>

            <Spacer height={24} />
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Urgent Pending Requests
              </ThemedText>
              <ThemedText style={[styles.viewAll, { color: theme.primary }]}>
                View All
              </ThemedText>
            </ThemedView>
            <Spacer height={12} />

            {pendingRequests[0] ? (
              <PendingRequestCard
                request={pendingRequests[0]}
                onDecline={(id) => void respond(id, false)}
                onAccept={(id) => void respond(id, true)}
              />
            ) : null}
          </>
        ) : (
          <>
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

            {!pendingRequests.length ? (
              <ThemedText
                style={[styles.emptyText, { color: theme.textSecondary }]}
              >
                No pending requests right now.
              </ThemedText>
            ) : null}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  viewAll: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
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
  emptyText: {
    textAlign: "center",
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    marginTop: 40,
  },
});
