import { Line } from "@/components/themed-line";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SettingsCard } from "@/components/ui/settings/settings-toggle-row";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Switch } from "react-native";

export default function BankDetails() {
  const theme = useTheme();
  const [primary, setPrimary] = useState(true);
  const [form, setForm] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
  });

  return (
    <SettingsScreenLayout
      title="Bank Details"
      footerLabel="Save Details"
      onFooterPress={() => {}}
    >
      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Active Direct Deposit Account" />
        <ThemedView style={[styles.activeCard, { borderColor: theme.border }]}>
          <ThemedView style={styles.activeHeader}>
            <ThemedView style={styles.bankRow}>
              <ThemedView style={[styles.bankIcon, { backgroundColor: "#FFE2E2" }]}>
                <Feather name="home" size={16} color={theme.primary} />
              </ThemedView>
              <ThemedText style={styles.bankName}>Chase Bank, N.A.</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.primaryBadge, { backgroundColor: "#FFE2E2" }]}>
              <ThemedText style={[styles.primaryBadgeText, { color: theme.primary }]}>
                PRIMARY
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <Line strokeWidth={1} strokeColor="#E5E7EB" />
          <ThemedView style={styles.metaBlock}>
            <ThemedText style={[styles.metaLabel, { color: theme.textSecondary }]}>
              ACCOUNT NUMBER
            </ThemedText>
            <ThemedText style={styles.metaValue}>•••• •••• •••• 8840</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metaRow}>
            <ThemedView style={styles.metaCol}>
              <ThemedText style={[styles.metaLabel, { color: theme.textSecondary }]}>
                ACCOUNT HOLDER
              </ThemedText>
              <ThemedText style={styles.metaValue}>Will I Am</ThemedText>
            </ThemedView>
            <ThemedView style={styles.metaCol}>
              <ThemedText style={[styles.metaLabel, { color: theme.textSecondary }]}>
                IFSC / ROUTING
              </ThemedText>
              <ThemedText style={styles.metaValue}>CHASUS33001</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Update Account Details" />
        <ThemedInput
          label="Account Holder Name"
          placeholder="Input text"
          value={form.accountHolder}
          onChangeText={(value) =>
            setForm((prev) => ({ ...prev, accountHolder: value }))
          }
        />
        <ThemedInput
          label="Bank Name"
          placeholder="Input text"
          value={form.bankName}
          onChangeText={(value) =>
            setForm((prev) => ({ ...prev, bankName: value }))
          }
        />
        <ThemedInput
          label="Account Number"
          placeholder="Input text"
          keyboardType="number-pad"
          value={form.accountNumber}
          onChangeText={(value) =>
            setForm((prev) => ({ ...prev, accountNumber: value }))
          }
        />
        <SettingsCard>
          <ThemedView style={styles.toggleRow}>
            <ThemedText style={styles.toggleLabel}>
              Set as primary reimbursement account
            </ThemedText>
            <Switch
              value={primary}
              onValueChange={setPrimary}
              trackColor={{ false: "#E0E0E0", true: theme.primary }}
              thumbColor="#ffffff"
            />
          </ThemedView>
        </SettingsCard>
      </ThemedView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  activeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  bankIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bankName: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
    flex: 1,
  },
  primaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryBadgeText: {
    fontFamily: Fonts.inter.bold,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  metaBlock: {
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaCol: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  metaValue: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLabel: {
    flex: 1,
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
});
