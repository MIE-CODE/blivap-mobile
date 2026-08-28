import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { StyleSheet } from "react-native";

type WalletAmountCardProps = {
  label: string;
  amount: number;
  badge?: string;
};

export const WalletAmountCard = ({
  label,
  amount,
  badge = "Verified Blood Donor Wallet",
}: WalletAmountCardProps) => {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.primary }]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.amount}>{formatNaira(amount)}</ThemedText>
      <ThemedView style={styles.badge}>
        <ThemedText style={styles.badgeText}>{badge}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 6,
  },
  label: {
    color: "rgba(255, 255, 255, 0.75)",
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
  },
  amount: {
    color: "#ffffff",
    fontFamily: Fonts.inter.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontFamily: Fonts.inter.medium,
    fontSize: 11,
  },
});
