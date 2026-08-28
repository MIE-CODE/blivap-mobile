import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

const DOT_SIZE = 8;
const DOT_ACTIVE_WIDTH = 28;
const DOT_ACTIVE_RADIUS = 8;
const DOT_INACTIVE_RADIUS = 4;
const DOT_INACTIVE_COLOR = "#11182773";

function positiveModulo(value: number, divisor: number) {
  "worklet";

  if (!Number.isFinite(value) || !Number.isFinite(divisor) || divisor <= 0) {
    return 0;
  }

  const remainder = value % divisor;
  return remainder < 0 ? remainder + divisor : remainder;
}

function getNearestLoopPosition(
  rawIndex: number,
  progress: number,
  count: number,
) {
  "worklet";

  if (
    !Number.isFinite(rawIndex) ||
    !Number.isFinite(progress) ||
    !Number.isFinite(count) ||
    count <= 0
  ) {
    return 0;
  }

  const safeCount = Math.floor(count);
  const normalizedIndex = positiveModulo(Math.round(rawIndex), safeCount);
  const lowerCycle = Math.floor((progress - normalizedIndex) / safeCount);
  const lower = normalizedIndex + lowerCycle * safeCount;
  const upper = lower + safeCount;
  const lowerDistance = Math.abs(progress - lower);
  const upperDistance = Math.abs(upper - progress);

  if (upperDistance < lowerDistance) return upper;
  if (lowerDistance < upperDistance) return lower;

  return upper >= progress ? upper : lower;
}

function getPaginationDotDistance(
  progress: number,
  index: number,
  count: number,
) {
  "worklet";

  if (!Number.isFinite(progress) || count <= 0) return 0;
  return Math.abs(getNearestLoopPosition(index, progress, count) - progress);
}

type OnboardingPaginationDotProps = {
  index: number;
  count: number;
  progress: SharedValue<number>;
  primaryColor: string;
  onPress: () => void;
};

function OnboardingPaginationDot({
  index,
  count,
  progress,
  primaryColor,
  onPress,
}: OnboardingPaginationDotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const distance = Math.min(
      1,
      getPaginationDotDistance(progress.value, index, count),
    );

    return {
      width: interpolate(
        distance,
        [0, 1],
        [DOT_ACTIVE_WIDTH, DOT_SIZE],
        Extrapolation.CLAMP,
      ),
      height: DOT_SIZE,
      borderRadius: interpolate(
        distance,
        [0, 1],
        [DOT_ACTIVE_RADIUS, DOT_INACTIVE_RADIUS],
        Extrapolation.CLAMP,
      ),
      backgroundColor: interpolateColor(
        distance,
        [0, 1],
        [primaryColor, DOT_INACTIVE_COLOR],
      ),
      opacity: interpolate(distance, [0, 1], [1, 0.72], Extrapolation.CLAMP),
    };
  }, [count, index, primaryColor, progress]);

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View style={dotStyle} />
    </Pressable>
  );
}

type OnboardingPaginationProps = {
  count: number;
  progress: SharedValue<number>;
  primaryColor: string;
  onPress: (index: number) => void;
};

export function OnboardingPagination({
  count,
  progress,
  primaryColor,
  onPress,
}: OnboardingPaginationProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <OnboardingPaginationDot
          key={index}
          index={index}
          count={count}
          progress={progress}
          primaryColor={primaryColor}
          onPress={() => onPress(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
