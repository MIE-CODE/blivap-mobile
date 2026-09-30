import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedView } from "@/components/themed-view";
import { DonateHeader } from "@/components/ui/donate/donate-header";
import { DonationStepIndicator } from "@/components/ui/donate/donation-step-indicator";
import { MedicalQuestionsStep } from "@/components/ui/donate/medical-questions-step";
import { YesNoAnswer } from "@/components/ui/donate/yes-no-radio-group";
import {
  DonorRegistrationDraft,
  PersonalDataStep,
} from "@/components/ui/donate/personal-data-step";
import { Fonts } from "@/constants/theme";
import { parseGeneratedQuestionnaire } from "@/utils/questionnaire";
import { getErrorMessage } from "../../../../utils/lib";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Toast from "react-native-toast-message";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { $api } from "../../../../services/api-client";
import { ScreeningQuestion } from "../../../../services/questionnaire.service";
import { BloodType } from "../../../../types/donor";

const STEPS = [
  { stepNumber: 1, label: "Personal Data" },
  { stepNumber: 2, label: "Medical Questions" },
] as const;

const EMPTY_DRAFT: DonorRegistrationDraft = {
  bloodType: "",
  country: "",
  state: "",
  city: "",
  area: "",
  expenseCoverage: "self",
};

const SLIDE_DURATION = 300;

export default function DonateBloodFlowScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = screenWidth - 40;

  const [currentStep, setCurrentStep] = useState(1);
  const [canContinue, setCanContinue] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<DonorRegistrationDraft>(EMPTY_DRAFT);
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, YesNoAnswer>>({});
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

  const handleDraftChange = useCallback((next: DonorRegistrationDraft) => {
    setDraft(next);
  }, []);

  const handleAnswer = useCallback((id: string, value: YesNoAnswer) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  }, []);

  const handleContinue = async () => {
    if (currentStep !== 1 || !canContinue) return;
    try {
      setSubmitting(true);
      const areaLocation = {
        country: draft.country.trim(),
        state: draft.state.trim(),
        city: draft.city.trim(),
        area: draft.area.trim(),
      };
      await $api.donors.register({
        bloodType: draft.bloodType as BloodType,
        areaLocation,
        expenseCoverage: draft.expenseCoverage,
      });
      const generated = await $api.questionnaire.generate("whole_blood");
      const parsed = parseGeneratedQuestionnaire(generated);
      if (!parsed) {
        Toast.show({
          type: "error",
          text1: "Could not load medical questions",
        });
        return;
      }
      setQuestionnaireId(parsed.questionnaireId);
      setQuestions(parsed.questions);
      goToStep(2);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not save donor details"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!questionnaireId || !canConfirm) return;
    try {
      setSubmitting(true);
      await $api.questionnaire.answer(
        questionnaireId,
        questions.map((question) => ({
          questionId: question.id,
          answer: answers[question.id] === "yes" ? "YES" : "NO",
        })),
      );
      await $api.donors.requestActivation({
        areaLocation: {
          country: draft.country.trim(),
          state: draft.state.trim(),
          city: draft.city.trim(),
          area: draft.area.trim(),
        },
        donationType: "whole_blood",
      });
      Toast.show({ type: "success", text1: "Donor profile submitted" });
      router.replace("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Could not submit your answers"),
      });
    } finally {
      setSubmitting(false);
    }
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
            <PersonalDataStep
              onDraftChange={handleDraftChange}
              onValidityChange={setCanContinue}
            />
          </ThemedView>
          <ThemedView style={[styles.stepPanel, { width: contentWidth }]}>
            <MedicalQuestionsStep
              questions={questions}
              answers={answers}
              loading={submitting && currentStep === 1}
              onAnswer={handleAnswer}
              onValidityChange={setCanConfirm}
            />
          </ThemedView>
        </Animated.View>
      </ThemedView>

      <ThemedView style={styles.footer}>
        {currentStep === 1 ? (
          <Button
            size="large"
            disabled={!canContinue || submitting}
            loading={submitting}
            onPress={() => void handleContinue()}
            textStyle={{ fontFamily: Fonts.inter.bold, fontSize: 16 }}
          >
            Continue
          </Button>
        ) : (
          <Button
            size="large"
            disabled={!canConfirm || submitting}
            loading={submitting}
            onPress={() => void handleConfirm()}
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
