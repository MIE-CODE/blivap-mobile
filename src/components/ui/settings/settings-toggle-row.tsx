import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TRACK_WIDTH = 42;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 16;
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2;

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
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.muted, theme.primary],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <>
      <ThemedView style={styles.row}>
        <ThemedView style={styles.copy}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {description ? (
            <ThemedText
              style={[styles.description, { color: theme.textSecondary }]}
            >
              {description}
            </ThemedText>
          ) : null}
        </ThemedView>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: value }}
          onPress={() => onValueChange(!value)}
        >
          <Animated.View style={[styles.track, trackStyle]}>
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </Animated.View>
        </Pressable>
      </ThemedView>
      {showDivider ? (
        <Line
          strokeWidth={1}
          strokeColor={theme.hairline}
          style={styles.divider}
        />
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
    <ThemedView
      style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
    >
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
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
    paddingHorizontal: THUMB_INSET,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#ffffff",
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
