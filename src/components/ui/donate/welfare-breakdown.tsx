import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatKobo, WelfareView } from "@/utils/welfare";
import { StyleSheet } from "react-native";

type WelfareBreakdownProps = {
  welfare: WelfareView;
  onCover?: () => void;
  covering?: boolean;
};

export function WelfareBreakdown({
  welfare,
  onCover,
  covering,
}: WelfareBreakdownProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.box}>
      {welfare.coveredByRequesterLabel ? (
        <ThemedText style={styles.label}>{welfare.coveredByRequesterLabel}</ThemedText>
      ) : null}
      {welfare.reservedLabel ? (
        <ThemedText style={[styles.note, { color: theme.textSecondary }]}>
          {welfare.reservedLabel}
        </ThemedText>
      ) : null}
      {welfare.reimbursementLabel ? (
        <ThemedText style={styles.label}>{welfare.reimbursementLabel}</ThemedText>
      ) : null}
      {welfare.lines.map((line) => (
        <ThemedView key={line.code} style={styles.row}>
          <ThemedText style={styles.lineLabel}>{line.label}</ThemedText>
          <ThemedText style={styles.lineAmount}>{formatKobo(line.amountKobo)}</ThemedText>
        </ThemedView>
      ))}
      <ThemedView style={styles.row}>
        <ThemedText style={styles.totalLabel}>Total welfare support</ThemedText>
        <ThemedText style={[styles.totalAmount, { color: theme.primary }]}>
          {formatKobo(welfare.totalKobo)}
        </ThemedText>
      </ThemedView>
      {welfare.label && onCover ? (
        <>
          <ThemedText style={[styles.note, { color: theme.textSecondary }]}>
            Cover these expenses before the funding window ends, or the booking
            is voided. The donor is not notified until this succeeds.
          </ThemedText>
          <Button
            onPress={onCover}
            loading={covering}
            style={styles.action}
            textStyle={{ fontSize: 14 }}
          >
            {welfare.label}
          </Button>
        </>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 8,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  label: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  lineLabel: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  lineAmount: {
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
  },
  totalLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  totalAmount: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  note: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  action: {
    borderRadius: 10,
    marginTop: 4,
  },
});
