import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  SettingsCard,
  SettingsToggleRow,
} from "@/components/ui/settings/settings-toggle-row";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function PrivacySecurity() {
  const theme = useTheme();
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  return (
    <SettingsScreenLayout
      title="Privacy & Security"
      footerLabel="Save Changes"
      onFooterPress={() => {}}
    >
      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Change Password" />
        <ThemedInput
          label="Current Password"
          placeholder="Input text"
          isPassword
          value={passwords.current}
          onChangeText={(value) =>
            setPasswords((prev) => ({ ...prev, current: value }))
          }
        />
        <ThemedInput
          label="New Password"
          placeholder="Input text"
          isPassword
          value={passwords.next}
          onChangeText={(value) =>
            setPasswords((prev) => ({ ...prev, next: value }))
          }
        />
        <ThemedInput
          label="Confirm New Password"
          placeholder="Input text"
          isPassword
          value={passwords.confirm}
          onChangeText={(value) =>
            setPasswords((prev) => ({ ...prev, confirm: value }))
          }
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Security Preferences" />
        <SettingsCard>
          <SettingsToggleRow
            title="Two-Factor Authentication"
            value={twoFactor}
            onValueChange={setTwoFactor}
          />
          <SettingsToggleRow
            title="Biometric Login (Face ID)"
            value={biometric}
            onValueChange={setBiometric}
            showDivider={false}
          />
        </SettingsCard>
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Danger Zone" />
        <SettingsCard>
          <Pressable onPress={() => router.push("/settings/delete-account")}>
            <ThemedView style={styles.dangerRow}>
              <ThemedText style={[styles.dangerText, { color: theme.primary }]}>
                Delete Account
              </ThemedText>
              <ThemedView
                style={[
                  styles.chevronWrap,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <ThemedText style={{ color: theme.primary }}>{">"}</ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
        </SettingsCard>
      </ThemedView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dangerText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
