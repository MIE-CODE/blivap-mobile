import { TransactionResultScreen } from "@/components/ui/wallet/transaction-result-screen";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Share } from "react-native";
import { ThemedText } from "@/components/themed-text";

const DEFAULT_AMOUNT = 5_000;

export default function AddMoneySuccess() {
  const theme = useTheme();
  const { amount: amountParam, method } = useLocalSearchParams<{
    amount?: string;
    method?: string;
  }>();
  const amount = Number(amountParam) || DEFAULT_AMOUNT;
  const formattedAmount = formatNaira(amount, true);
  const paymentLabel =
    method === "bank" ? "Bank Transfer" : "Debit Card • ****1234";

  const handleShare = async () => {
    await Share.share({
      message: `Payment successful! ${formattedAmount} added to your BloodLink wallet. Reference: TXN-2026082800123`,
    });
  };

  return (
    <TransactionResultScreen
      variant="success"
      title="Payment Successful!"
      description={
        <ThemedText style={{ textAlign: "center", lineHeight: 22 }}>
          Your deposit of{" "}
          <ThemedText
            style={{ color: theme.primary, fontFamily: Fonts.inter.bold }}
          >
            {formattedAmount}
          </ThemedText>{" "}
          has been added to your wallet.
        </ThemedText>
      }
      summaryRows={[
        {
          label: "Amount Added",
          value: formattedAmount,
          valueColor: theme.primary,
        },
        {
          label: "Payment Method",
          value: paymentLabel,
          icon: (
            <Feather
              name={method === "bank" ? "home" : "credit-card"}
              size={14}
              color={theme.primary}
            />
          ),
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
