import { Header } from "@/components/header";
import { Skeleton } from "@/components/themed-skeleton";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  NotificationCard,
  NotificationCardSkeleton,
  NotificationIconType,
} from "@/components/ui/notifications/notification-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../services/api-client";
import { InAppNotification } from "../../../types/notification";
import { getErrorMessage } from "../../../utils/lib";

function iconFor(type: string, title: string): NotificationIconType {
  const kind = `${type} ${title}`.toLowerCase();

  if (kind.includes("wallet")) return "wallet";
  if (kind.includes("thank")) return "thanks";
  if (kind.includes("welcome")) return "welcome";
  if (kind.includes("hello") || type.includes("direct_message")) {
    return "message";
  }
  if (
    type.includes("verification_rejected") ||
    type.includes("activation_rejected") ||
    kind.includes("unsuccess") ||
    kind.includes("mismatch")
  ) {
    return "referral";
  }
  if (type.includes("verification_approved") || type.includes("donor_approved")) {
    return "reward";
  }
  if (type.includes("donor_matched")) return "matched";
  if (type.includes("reminder")) return "reminder";
  if (
    type.includes("rejected") ||
    type.includes("cancelled") ||
    type.includes("expired") ||
    type.includes("abandoned") ||
    type.includes("terminated")
  ) {
    return "warning";
  }
  if (type.includes("meetup")) return "meetup";
  if (type.includes("booking") || type.includes("appointment")) return "calendar";
  if (type.includes("broadcast")) return "announcement";
  return "announcement";
}

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isToday(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function Notification() {
  const theme = useTheme();
  const [items, setItems] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await $api.notifications.list();
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list.filter((item) => item.isDeleted !== true));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not load notifications"),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, readAt: item.readAt ?? new Date().toISOString() }
          : item,
      ),
    );
    try {
      await $api.notifications.markRead(id);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not mark notification as read"),
      });
      void load();
    }
  };

  const markAllRead = async () => {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
    );
    try {
      await $api.notifications.markAllRead();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not mark notifications as read"),
      });
      void load();
    }
  };

  const today = items.filter((item) => isToday(item.createdAt));
  const earlier = items.filter((item) => !isToday(item.createdAt));
  const sections = [
    { label: "TODAY", items: today },
    { label: "EARLIER", items: earlier },
  ].filter((section) => section.items.length > 0);
  const hasUnread = items.some((item) => !item.readAt);

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Notifications" titleStyle={{ color: theme.primary }} />
      <Spacer height={20} />

      {loading ? (
        <ThemedView style={styles.sectionItems}>
          <Skeleton width={72} height={12} />
          {[0, 1, 2, 3].map((item) => (
            <NotificationCardSkeleton key={item} />
          ))}
        </ThemedView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!sections.length ? (
            <ThemedText style={[styles.empty, { color: theme.textSecondary }]}>
              No notifications yet.
            </ThemedText>
          ) : (
            sections.map((section) => (
              <ThemedView key={section.label} style={styles.section}>
                <ThemedView style={styles.sectionHeader}>
                  <ThemedText
                    style={[
                      styles.sectionLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {section.label}
                  </ThemedText>
                  {section.label === "TODAY" && hasUnread ? (
                    <Pressable onPress={() => void markAllRead()} hitSlop={8}>
                      <ThemedText
                        style={{
                          color: theme.primary,
                          fontFamily: Fonts.inter.semiBold,
                        }}
                      >
                        Read
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </ThemedView>
                <ThemedView style={styles.sectionItems}>
                  {section.items.map((item) => (
                    <NotificationCard
                      key={item.id}
                      title={item.title}
                      body={item.body}
                      timestamp={formatTimestamp(item.createdAt)}
                      unread={!item.readAt}
                      iconType={iconFor(item.type, item.title)}
                      onPress={() => {
                        if (!item.readAt) void markRead(item.id);
                      }}
                    />
                  ))}
                </ThemedView>
              </ThemedView>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  sectionItems: {
    gap: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontFamily: Fonts.inter.regular,
  },
});
