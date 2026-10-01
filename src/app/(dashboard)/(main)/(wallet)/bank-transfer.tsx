import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WalletAmountCard } from "@/components/ui/wallet/wallet-amount-card";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatNaira } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { copyToClipboard } from "@/utils/clipboard";
import { useLocalSearchParams } from "expo-router";
import { openRoute } from "@/utils/open-route";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

const DEFAULT_AMOUNT = 5_000;
const ACCOUNT_NUMBER = "0123456789";
const EXPIRY_SECONDS = 30 * 60;

export default function BankTransfer() {
  const theme = useTheme();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const amount = Number(amountParam) || DEFAULT_AMOUNT;
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleCopy = async () => {
    const copied = await copyToClipboard(ACCOUNT_NUMBER);
    Toast.show({
      type: "success",
      text1: copied ? "Account number copied" : "Account number ready to share",
    });
  };

  const handleConfirm = () => {
    openRoute({
      pathname: "/add-money-success",
      params: { amount: String(amount), method: "bank" },
    });
  };

  return (
    <ThemedView safe style={styles.container}>
      <Header title="Bank Transfer" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WalletAmountCard label="Amount to Add" amount={amount} />

        <ThemedView
          style={[
            styles.detailsCard,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <ThemedView style={styles.timerBanner}>
            <Feather name="clock" size={16} color={theme.primary} />
            <ThemedText style={[styles.timerText, { color: theme.primary }]}>
              This account expires in {formatTimer(secondsLeft)} minutes
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailBlock}>
            <ThemedText
              type="xSmall"
              style={{ color: theme.textSecondary }}
            >
              Bank Name
            </ThemedText>
            <ThemedText style={styles.detailValue}>Wema Bank</ThemedText>
          </ThemedView>
          <Line strokeWidth={1} strokeColor={Colors.gray[5]} />

          <ThemedView style={styles.detailBlock}>
            <ThemedText
              type="xSmall"
              style={{ color: theme.textSecondary }}
            >
              Account Number
            </ThemedText>
            <ThemedView style={styles.accountRow}>
              <ThemedText style={styles.accountNumber}>
                {ACCOUNT_NUMBER}
              </ThemedText>
              <Pressable
                onPress={handleCopy}
                style={[styles.copyBtn, { backgroundColor: "#FFE2E2" }]}
              >
                <Feather name="copy" size={14} color={theme.primary} />
                <ThemedText
                  type="xSmallSemiBold"
                  style={{ color: theme.primary }}
                >
                  Copy
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
          <Line strokeWidth={1} strokeColor={Colors.gray[5]} />

          <ThemedView style={styles.detailBlock}>
            <ThemedText
              type="xSmall"
              style={{ color: theme.textSecondary }}
            >
              Account Name
            </ThemedText>
            <ThemedText style={styles.detailValue}>BloodLink Wallet</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoRow}>
          <Feather name="info" size={16} color={theme.textSecondary} />
          <ThemedText
            style={[styles.infoText, { color: theme.textSecondary }]}
          >
            Transfer exactly{" "}
            <ThemedText
              style={{
                color: theme.primary,
                fontFamily: Fonts.inter.bold,
              }}
            >
              {formatNaira(amount)}
            </ThemedText>{" "}
            to the account above. Your wallet will be credited automatically
            once payment is confirmed.
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button size="large" onPress={handleConfirm}>
          I&apos;ve sent the money
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
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
  timerBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timerText: {
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
    flex: 1,
  },
  detailBlock: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  detailValue: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 16,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  accountNumber: {
    fontFamily: Fonts.inter.bold,
    fontSize: 20,
    flex: 1,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
