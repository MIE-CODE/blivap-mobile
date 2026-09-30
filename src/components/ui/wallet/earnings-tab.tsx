import { Spacer } from "@/components/spacer";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EarningHistoryCard } from "@/components/ui/wallet/earning-history-card";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { parseWelfareWallet, WelfareWalletEntry } from "@/utils/welfare";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { $api } from "../../../../services/api-client";

const EARNINGS_SUMMARY = {
  total: 150_000,
  thisMonth: 30_000,
  lastMonth: 45_000,
  allTime: 150_000,
};

const EARNING_HISTORY = [
  {
    id: "1",
    title: "Blood Donation Reward",
    subtitle: "Whole Blood",
    date: "2024-02-18 at 11:15 AM",
    amount: 10_000,
  },
  {
    id: "2",
    title: "Referral Bonus",
    subtitle: "User signup referral",
    date: "2024-02-14 at 09:30 AM",
    amount: 5_000,
  },
  {
    id: "3",
    title: "Spam Report Reward",
    subtitle: "Valid verification report",
    date: "2024-02-10 at 03:45 PM",
    amount: 2_000,
  },
] as const;

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

type StatColumnProps = {
  label: string;
  amount: number;
  showDivider?: boolean;
};

const StatColumn = ({ label, amount, showDivider }: StatColumnProps) => {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.statColumn,
        showDivider && {
          borderRightWidth: 1,
          borderRightColor: Colors.gray[5],
        },
      ]}
    >
      <ThemedText
        type="xSmall"
        style={{ color: theme.textSecondary, fontSize: 12 }}
      >
        {label}
      </ThemedText>
      <ThemedText
        style={{
          fontFamily: Fonts.inter.bold,
          fontSize: 14,
          color: theme.text,
        }}
      >
        {formatNaira(amount)}
      </ThemedText>
    </ThemedView>
  );
};

export const EarningsTab = () => {
  const theme = useTheme();
  const [welfareEntries, setWelfareEntries] = useState<WelfareWalletEntry[]>(
    [],
  );

  useEffect(() => {
    let active = true;
    void $api.welfare
      .wallet()
      .then((res) => {
        if (!active) return;
        setWelfareEntries(parseWelfareWallet(res).entries);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <ThemedView>
      <ThemedView style={[styles.summaryCard, { shadowColor: theme.text }]}>
        <ThemedText
          type="xSmallSemiBold"
          style={[styles.totalLabel, { color: theme.textSecondary }]}
        >
          TOTAL EARNINGS
        </ThemedText>
        <ThemedText style={[styles.totalAmount, { color: theme.primary }]}>
          {formatNaira(EARNINGS_SUMMARY.total)}
        </ThemedText>
        <Line
          strokeWidth={1}
          strokeColor={Colors.gray[5]}
          style={{ marginVertical: 16 }}
        />
        <ThemedView style={styles.statsRow}>
          <StatColumn
            label="This Month"
            amount={EARNINGS_SUMMARY.thisMonth}
            showDivider
          />
          <StatColumn
            label="Last Month"
            amount={EARNINGS_SUMMARY.lastMonth}
            showDivider
          />
          <StatColumn label="All Time" amount={EARNINGS_SUMMARY.allTime} />
        </ThemedView>
      </ThemedView>

      <Spacer height={16} />

      <ThemedView style={styles.historyHeader}>
        <ThemedText
          style={{
            fontFamily: Fonts.inter.semiBold,
            fontSize: 16,
          }}
        >
          Earning History
        </ThemedText>
        <Pressable onPress={() => {}}>
          <ThemedText
            type="smallBold"
            style={{
              color: theme.primary,
              fontFamily: Fonts.inter.semiBold,
              fontSize: 14,
            }}
          >
            Filter
          </ThemedText>
        </Pressable>
      </ThemedView>

      <Spacer height={12} />

      <ThemedView style={styles.historyList}>
        {welfareEntries.length
          ? welfareEntries.map((entry) => (
              <EarningHistoryCard
                key={entry.bookingId}
                title={entry.label}
                subtitle="Eligible donor expenses"
                date={
                  entry.createdAt
                    ? new Date(entry.createdAt).toLocaleString()
                    : ""
                }
                amount={entry.amountKobo / 100}
                status="Welfare reimbursement"
              />
            ))
          : EARNING_HISTORY.map((item) => (
              <EarningHistoryCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                date={item.date}
                amount={item.amount}
              />
            ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.15,
    elevation: 4,
    shadowRadius: 4,
  },
  totalLabel: {
    textTransform: "uppercase",
    marginBottom: 4,
    fontSize: 13,
    fontFamily: Fonts.inter.semiBold,
  },
  totalAmount: {
    fontFamily: Fonts.inter.bold,
    fontSize: 28,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
  },
  statColumn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  historyList: {
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
