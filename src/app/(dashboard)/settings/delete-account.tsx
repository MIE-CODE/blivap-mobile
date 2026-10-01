import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, TextInput } from "react-native";

const WARNING_ITEMS = [
  "All active donation subscriptions will be immediately canceled.",
  "Your donation receipt history and certificates will be unreachable.",
  "You will lose your registered donor status benefits.",
];

export default function DeleteAccount() {
  const theme = useTheme();
  const [confirmed, setConfirmed] = useState(false);
  const [verification, setVerification] = useState("");

  const canDelete = confirmed && verification.trim().toUpperCase() === "DELETE";

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Delete Account" titleStyle={{ color: theme.primary }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.section}>
          <SettingsSectionLabel title="Critical Warning" />
          <ThemedView
            style={[
              styles.warningCard,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <ThemedView style={styles.warningTitleRow}>
              <Feather name="alert-triangle" size={18} color={theme.primary} />
              <ThemedText style={[styles.warningTitle, { color: theme.primary }]}>
                This action is permanent
              </ThemedText>
            </ThemedView>
            <ThemedText style={[styles.warningBody, { color: theme.textSecondary }]}>
              Once you delete your account, your data, profile settings, and
              payment history will be permanently erased. This cannot be undone.
            </ThemedText>
            <Line strokeWidth={1} strokeColor={theme.hairline} />
            {WARNING_ITEMS.map((item) => (
              <ThemedView key={item} style={styles.warningItem}>
                <Feather name="x" size={14} color={theme.primary} />
                <ThemedText style={[styles.warningItemText, { color: theme.textSecondary }]}>
                  {item}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <SettingsSectionLabel title="Confirm Deletion" />
          <ThemedView
            style={[
              styles.confirmCard,
              { backgroundColor: theme.card, borderColor: theme.hairline },
            ]}
          >
            <ThemedView style={styles.confirmRow}>
              <ThemedText style={styles.confirmLabel}>
                I understand this action is permanent
              </ThemedText>
              <Switch
                value={confirmed}
                onValueChange={setConfirmed}
                trackColor={{ false: theme.muted, true: theme.primary }}
                thumbColor="#ffffff"
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.verifyLabel}>
            To verify, type &apos;DELETE&apos;
          </ThemedText>
          <TextInput
            placeholder="DELETE"
            value={verification}
            onChangeText={setVerification}
            autoCapitalize="characters"
            style={[styles.verifyInput, { borderColor: theme.border, color: theme.text }]}
            placeholderTextColor={theme.textSecondary}
          />
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button size="large" disabled={!canDelete} onPress={() => {}}>
          Delete My Account
        </Button>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={[styles.cancelLink, { color: theme.text }]}>
            Cancel
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 16,
  },
  section: {
    gap: 12,
  },
  warningCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  warningTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  warningTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
  },
  warningBody: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  warningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  warningItemText: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  confirmCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  confirmLabel: {
    flex: 1,
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  verifyLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  verifyInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13.5,
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
  },
  footer: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cancelLink: {
    textAlign: "center",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
