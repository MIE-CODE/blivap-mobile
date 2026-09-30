import { Fonts } from "@/constants/theme";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Keyframe,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const INITIAL_SCALE_FACTOR = Dimensions.get("screen").height / 90;
const DURATION = 600;
const BRAND = "#960018";
const easeOut = Easing.out(Easing.cubic);

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.86);
  const ringScale = useSharedValue(0.7);
  const ringOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(14);
  const overlayOpacity = useSharedValue(1);

  const hide = () => setVisible(false);

  useEffect(() => {
    let cancelled = false;

    SplashScreen.hideAsync().finally(() => {
      if (cancelled) return;

      logoOpacity.value = withTiming(1, { duration: 560, easing: easeOut });
      logoScale.value = withTiming(1, { duration: 780, easing: easeOut });

      ringOpacity.value = withDelay(
        140,
        withTiming(0.35, { duration: 280, easing: easeOut }, (finished) => {
          if (finished) {
            ringOpacity.value = withTiming(0, { duration: 720, easing: easeOut });
          }
        }),
      );
      ringScale.value = withDelay(
        140,
        withTiming(1.55, { duration: 980, easing: easeOut }),
      );

      titleOpacity.value = withDelay(
        340,
        withTiming(1, { duration: 480, easing: easeOut }),
      );
      titleY.value = withDelay(
        340,
        withTiming(0, { duration: 560, easing: easeOut }),
      );

      overlayOpacity.value = withDelay(
        1480,
        withTiming(0, { duration: 460, easing: Easing.inOut(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(hide)();
        }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [logoOpacity, logoScale, overlayOpacity, ringOpacity, ringScale, titleOpacity, titleY]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.splashOverlay, overlayStyle]}>
      <View style={styles.markWrap}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={logoStyle}>
          <Image
            style={styles.mark}
            contentFit="contain"
            source={require("@/assets/images/splash-mark.png")}
          />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.wordmark, titleStyle]}>Blivap</Animated.Text>
    </Animated.View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View
        entering={glowKeyframe.duration(60 * 1000 * 4)}
        style={styles.glow}
      >
        <Image
          style={styles.glow}
          source={require("@/assets/images/logo-glow.png")}
        />
      </Animated.View>

      <Animated.View
        entering={keyframe.duration(DURATION)}
        style={styles.background}
      />
      <Animated.View
        style={styles.imageContainer}
        entering={logoKeyframe.duration(DURATION)}
      >
        <Image
          style={styles.image}
          source={require("@/assets/images/expo-logo.png")}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    width: 201,
    height: 201,
    position: "absolute",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: "absolute",
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  markWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  mark: {
    width: 96,
    height: 188,
  },
  wordmark: {
    marginTop: 8,
    color: "#ffffff",
    fontFamily: Fonts.inter.semiBold,
    fontSize: 28,
    letterSpacing: 1.2,
  },
});
