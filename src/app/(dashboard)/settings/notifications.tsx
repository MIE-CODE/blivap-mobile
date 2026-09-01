import {
  SettingsCard,
  SettingsToggleRow,
} from "@/components/ui/settings/settings-toggle-row";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [categories, setCategories] = useState({
    donationReminders: true,
    nearbyDrives: true,
    eligibilityAlerts: false,
    rewardUpdates: true,
    appUpdates: false,
  });

  const toggleCategory = (key: keyof typeof categories) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsScreenLayout title="Notification Settings">
      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="System Access" />
        <SettingsCard>
          <SettingsToggleRow
            title="Push Notifications"
            description="Turn on or off all push notifications"
            value={pushEnabled}
            onValueChange={setPushEnabled}
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
            value={categories.donationReminders}
            onValueChange={() => toggleCategory("donationReminders")}
          />
          <SettingsToggleRow
            title="Nearby Blood Drives"
            description="Alerts for local pop-up drives"
            value={categories.nearbyDrives}
            onValueChange={() => toggleCategory("nearbyDrives")}
          />
          <SettingsToggleRow
            title="Eligibility Alerts"
            description="Critical health & timing updates"
            value={categories.eligibilityAlerts}
            onValueChange={() => toggleCategory("eligibilityAlerts")}
          />
          <SettingsToggleRow
            title="Reward Updates"
            description="Points, tier changes, and voucher alerts"
            value={categories.rewardUpdates}
            onValueChange={() => toggleCategory("rewardUpdates")}
          />
          <SettingsToggleRow
            title="App Updates"
            description="New features, security updates, & tips"
            value={categories.appUpdates}
            onValueChange={() => toggleCategory("appUpdates")}
            showDivider={false}
          />
        </SettingsCard>
      </ThemedView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
});
