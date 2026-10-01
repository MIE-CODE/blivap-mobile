import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AmountChip } from "@/components/ui/wallet/amount-chip";
import { PaymentMethodOption } from "@/components/ui/wallet/payment-method-option";
import { WalletAmountCard } from "@/components/ui/wallet/wallet-amount-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira, parseAmountInput } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { openRoute } from "@/utils/open-route";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";

const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 50_000];
const WALLET_BALANCE = 250_000;

type PaymentMethod = "card" | "bank";

export default function AddMoney() {
  const theme = useTheme();
  const [amount, setAmount] = useState(5_000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const handleAmountChange = (value: string) => {
    setAmount(parseAmountInput(value));
  };

  const handleConfirm = () => {
    if (amount <= 0) return;

    const params = { amount: String(amount) };

    if (paymentMethod === "card") {
      openRoute({ pathname: "/card-payment", params });
      return;
    }

    openRoute({ pathname: "/bank-transfer", params });
  };

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Add Money" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WalletAmountCard
          label="Current Wallet Balance"
          amount={WALLET_BALANCE}
        />

        <ThemedView
          style={[
            styles.amountCard,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <ThemedText
            type="xSmall"
            style={{ color: theme.textSecondary }}
          >
            Enter Amount
          </ThemedText>
          <TextInput
            value={formatNaira(amount)}
            onChangeText={handleAmountChange}
            keyboardType="number-pad"
            style={[styles.amountInput, { color: theme.text }]}
            selectionColor={theme.primary}
          />
          <ThemedView style={styles.chipsRow}>
            {QUICK_AMOUNTS.map((chipAmount) => (
              <AmountChip
                key={chipAmount}
                amount={chipAmount}
                selected={amount === chipAmount}
                onPress={() => setAmount(chipAmount)}
              />
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.paymentSection}>
          <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
          <PaymentMethodOption
            title="Debit Card"
            description="Pay instantly using Visa, Mastercard, or Verve"
            icon={
              <Feather
                name="credit-card"
                size={20}
                color={paymentMethod === "card" ? theme.primary : theme.textSecondary}
              />
            }
            selected={paymentMethod === "card"}
            onPress={() => setPaymentMethod("card")}
          />
          <PaymentMethodOption
            title="Bank Transfer"
            description="Send money directly to your wallet dedicated bank account"
            icon={
              <Feather
                name="home"
                size={20}
                color={paymentMethod === "bank" ? theme.primary : theme.textSecondary}
              />
            }
            selected={paymentMethod === "bank"}
            onPress={() => setPaymentMethod("bank")}
          />
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button size="large" onPress={handleConfirm} disabled={amount <= 0}>
          Confirm & Add {formatNaira(amount)}
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 16,
  },
  amountCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
  amountInput: {
    fontFamily: Fonts.inter.bold,
    fontSize: 28,
    lineHeight: 36,
    paddingVertical: 4,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  paymentSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 16,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
