import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

type BookingEmptyStateProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
};

export function BookingEmptyState({ icon, title, message }: BookingEmptyStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.wrap}>
      <ThemedView style={[styles.iconWrap, { backgroundColor: theme.tint }]}>
        <Feather name={icon} size={26} color={theme.primary} />
      </ThemedView>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 8,
    backgroundColor: "transparent",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 18,
    textAlign: "center",
  },
  message: {
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
