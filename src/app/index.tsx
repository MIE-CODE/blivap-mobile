import { LoginScreen } from "@/components/auth/login-screen";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { OnboardingPagination } from "@/components/ui/onboarding/onboarding-pagination";
import { Fonts } from "@/constants/theme";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useTheme } from "@/hooks/use-theme";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  createAnimatedComponent,
  Easing,
  FadeIn,
  FadeOut,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { Carousel, type CarouselRef } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "../../stores/hooks";

const HANDLE_SIZE = 44;
const TRACK_PADDING = 10;
const COMPLETE_THRESHOLD = 0.75;
const TRACK_IDLE_COLOR = "#FFE2E2";
const CHEVRON_COLOR = "#111827";
const CHEVRON_OPACITY_STEPS = [
  [1, 0.7, 0.4],
  [0.4, 1, 0.7],
  [0.4, 0.7, 1],
] as const;
const CHEVRON_WAVE_STEP_MS = 1000;
const CHEVRON_WAVE_DELAY_MS = 180;

const AnimatedFontAwesome6 = createAnimatedComponent(FontAwesome6);

const ONBOARDING_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    title: "Donate. Save Lives.",
    description:
      "Find nearby donation centers for blood and sperm donation. Book a slot, get matched, and help patients in need.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    title: "Book. Match. Donate.",
    description:
      "Schedule appointments at verified centers, get matched with recipients, and make every donation count.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    title: "Join the Community.",
    description:
      "Track your impact, earn rewards, and stay connected with donors and patients across Africa.",
  },
] as const;

type OnboardingSlide = (typeof ONBOARDING_SLIDES)[number];

type SlideToGetStartedButtonProps = {
  onComplete: () => void;
  primaryColor: string;
};

type AnimatedChevronsProps = {
  dragProgress: SharedValue<number>;
};

function AnimatedChevrons({ dragProgress }: AnimatedChevronsProps) {
  const waveStep = useSharedValue(0);

  useEffect(() => {
    waveStep.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(
          CHEVRON_WAVE_DELAY_MS,
          withTiming(1, {
            duration: CHEVRON_WAVE_STEP_MS,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        withDelay(
          CHEVRON_WAVE_DELAY_MS,
          withTiming(2, {
            duration: CHEVRON_WAVE_STEP_MS,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
        withDelay(
          CHEVRON_WAVE_DELAY_MS,
          withTiming(3, {
            duration: CHEVRON_WAVE_STEP_MS,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(waveStep);
    };
  }, [waveStep]);

  return (
    <View style={styles.ctaChevrons}>
      {CHEVRON_OPACITY_STEPS[0].map((_, index) => (
        <AnimatedChevron
          key={index}
          index={index}
          waveStep={waveStep}
          dragProgress={dragProgress}
        />
      ))}
    </View>
  );
}

type AnimatedChevronProps = {
  index: number;
  waveStep: SharedValue<number>;
  dragProgress: SharedValue<number>;
};

function AnimatedChevron({
  index,
  waveStep,
  dragProgress,
}: AnimatedChevronProps) {
  const chevronStyle = useAnimatedStyle(() => {
    const step = waveStep.value % 3;
    const currentStep = Math.floor(step);
    const nextStep = (currentStep + 1) % 3;
    const fraction = step - currentStep;

    return {
      opacity:
        CHEVRON_OPACITY_STEPS[currentStep][index] +
        (CHEVRON_OPACITY_STEPS[nextStep][index] -
          CHEVRON_OPACITY_STEPS[currentStep][index]) *
          fraction,
    };
  });

  const chevronProps = useAnimatedProps(() => ({
    color: interpolateColor(
      dragProgress.value,
      [0, 0.72, 1],
      [CHEVRON_COLOR, CHEVRON_COLOR, "#FFFFFF"],
    ),
  }));

  return (
    <Animated.View style={chevronStyle}>
      <AnimatedFontAwesome6
        animatedProps={chevronProps}
        name="chevron-right"
        size={12}
      />
    </Animated.View>
  );
}

function startDragHint(
  nudgeX: SharedValue<number>,
  wobble: SharedValue<number>,
) {
  nudgeX.value = withRepeat(
    withSequence(
      withDelay(
        700,
        withSequence(
          withSpring(10, { damping: 11, stiffness: 170, mass: 0.6 }),
          withSpring(3, { damping: 14, stiffness: 220 }),
          withTiming(0, { duration: 280, easing: Easing.out(Easing.cubic) }),
        ),
      ),
      withDelay(2000, withTiming(0, { duration: 0 })),
    ),
    -1,
    false,
  );

  wobble.value = withRepeat(
    withSequence(
      withDelay(
        700,
        withSequence(
          withTiming(-5, {
            duration: 220,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(5, {
            duration: 420,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0, {
            duration: 220,
            easing: Easing.inOut(Easing.quad),
          }),
        ),
      ),
      withDelay(2000, withTiming(0, { duration: 0 })),
    ),
    -1,
    false,
  );
}

function SlideToGetStartedButton({
  onComplete,
  primaryColor,
}: SlideToGetStartedButtonProps) {
  const translateX = useSharedValue(0);
  const maxTranslate = useSharedValue(0);
  const startX = useSharedValue(0);
  const hintNudgeX = useSharedValue(0);
  const hintWobble = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const dragProgress = useSharedValue(0);

  const restartHint = useCallback(() => {
    startDragHint(hintNudgeX, hintWobble);
  }, [hintNudgeX, hintWobble]);

  useEffect(() => {
    startDragHint(hintNudgeX, hintWobble);

    return () => {
      cancelAnimation(hintNudgeX);
      cancelAnimation(hintWobble);
    };
  }, [hintNudgeX, hintWobble]);

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    maxTranslate.value = Math.max(0, width - HANDLE_SIZE - TRACK_PADDING * 2);
  };

  const complete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-12, 12])
    .onBegin(() => {
      isDragging.value = true;
      cancelAnimation(hintNudgeX);
      cancelAnimation(hintWobble);
      hintNudgeX.value = 0;
      hintWobble.value = 0;
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const next = startX.value + event.translationX;
      translateX.value = Math.min(Math.max(0, next), maxTranslate.value);
      dragProgress.value =
        maxTranslate.value > 0 ? translateX.value / maxTranslate.value : 0;
    })
    .onEnd(() => {
      const threshold = maxTranslate.value * COMPLETE_THRESHOLD;

      if (translateX.value >= threshold) {
        translateX.value = withSpring(maxTranslate.value);
        dragProgress.value = 1;
        runOnJS(complete)();
        return;
      }

      isDragging.value = false;
      dragProgress.value = withSpring(0);
      translateX.value = withSpring(0, {}, (finished) => {
        if (finished) {
          runOnJS(restartHint)();
        }
      });
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          translateX.value + (isDragging.value ? 0 : hintNudgeX.value),
      },
      { rotate: `${isDragging.value ? 0 : hintWobble.value}deg` },
    ],
  }));

  const trackStyle = useAnimatedStyle(() => {
    const progress =
      maxTranslate.value > 0 ? translateX.value / maxTranslate.value : 0;

    return {
      backgroundColor: interpolateColor(
        progress,
        [0, 0.45, 1],
        [TRACK_IDLE_COLOR, "#FFC4C4", primaryColor],
      ),
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const progress =
      maxTranslate.value > 0 ? translateX.value / maxTranslate.value : 0;

    return {
      color: interpolateColor(
        progress,
        [0, 0.72, 1],
        ["#111827", "#111827", "#FFFFFF"],
      ),
    };
  });

  return (
    <Animated.View
      style={[styles.ctaButton, trackStyle]}
      onLayout={onTrackLayout}
    >
      <Animated.Text style={[styles.ctaText, labelStyle]}>
        Get Started
      </Animated.Text>
      <AnimatedChevrons dragProgress={dragProgress} />

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.ctaIconWrap,
            styles.ctaHandle,
            { backgroundColor: primaryColor },
            handleStyle,
          ]}
        >
          <Feather name="box" size={18} color="#ffffff" />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default function Index() {
  const hasOnboarded = useAppSelector((state) => state.onboarding.hasOnboarded);

  if (hasOnboarded) {
    return <LoginScreen />;
  }

  return <OnboardingScreen />;
}

function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { completeOnboardingFlow } = useOnboarding();
  const isCompleting = useRef(false);
  const carouselRef = useRef<CarouselRef>(null);
  const carouselProgress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const finish = useCallback(async () => {
    if (isCompleting.current) return;
    isCompleting.current = true;

    await completeOnboardingFlow();
  }, [completeOnboardingFlow]);

  const activeSlide = ONBOARDING_SLIDES[activeIndex];

  return (
    <View style={styles.screen}>
      <Carousel<OnboardingSlide>
        ref={carouselRef}
        style={{ width, height }}
        data={[...ONBOARDING_SLIDES]}
        loop
        autoplay
        autoplayInterval={4500}
        animation={{ type: "timing", duration: 900 }}
        progress={carouselProgress}
        onSnapToItem={setActiveIndex}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.background}
            resizeMode="cover"
          />
        )}
      />

      <View style={styles.overlay} pointerEvents="none" />

      <ThemedView
        style={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 16,
          },
        ]}
        pointerEvents="box-none"
      >
        <ThemedView style={styles.topRow}>
          <OnboardingPagination
            progress={carouselProgress}
            count={ONBOARDING_SLIDES.length}
            primaryColor={theme.primary}
            onPress={(index) =>
              carouselRef.current?.scrollTo({ index, animated: true })
            }
          />

          <Pressable onPress={finish} hitSlop={12}>
            <ThemedText style={styles.skipText}>Skip</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.bottomSection}>
          <Animated.View
            key={activeSlide.title}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(250)}
            style={styles.slideCopy}
          >
            <ThemedText style={styles.title}>{activeSlide.title}</ThemedText>
            <ThemedText style={styles.description}>
              {activeSlide.description}
            </ThemedText>
          </Animated.View>

          <SlideToGetStartedButton
            onComplete={finish}
            primaryColor={theme.primary}
          />
        </ThemedView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  content: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  skipText: {
    color: "#111827",
    fontFamily: Fonts.inter.medium,
    fontSize: 14,
  },
  bottomSection: {
    gap: 16,
    backgroundColor: "transparent",
  },
  slideCopy: {
    gap: 16,
  },
  title: {
    color: "#ffffff",
    fontFamily: Fonts.inter.bold,
    fontSize: 34,
    lineHeight: 40,
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: Fonts.inter.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  ctaButton: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    minHeight: HANDLE_SIZE + TRACK_PADDING * 2,
    paddingVertical: TRACK_PADDING,
    paddingHorizontal: TRACK_PADDING,
    marginTop: 8,
    overflow: "hidden",
  },
  ctaHandle: {
    position: "absolute",
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    zIndex: 2,
  },
  ctaIconWrap: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
    paddingHorizontal: HANDLE_SIZE + 16,
  },
  ctaChevrons: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
});
