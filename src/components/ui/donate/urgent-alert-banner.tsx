import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";
import { DonateColors } from "./donate-colors";

export function UrgentAlertBanner() {
  const theme = useTheme();

  return (
    <ThemedView
      style={[styles.banner, { backgroundColor: DonateColors.urgentBannerBg }]}
    >
      <ThemedView
        style={[styles.dot, { backgroundColor: DonateColors.urgentDot }]}
      />
      <ThemedText
        numberOfLines={1}
        style={[styles.text, { color: theme.primary }]}
      >
        URGENT: O- blood needed at General Hospital, La...
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 12,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.poppins.semiBold,
    letterSpacing: -0.2,
  },
});
