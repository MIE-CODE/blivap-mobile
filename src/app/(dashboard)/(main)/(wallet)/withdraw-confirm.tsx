import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import type { ReactNode } from "react";

const DEFAULT_AMOUNT = 250_000;

type DetailRowProps = {
  label: string;
  value: string;
  valueColor?: string;
  icon?: ReactNode;
  bold?: boolean;
};

function DetailRow({ label, value, valueColor, icon, bold }: DetailRowProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.detailRow}>
      <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedView style={styles.detailValueWrap}>
        {icon}
        <ThemedText
          style={[
            bold ? styles.detailValueBold : styles.detailValue,
            { color: valueColor ?? theme.text },
          ]}
        >
          {value}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

export default function WithdrawConfirm() {
  const theme = useTheme();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const amount = Number(amountParam) || DEFAULT_AMOUNT;
  const formattedAmount = formatNaira(amount, true);

  const handleWithdraw = () => {
    const shouldFail = amount === 99_999;

    router.replace({
      pathname: shouldFail ? "/withdraw-failed" : "/withdraw-success",
      params: { amount: String(amount) },
    });
  };

  return (
    <ThemedView safe style={styles.container}>
      <Header
        title="Confirm Withdrawal"
        titleStyle={{ color: theme.primary }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={[styles.summaryCard, { borderColor: theme.primary }]}>
          <ThemedText style={[styles.summaryAmount, { color: theme.primary }]}>
            {formattedAmount}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total Withdrawal Amount
          </ThemedText>
          <ThemedText style={[styles.summaryMeta, { color: theme.textSecondary }]}>
            From: Verified Blood Donor Wallet
          </ThemedText>
          <ThemedText style={[styles.summaryMeta, { color: theme.textSecondary }]}>
            To: Guaranty Trust Bank • Will Smith
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.detailsCard, { shadowColor: theme.text }]}>
          <ThemedText style={styles.detailsTitle}>Transaction Details</ThemedText>
          <DetailRow label="Source Wallet" value="Donor Wallet" />
          <DetailRow
            label="Destination"
            value="GTBank • ****1234"
            icon={
              <Feather name="home" size={14} color={theme.primary} />
            }
          />
          <Line strokeWidth={1} strokeColor={Colors.gray[5]} />
          <DetailRow label="Amount" value={formattedAmount} />
          <DetailRow
            label="Transaction Fee"
            value="Free"
            valueColor={theme.status.success}
          />
          <Line strokeWidth={1} strokeColor={Colors.gray[5]} />
          <DetailRow
            label="Total Debit"
            value={formattedAmount}
            valueColor={theme.primary}
            bold
          />
        </ThemedView>

        <ThemedView style={styles.infoBox}>
          <ThemedText style={[styles.infoText, { color: theme.primary }]}>
            Funds are usually processed instantly, but may take up to 24 hours
            depending on your bank&apos;s network.
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button size="large" onPress={handleWithdraw}>
          Withdraw Now
        </Button>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={[styles.cancelLink, { color: theme.textSecondary }]}>
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
    gap: 16,
    paddingBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  summaryAmount: {
    fontFamily: Fonts.inter.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  summaryLabel: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  summaryMeta: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.06,
    elevation: 2,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  detailLabel: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  detailValueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  detailValue: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
    textAlign: "right",
  },
  detailValueBold: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
    textAlign: "right",
  },
  infoBox: {
    backgroundColor: "#FFE2E2",
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  footer: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  cancelLink: {
    textAlign: "center",
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
