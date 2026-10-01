import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

export type BankAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

type BankAccountSelectProps = {
  account: BankAccount;
  onPress?: () => void;
};

export const BankAccountSelect = ({
  account,
  onPress,
}: BankAccountSelectProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: theme.primary, backgroundColor: theme.card },
      ]}
    >
      <ThemedView style={[styles.iconWrap, { backgroundColor: theme.tint }]}>
        <Feather name="home" size={18} color={theme.primary} />
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText style={[styles.bankName, { color: theme.primary }]}>
          {account.bankName}
        </ThemedText>
        <ThemedText style={[styles.accountMeta, { color: theme.textSecondary }]}>
          {account.accountName} • {account.accountNumber}
        </ThemedText>
      </ThemedView>
      <Feather name="chevron-down" size={18} color={theme.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  bankName: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  accountMeta: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
});
