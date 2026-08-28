import { TransactionResultScreen } from "@/components/ui/wallet/transaction-result-screen";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Share } from "react-native";
import { ThemedText } from "@/components/themed-text";

const DEFAULT_AMOUNT = 250_000;

export default function WithdrawSuccess() {
  const theme = useTheme();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const amount = Number(amountParam) || DEFAULT_AMOUNT;
  const formattedAmount = formatNaira(amount, true);

  const handleShare = async () => {
    await Share.share({
      message: `Withdrawal successful! ${formattedAmount} sent to Guaranty Trust Bank. Reference: TXN-2026082800123`,
    });
  };

  return (
    <TransactionResultScreen
      variant="success"
      title="Withdrawal Successful!"
      description={
        <ThemedText style={{ textAlign: "center", lineHeight: 22 }}>
          Your withdrawal of{" "}
          <ThemedText
            style={{ color: theme.primary, fontFamily: Fonts.inter.bold }}
          >
            {formattedAmount}
          </ThemedText>{" "}
          has been sent to your Guaranty Trust Bank account.
        </ThemedText>
      }
      summaryRows={[
        {
          label: "Amount Sent",
          value: formattedAmount,
          valueColor: theme.primary,
        },
        {
          label: "Destination",
          value: "GTBank • ****1234",
          icon: <Feather name="home" size={14} color={theme.primary} />,
        },
        {
          label: "Transaction Fee",
          value: "Free",
          valueColor: theme.status.success,
        },
      ]}
      footerRow={{
        label: "Reference Number",
        value: "TXN-2026082800123",
      }}
      primaryLabel="Back to Wallet"
      onPrimary={() => router.replace("/wallet")}
      secondaryLabel="Share Receipt"
      onSecondary={handleShare}
    />
  );
}
