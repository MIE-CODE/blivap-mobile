import { Button } from "@/components/button";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

type SummaryRow = {
  label: string;
  value: string;
  valueColor?: string;
  icon?: ReactNode;
};

type TransactionResultScreenProps = {
  variant: "success" | "failed";
  title: string;
  description: ReactNode;
  summaryRows: SummaryRow[];
  footerRow?: SummaryRow;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export const TransactionResultScreen = ({
  variant,
  title,
  description,
  summaryRows,
  footerRow,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: TransactionResultScreenProps) => {
  const theme = useTheme();
  const isSuccess = variant === "success";

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.hero}>
          <ThemedView
            style={[
              styles.iconOuter,
              {
                backgroundColor: isSuccess ? "#DCFCE8" : "#FEE2E2",
              },
            ]}
          >
            <ThemedView
              style={[
                styles.iconInner,
                {
                  backgroundColor: isSuccess
                    ? theme.status.success
                    : theme.status.danger,
                },
              ]}
            >
              <Feather
                name={isSuccess ? "check" : "x"}
                size={32}
                color="#ffffff"
              />
            </ThemedView>
          </ThemedView>
          <ThemedView
            style={[
              styles.badge,
              {
                backgroundColor: isSuccess
                  ? theme.status.success
                  : theme.status.danger,
              },
            ]}
          >
            <ThemedText style={styles.badgeText}>
              {isSuccess ? "SUCCESSFUL" : "FAILED"}
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            {description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.summaryCard, { shadowColor: theme.text }]}>
          <ThemedText
            style={[styles.summaryTitle, { color: Colors.softPrimary }]}
          >
            TRANSACTION SUMMARY
          </ThemedText>
          {summaryRows.map((row) => (
            <ThemedView key={row.label} style={styles.summaryRow}>
              <ThemedText
                type="xSmall"
                style={{ color: theme.textSecondary }}
              >
                {row.label}
              </ThemedText>
              <ThemedView style={styles.valueWrap}>
                {row.icon}
                <ThemedText
                  style={[
                    styles.summaryValue,
                    { color: row.valueColor ?? theme.text },
                  ]}
                >
                  {row.value}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
          {footerRow && (
            <>
              <Line
                strokeWidth={1}
                strokeColor={Colors.gray[5]}
                style={{ marginVertical: 8 }}
              />
              <ThemedView style={styles.summaryRow}>
                <ThemedText
                  type="xSmall"
                  style={{ color: theme.textSecondary }}
                >
                  {footerRow.label}
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {footerRow.value}
                </ThemedText>
              </ThemedView>
            </>
          )}
        </ThemedView>

        <Button size="large" onPress={onPrimary}>
          {primaryLabel}
        </Button>
        {secondaryLabel && onSecondary && (
          <Pressable onPress={onSecondary}>
            <ThemedText style={styles.secondaryLink}>{secondaryLabel}</ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    gap: 24,
  },
  hero: {
    alignItems: "center",
    gap: 12,
    paddingTop: 24,
  },
  iconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontFamily: Fonts.inter.bold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    textAlign: "center",
  },
  description: {
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  valueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  summaryValue: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 13,
    textAlign: "right",
  },
  secondaryLink: {
    textAlign: "center",
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
