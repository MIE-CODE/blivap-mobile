import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  NotificationCard,
  NotificationIconType,
} from "@/components/ui/notifications/notification-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../services/api-client";
import { InAppNotification } from "../../../types/notification";
import { getErrorMessage } from "../../../utils/lib";

function iconFor(type: string): NotificationIconType {
  if (type.includes("booking") || type.includes("appointment")) return "calendar";
  if (type.includes("reject") || type.includes("mismatch")) return "referral";
  if (type.includes("reward") || type.includes("approved")) return "reward";
  return "success";
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
