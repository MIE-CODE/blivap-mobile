import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AmountChip } from "@/components/ui/wallet/amount-chip";
import {
  BankAccountSelect,
  type BankAccount,
} from "@/components/ui/wallet/bank-account-select";
import { WalletAmountCard } from "@/components/ui/wallet/wallet-amount-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira, parseAmountInput } from "@/utils/currency";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

const WALLET_BALANCE = 250_000;
const QUICK_AMOUNTS = [5_000, 10_000, 50_000, 100_000];

const DEFAULT_BANK_ACCOUNT: BankAccount = {
  bankName: "Guaranty Trust Bank",
  accountName: "Will Smith",
  accountNumber: "******1234",
};

export default function Withdraw() {
  const theme = useTheme();
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (value: string) => {
    setAmount(parseAmountInput(value));
  };

  const handleConfirm = () => {
    if (amount <= 0) return;

    router.push({
      pathname: "/withdraw-confirm",
      params: { amount: String(amount) },
    });
  };

  const displayAmount = amount > 0 ? formatNaira(amount) : "₦ 0.00";

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Withdraw" titleStyle={{ color: theme.primary }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WalletAmountCard
          label="Current Wallet Balance"
          amount={WALLET_BALANCE}
        />

        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            Enter Amount
          </ThemedText>
          <View style={[styles.amountInputWrap, { borderColor: theme.primary }]}>
            <TextInput
              value={displayAmount}
              onChangeText={handleAmountChange}
              keyboardType="number-pad"
              style={[styles.amountInput, { color: theme.primary }]}
              selectionColor={theme.primary}
              placeholder="₦ 0.00"
              placeholderTextColor={theme.primary}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            Quick Select
          </ThemedText>
          <View style={styles.chipsGrid}>
            {QUICK_AMOUNTS.map((chipAmount) => (
              <View key={chipAmount} style={styles.chipCell}>
                <AmountChip
                  amount={chipAmount}
                  selected={amount === chipAmount}
                  variant="outline"
                  onPress={() => setAmount(chipAmount)}
                />
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            Destination Bank Account
          </ThemedText>
          <BankAccountSelect account={DEFAULT_BANK_ACCOUNT} />
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button size="large" onPress={handleConfirm} disabled={amount <= 0}>
          Confirm Withdrawal
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
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  amountInputWrap: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  amountInput: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 18,
    padding: 0,
  },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chipCell: {
    width: "47%",
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
