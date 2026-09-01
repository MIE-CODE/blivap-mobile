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
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const RECENT_DONATIONS: RecentDonation[] = [
  {
    id: "1",
    bloodType: "O+",
    packs: 2,
    date: "Oct 12, 2025",
    amount: 100_000,
    location: "Red Cross Center, Ikeja",
    status: "completed",
  },
  {
    id: "2",
    bloodType: "O+",
    packs: 2,
    date: "Oct 12, 2025",
    amount: 100_000,
    location: "Red Cross Center, Ikeja",
    status: "completed",
  },
  {
    id: "3",
    bloodType: "A-",
    packs: 2,
    date: "Oct 12, 2025",
    amount: 100_000,
    location: "Red Cross Center, Ikeja",
    status: "completed",
  },
];

const PENDING_REQUESTS: PendingDonationRequest[] = [
  {
    id: "req-1",
    requesterName: "Sarah Johnson",
    requesterAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    requestedAt: "Requested Today",
    bloodType: "O+",
    location: "Lagos University Teaching Hospital (LUTH)",
    description:
      "Patient requires immediate O+ blood transfusion due to scheduled emergency surgery.",
    urgent: true,
  },
  {
    id: "req-2",
    requesterName: "Michael Adeyemi",
    requesterAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    requestedAt: "Requested Yesterday",
    bloodType: "A+",
    location: "General Hospital, Lagos",
    description: "Urgent need for A+ blood for accident victim in ICU.",
    urgent: true,
  },
  {
    id: "req-3",
    requesterName: "Grace Okonkwo",
    requesterAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    requestedAt: "Requested 2 days ago",
    bloodType: "B+",
    location: "National Blood Transfusion Centre",
    description:
      "Scheduled surgery requires B+ blood donation within 48 hours.",
    urgent: false,
  },
];

export function MyDonationsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<DonationsTab>("history");
  const [pendingRequests, setPendingRequests] = useState(PENDING_REQUESTS);

  const handleDecline = (id: string) => {
    setPendingRequests((current) =>
      current.filter((request) => request.id !== id),
    );
  };

  const handleAccept = (id: string) => {
    setPendingRequests((current) =>
      current.filter((request) => request.id !== id),
    );
  };

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "history" ? (
          <>
            <DonationStatsCard totalDonated="8 Packs" livesSaved="24 Lives" />

            <Spacer height={20} />
            <ThemedText style={styles.sectionTitle}>
              Recent Donations
            </ThemedText>
            <Spacer height={12} />

            <ThemedView style={styles.list}>
              {RECENT_DONATIONS.map((donation) => (
                <RecentDonationCard key={donation.id} donation={donation} />
              ))}
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
                onDecline={handleDecline}
                onAccept={handleAccept}
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
                  onDecline={handleDecline}
                  onAccept={handleAccept}
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
  emptyText: {
    textAlign: "center",
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    marginTop: 40,
  },
});
