import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";
import { StyleSheet, Switch } from "react-native";

type SettingsToggleRowProps = {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

export function SettingsToggleRow({
  title,
  description,
  value,
  onValueChange,
  showDivider = true,
}: SettingsToggleRowProps) {
  const theme = useTheme();

  return (
    <>
      <ThemedView style={styles.row}>
        <ThemedView style={styles.copy}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {description ? (
            <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
              {description}
            </ThemedText>
          ) : null}
        </ThemedView>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.gray[5], true: theme.primary }}
          thumbColor="#ffffff"
        />
      </ThemedView>
      {showDivider ? (
        <Line strokeWidth={1} strokeColor={Colors.gray[5]} style={styles.divider} />
      ) : null}
    </>
  );
}

type SettingsCardProps = {
  children: ReactNode;
};

export function SettingsCard({ children }: SettingsCardProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { shadowColor: theme.text }]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  description: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  divider: {
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.06,
    elevation: 2,
    shadowRadius: 4,
  },
});
