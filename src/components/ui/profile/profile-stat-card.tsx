import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

type ProfileStatCardProps = {
  value: string;
  label: string;
  valueColor?: string;
};

export const ProfileStatCard = ({
  value,
  label,
  valueColor,
}: ProfileStatCardProps) => {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { shadowColor: theme.text }]}>
      <ThemedText
        style={[
          styles.value,
          { color: valueColor ?? theme.primary },
        ]}
      >
        {value}
      </ThemedText>
      <ThemedText
        type="xSmall"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    elevation: 2,
    shadowRadius: 4,
  },
  value: {
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  label: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 14,
  },
});
