import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ThemedView } from "./themed-view";

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton = ({
  width = "100%",
  height = 16,
  borderRadius = 6,
  style,
}: SkeletonProps) => {
  const theme = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.4, { duration: 700 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ width, height, borderRadius }, animatedStyle]}>
      <ThemedView
        style={[
          { flex: 1, borderRadius, backgroundColor: theme.skeleton.shimmer },
          style,
        ]}
      />
    </Animated.View>
  );
};
