import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WalletAmountCard } from "@/components/ui/wallet/wallet-amount-card";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const DEFAULT_AMOUNT = 5_000;

export default function CardPayment() {
  const theme = useTheme();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const amount = Number(amountParam) || DEFAULT_AMOUNT;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handlePay = () => {
    const isValid =
      cardNumber.replace(/\s/g, "").length === 16 &&
      expiry.length === 5 &&
      cvv.length >= 3 &&
      cardholder.trim().length > 0;

    if (!isValid) {
      router.push({
        pathname: "/add-money-failed",
        params: { amount: String(amount), method: "card" },
      });
      return;
    }

    router.push({
      pathname: "/add-money-success",
      params: { amount: String(amount), method: "card" },
    });
  };

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Card Payment" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WalletAmountCard label="Amount to Add" amount={amount} />

        <ThemedView style={[styles.formCard, { shadowColor: theme.text }]}>
          <ThemedText style={styles.fieldLabel}>Card Number</ThemedText>
          <View
            style={[styles.inputWrap, { borderColor: theme.backgroundElement }]}
          >
            <Feather name="credit-card" size={18} color={theme.textSecondary} />
            <TextInput
              value={cardNumber}
              onChangeText={(v) => setCardNumber(formatCardNumber(v))}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={theme.border}
              keyboardType="number-pad"
              style={[styles.input, { color: theme.text }]}
            />
          </View>

          <ThemedView style={styles.row}>
            <ThemedView style={styles.halfField}>
              <ThemedText style={styles.fieldLabel}>Expiry Date</ThemedText>
              <TextInput
                value={expiry}
                onChangeText={(v) => setExpiry(formatExpiry(v))}
                placeholder="MM/YY"
                placeholderTextColor={theme.border}
                keyboardType="number-pad"
                style={[
                  styles.inputBox,
                  { borderColor: theme.backgroundElement, color: theme.text },
                ]}
              />
            </ThemedView>
            <ThemedView style={styles.halfField}>
              <ThemedText style={styles.fieldLabel}>CVV</ThemedText>
              <TextInput
                value={cvv}
                onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                placeholderTextColor={theme.border}
                keyboardType="number-pad"
                secureTextEntry
                style={[
                  styles.inputBox,
                  { borderColor: theme.backgroundElement, color: theme.text },
                ]}
              />
            </ThemedView>
          </ThemedView>

          <ThemedText style={styles.fieldLabel}>Cardholder Name</ThemedText>
          <TextInput
            value={cardholder}
            onChangeText={setCardholder}
            placeholder="JOHN DOE"
            placeholderTextColor={theme.border}
            autoCapitalize="characters"
            style={[
              styles.inputBox,
              { borderColor: theme.backgroundElement, color: theme.text },
            ]}
          />

          <ThemedView style={styles.cardBrands}>
            {["VISA", "Mastercard", "Verve"].map((brand) => (
              <ThemedView
                key={brand}
                style={[
                  styles.brandChip,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <ThemedText
                  type="xSmallSemiBold"
                  style={{ color: theme.textSecondary }}
                >
                  {brand}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <Pressable
          onPress={() => setSaveCard((prev) => !prev)}
          style={styles.checkboxRow}
        >
          <ThemedView
            style={[
              styles.checkbox,
              saveCard
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : { borderColor: theme.border },
            ]}
          >
            {saveCard && <Feather name="check" size={12} color="#ffffff" />}
          </ThemedView>
          <ThemedText style={styles.checkboxLabel}>
            Save card for future payments
          </ThemedText>
        </Pressable>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button size="large" onPress={handlePay}>
          Pay {formatNaira(amount)}
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
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
  fieldLabel: {
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
    marginBottom: 4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: Fonts.inter.regular,
    fontSize: 15,
  },
  cardBrands: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  brandChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
