import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  NotificationCard,
  NotificationIconType,
} from "@/components/ui/notifications/notification-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ScrollView, StyleSheet } from "react-native";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  unread?: boolean;
  iconType: NotificationIconType;
};

type NotificationSection = {
  label: string;
  items: NotificationItem[];
};

const NOTIFICATIONS: NotificationSection[] = [
  {
    label: "TODAY",
    items: [
      {
        id: "1",
        title: "Donation Successful",
        body: "Thank you! Your whole blood donation at Lagos University Teaching Hospital was successful. 450ml O+ added.",
        timestamp: "2 hours ago",
        unread: true,
        iconType: "success",
      },
      {
        id: "2",
        title: "Withdrawal Processed",
        body: "Your withdrawal of ₦100,000 has been successfully processed to your linked bank account.",
        timestamp: "5 hours ago",
        unread: true,
        iconType: "withdrawal",
      },
      {
        id: "3",
        title: "New Reward Earned",
        body: "Congratulations! You have unlocked the 'Life Saver' milestone badge and earned 500 bonus points.",
        timestamp: "Today, 10:15 AM",
        iconType: "reward",
      },
    ],
  },
  {
    label: "EARLIER",
    items: [
      {
        id: "4",
        title: "Appointment Reminder",
        body: "Friendly reminder: Your donation appointment is scheduled for tomorrow at 10:30 AM.",
        timestamp: "Yesterday",
        iconType: "calendar",
      },
      {
        id: "5",
        title: "Referral Bonus",
        body: "Your friend James used your code! ₦5,000 referral bonus has been added to your wallet.",
        timestamp: "2 days ago",
        iconType: "referral",
      },
    ],
  },
];

export default function Notification() {
  const theme = useTheme();

  return (
    <ThemedView safe style={styles.container}>
      <Header
        title="Notifications"
        titleStyle={{ color: theme.primary }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {NOTIFICATIONS.map((section) => (
          <ThemedView key={section.label} style={styles.section}>
            <ThemedText
              style={[styles.sectionLabel, { color: theme.textSecondary }]}
            >
              {section.label}
            </ThemedText>
            <ThemedView style={styles.sectionItems}>
              {section.items.map((item) => (
                <NotificationCard
                  key={item.id}
                  title={item.title}
                  body={item.body}
                  timestamp={item.timestamp}
                  unread={item.unread}
                  iconType={item.iconType}
                />
              ))}
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sectionItems: {
    gap: 10,
  },
});
