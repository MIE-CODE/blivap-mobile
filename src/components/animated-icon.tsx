import { Fonts } from "@/constants/theme";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/** Must match native SplashScreen.storyboard + app.json splash plugin. */
const BRAND = "#960018";
const MARK_WIDTH = 102;
const MARK_HEIGHT = 200;
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const easeInOut = Easing.inOut(Easing.cubic);

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [screen, setScreen] = useState(() => Dimensions.get("screen"));

  // Start matching the native splash so hideAsync is seamless.
  const overlayOpacity = useSharedValue(1);
  const logoOpacity = useSharedValue(1);
  const logoScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.72);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(18);
  const titleScale = useSharedValue(0.96);
  const underline = useSharedValue(0);

  const hide = () => setVisible(false);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ screen: next }) => {
      setScreen(next);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;

    SplashScreen.setOptions({ fade: false, duration: 0 });
    SplashScreen.hideAsync().finally(() => {
      if (cancelled) return;

      glowOpacity.value = withTiming(0.55, { duration: 700, easing: easeOut });
      glowScale.value = withTiming(1.15, { duration: 1100, easing: easeOut });

      logoScale.value = withSequence(
        withTiming(1.06, { duration: 520, easing: easeOut }),
        withTiming(1, { duration: 620, easing: easeInOut }),
      );

      ring1.value = withDelay(80, withTiming(1, { duration: 1100, easing: easeOut }));
      ring2.value = withDelay(260, withTiming(1, { duration: 1200, easing: easeOut }));

      titleOpacity.value = withDelay(
        380,
        withTiming(1, { duration: 520, easing: easeOut }),
      );
      titleY.value = withDelay(
        380,
        withTiming(0, { duration: 620, easing: easeOut }),
      );
      titleScale.value = withDelay(
        380,
        withTiming(1, { duration: 620, easing: easeOut }),
      );
      underline.value = withDelay(
        620,
        withTiming(1, { duration: 480, easing: easeOut }),
      );

      overlayOpacity.value = withDelay(
        1680,
        withTiming(0, { duration: 520, easing: easeInOut }, (finished) => {
          if (finished) runOnJS(hide)();
        }),
      );
      logoOpacity.value = withDelay(
        1580,
        withTiming(0.2, { duration: 420, easing: easeInOut }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [
    glowOpacity,
    glowScale,
    logoOpacity,
    logoScale,
    overlayOpacity,
    ring1,
    ring2,
    titleOpacity,
    titleScale,
    titleY,
    underline,
  ]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => {
    const p = ring1.value;
    return {
      opacity: interpolate(p, [0, 0.25, 1], [0, 0.42, 0], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(p, [0, 1], [0.78, 1.72], Extrapolation.CLAMP) },
      ],
    };
  });

  const ring2Style = useAnimatedStyle(() => {
    const p = ring2.value;
    return {
      opacity: interpolate(p, [0, 0.2, 1], [0, 0.28, 0], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(p, [0, 1], [0.9, 1.95], Extrapolation.CLAMP) },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }, { scale: titleScale.value }],
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    opacity: underline.value,
    transform: [{ scaleX: underline.value }],
  }));

  if (!visible) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      hardwareAccelerated
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.splashOverlay,
          { width: screen.width, height: screen.height },
          overlayStyle,
        ]}
      >
        <View style={styles.markWrap}>
          <Animated.View style={[styles.glow, glowStyle]} />
          <Animated.View style={[styles.ring, ring1Style]} />
          <Animated.View style={[styles.ring, styles.ringSoft, ring2Style]} />
          <Animated.View style={logoStyle}>
            <Image
              style={styles.mark}
              contentFit="contain"
              source={require("@/assets/images/splash-mark.png")}
            />
          </Animated.View>
        </View>

        <Animated.View style={[styles.wordmarkBlock, titleStyle]}>
          <Animated.Text style={styles.wordmark}>Blivap</Animated.Text>
          <Animated.View style={[styles.underline, underlineStyle]} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
  },
  markWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  ring: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.85)",
  },
  ringSoft: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  mark: {
    width: MARK_WIDTH,
    height: MARK_HEIGHT,
  },
  wordmarkBlock: {
    marginTop: 10,
    alignItems: "center",
  },
  wordmark: {
    color: "#ffffff",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 30,
    letterSpacing: 2.4,
  },
  underline: {
    marginTop: 10,
    height: 2,
    width: 42,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
});
