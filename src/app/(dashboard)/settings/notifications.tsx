import {
  SettingsCard,
  SettingsToggleRow,
} from "@/components/ui/settings/settings-toggle-row";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { $api } from "../../../../services/api-client";
import { NotificationSettings } from "../../../../services/notifications.service";
import { getErrorMessage } from "../../../../utils/lib";

export default function NotificationSettingsScreen() {
  const theme = useTheme();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const settingsRef = useRef<NotificationSettings | null>(null);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await $api.notifications.settings();
        if (cancelled || !res?.data) return;
        settingsRef.current = res.data;
        setSettings(res.data);
      } catch (error) {
        if (!cancelled) {
          Toast.show({
            type: "error",
            text1: getErrorMessage(error, "Could not load notification settings"),
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<NotificationSettings>) => {
    const current = settingsRef.current;
    if (!current) return;
    const next = { ...current, ...patch };
    settingsRef.current = next;
    setSettings(next);

    saveQueue.current = saveQueue.current.then(async () => {
      try {
        const res = await $api.notifications.updateSettings(patch);
        const saved = res?.data;
        const live = settingsRef.current;
        if (!saved || !live) return;
        const merged = { ...saved };
        (Object.keys(live) as (keyof NotificationSettings)[]).forEach((key) => {
          if (live[key] !== saved[key]) merged[key] = live[key];
        });
        settingsRef.current = merged;
        setSettings(merged);
      } catch (error) {
        const live = settingsRef.current;
        if (live) {
          const reverted = { ...live };
          (Object.keys(patch) as (keyof NotificationSettings)[]).forEach(
            (key) => {
              if (reverted[key] === patch[key]) reverted[key] = current[key];
            },
          );
          settingsRef.current = reverted;
          setSettings(reverted);
        }
        Toast.show({
          type: "error",
          text1: getErrorMessage(error, "Could not save notification settings"),
        });
      }
    });
  }, []);

  return (
    <SettingsScreenLayout title="Notification Settings">
      {loading ? (
        <ActivityIndicator color={theme.primary} style={styles.loading} />
      ) : null}
      {settings ? (
      <>
      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="System Access" />
        <SettingsCard>
          <SettingsToggleRow
            title="Push Notifications"
            description="Turn on or off all push notifications"
            value={settings?.pushEnabled ?? true}
            onValueChange={(value) => {
              void update({ pushEnabled: value });
            }}
            showDivider={false}
          />
        </SettingsCard>
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Alert Categories" />
        <SettingsCard>
          <SettingsToggleRow
            title="Donation Reminders"
            description="Get notified when you become eligible"
            value={settings?.donationReminders ?? true}
            onValueChange={(value) => {
              void update({ donationReminders: value });
            }}
          />
          <SettingsToggleRow
            title="Nearby Blood Drives"
            description="Alerts for local pop-up drives"
            value={settings?.nearbyDrives ?? true}
            onValueChange={(value) => {
              void update({ nearbyDrives: value });
            }}
          />
          <SettingsToggleRow
            title="Eligibility Alerts"
            description="Critical health & timing updates"
            value={settings?.eligibilityAlerts ?? false}
            onValueChange={(value) => {
              void update({ eligibilityAlerts: value });
            }}
          />
          <SettingsToggleRow
            title="Reward Updates"
            description="Points, tier changes, and voucher alerts"
            value={settings?.rewardUpdates ?? true}
            onValueChange={(value) => {
              void update({ rewardUpdates: value });
            }}
          />
          <SettingsToggleRow
            title="App Updates"
            description="New features, security updates, & tips"
            value={settings?.appUpdates ?? false}
            onValueChange={(value) => {
              void update({ appUpdates: value });
            }}
            showDivider={false}
          />
        </SettingsCard>
      </ThemedView>
      </>
      ) : null}
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 32,
  },
  section: {
    gap: 12,
  },
});
