import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedView } from "@/components/themed-view";
import { DonateHeader } from "@/components/ui/donate/donate-header";
import { DonationStepIndicator } from "@/components/ui/donate/donation-step-indicator";
import { MedicalQuestionsStep } from "@/components/ui/donate/medical-questions-step";
import { PersonalDataStep } from "@/components/ui/donate/personal-data-step";
import { Fonts } from "@/constants/theme";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const STEPS = [
  { stepNumber: 1, label: "Medical Questions" },
  { stepNumber: 2, label: "Personal Data" },
] as const;

const SLIDE_DURATION = 300;

export default function DonateBloodFlowScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = screenWidth - 40;

  const [currentStep, setCurrentStep] = useState(1);
  const [canContinue, setCanContinue] = useState(false);
  const slideOffset = useSharedValue(0);

  useEffect(() => {
    slideOffset.value = withTiming(
      currentStep === 1 ? 0 : -contentWidth,
      { duration: SLIDE_DURATION },
    );
  }, [contentWidth, currentStep, slideOffset]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === 2) {
      goToStep(1);
      return;
    }
    router.back();
  }, [currentStep, goToStep]);

  const handleStepPress = useCallback(
    (stepNumber: number) => {
      if (stepNumber < currentStep) {
        goToStep(stepNumber);
      }
    },
    [currentStep, goToStep],
  );

  const handleContinue = () => {
    if (currentStep === 1 && canContinue) {
      goToStep(2);
    }
  };

  const handleConfirm = () => {
    // TODO: submit personal data and schedule verification
  };

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideOffset.value }],
  }));

  return (
    <ThemedView safe style={styles.container}>
      <DonateHeader title="Donate Blood" onBack={handleBack} />

      <DonationStepIndicator
        currentStep={currentStep}
        steps={[...STEPS]}
        onStepPress={handleStepPress}
      />

      <ThemedView style={styles.stepContent}>
        <Animated.View
          style={[
            styles.slideRow,
            { width: contentWidth * 2 },
            slideStyle,
          ]}
        >
          <ThemedView style={[styles.stepPanel, { width: contentWidth }]}>
            <MedicalQuestionsStep onValidityChange={setCanContinue} />
          </ThemedView>
          <ThemedView style={[styles.stepPanel, { width: contentWidth }]}>
            <PersonalDataStep />
          </ThemedView>
        </Animated.View>
      </ThemedView>

      <ThemedView style={styles.footer}>
        {currentStep === 1 ? (
          <Button
            size="large"
            disabled={!canContinue}
            onPress={handleContinue}
            textStyle={{ fontFamily: Fonts.inter.bold, fontSize: 16 }}
          >
            Continue
          </Button>
        ) : (
          <Button
            size="large"
            onPress={handleConfirm}
            textStyle={{ fontFamily: Fonts.inter.bold, fontSize: 16 }}
          >
            Confirm Details
          </Button>
        )}
        <Spacer height={4} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  slideRow: {
    flexDirection: "row",
    flex: 1,
  },
  stepPanel: {
    flex: 1,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
