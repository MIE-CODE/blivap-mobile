import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

type EarningHistoryCardProps = {
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  status?: string;
};

const formatAmount = (amount: number) => `+₦${amount.toLocaleString("en-NG")}`;

export const EarningHistoryCard = ({
  title,
  subtitle,
  date,
  amount,
  status = "Credited",
}: EarningHistoryCardProps) => {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.card,
        {
          borderColor: Colors.gray[5],
          backgroundColor: "#ffffff",
        },
      ]}
    >
      <ThemedView style={styles.left}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText
          style={{
            color: theme.textSecondary,
            fontSize: 12,
            fontFamily: Fonts.inter.regular,
          }}
        >
          {subtitle}
        </ThemedText>
        <ThemedText
          style={{
            color: theme.border,
            fontSize: 10,
            fontFamily: Fonts.inter.regular,
          }}
        >
          {date}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.right}>
        <ThemedText
          style={{
            fontFamily: Fonts.inter.bold,
            fontSize: 16,
            color: theme.status.success,
          }}
        >
          {formatAmount(amount)}
        </ThemedText>
        <ThemedView style={styles.badge}>
          <ThemedText
            style={{
              color: "#1BC566",
              fontSize: 11,
              fontFamily: Fonts.inter.semiBold,
            }}
          >
            {status}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
  },
  left: {
    flex: 1,
    gap: 4,
  },
  right: {
    alignItems: "flex-end",
    gap: 6,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
  },
  badge: {
    backgroundColor: "#DCFCE8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
});
