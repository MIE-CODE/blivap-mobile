import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

type ProfileSettingsItemProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  showDivider?: boolean;
};

export const ProfileSettingsItem = ({
  label,
  icon,
  onPress,
  showDivider = true,
}: ProfileSettingsItemProps) => {
  const theme = useTheme();

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && { opacity: 0.7 },
        ]}
      >
        <ThemedView style={styles.iconWrap}>
          <Feather name={icon} size={18} color={theme.primary} />
        </ThemedView>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedView
          style={[
            styles.chevronWrap,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <Feather
            name="chevron-right"
            size={16}
            color={theme.textSecondary}
          />
        </ThemedView>
      </Pressable>
      {showDivider && (
        <Line strokeWidth={1} strokeColor={Colors.gray[5]} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontFamily: Fonts.inter.medium,
    fontSize: 15,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
