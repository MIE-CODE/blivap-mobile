import { TransactionResultScreen } from "@/components/ui/wallet/transaction-result-screen";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";

const DEFAULT_AMOUNT = 250_000;

export default function WithdrawFailed() {
  const theme = useTheme();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const amount = Number(amountParam) || DEFAULT_AMOUNT;
  const formattedAmount = formatNaira(amount, true);

  return (
    <TransactionResultScreen
      variant="failed"
      title="Withdrawal Failed"
      description={
        <ThemedText style={{ textAlign: "center", lineHeight: 22 }}>
          Your withdrawal of{" "}
          <ThemedText
            style={{ color: theme.primary, fontFamily: Fonts.inter.bold }}
          >
            {formattedAmount}
          </ThemedText>{" "}
          could not be processed. Please try again or contact your bank.
        </ThemedText>
      }
      summaryRows={[
        {
          label: "Amount",
          value: formattedAmount,
          valueColor: theme.primary,
        },
        {
          label: "Destination",
          value: "GTBank • ****1234",
          icon: <Feather name="home" size={14} color={theme.primary} />,
        },
        {
          label: "Error Code",
          value: "ERR-TXN-408",
          valueColor: theme.status.danger,
        },
      ]}
      footerRow={{
        label: "Reason",
        value: "Bank network timeout",
      }}
      primaryLabel="Try Again"
      onPrimary={() => router.back()}
      secondaryLabel="Back to Wallet"
      onSecondary={() => router.replace("/wallet")}
    />
  );
}
