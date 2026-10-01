import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AppBooking, formatWhen, parseBookings } from "@/utils/bookings";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { getErrorMessage } from "../../../../utils/lib";

export function MyDonationsScreen() {
  const theme = useTheme();
  const [bookings, setBookings] = useState<AppBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        $api.bookings.received(),
        $api.bookings.sent(),
      ]);
      setBookings(
        [...parseBookings(receivedRes), ...parseBookings(sentRes)]
          .filter((booking) => booking.status === "completed")
          .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt)),
      );
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

  return (
    <ThemedView safe style={styles.screen}>
      <ThemedText style={styles.title}>Donations</ThemedText>
      <ThemedText style={[styles.count, { color: theme.primary }]}>
        {loading ? "–" : bookings.length}
      </ThemedText>
      <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
        Given
      </ThemedText>

      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 28 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {bookings.map((booking) => (
            <ThemedView
              key={booking.id}
              style={[styles.row, { backgroundColor: theme.card }]}
            >
              <ThemedView
                style={[
                  styles.badge,
                  { borderColor: theme.primary, backgroundColor: theme.tint },
                ]}
              >
                <ThemedText style={[styles.badgeText, { color: theme.primary }]}>
                  {booking.bloodType}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.copy}>
                <ThemedText style={styles.place} numberOfLines={1}>
                  {booking.hospitalName}
                </ThemedText>
                <ThemedText style={[styles.when, { color: theme.textSecondary }]}>
                  {formatWhen(booking.scheduledAt)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
          {!bookings.length ? (
            <ThemedText style={[styles.empty, { color: theme.textSecondary }]}>
              None yet
            </ThemedText>
          ) : null}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 32,
  },
  count: {
    marginTop: 18,
    fontFamily: Fonts.inter.bold,
    fontSize: 56,
    letterSpacing: -2,
  },
  label: {
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
    marginBottom: 8,
  },
  list: {
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: Fonts.inter.bold,
    fontSize: 13,
  },
  copy: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
  place: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  when: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  empty: {
    marginTop: 28,
    fontFamily: Fonts.inter.medium,
    fontSize: 15,
  },
});
