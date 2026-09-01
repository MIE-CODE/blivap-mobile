import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

type SettingsSectionLabelProps = {
  title: string;
};

export function SettingsSectionLabel({ title }: SettingsSectionLabelProps) {
  const theme = useTheme();

  return (
    <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
      {title}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
