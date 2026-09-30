import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ConfidentialityNote } from "@/components/ui/donate/confidentiality-note";
import { MedicalQuestionRow } from "@/components/ui/donate/medical-question-row";
import { YesNoAnswer } from "@/components/ui/donate/yes-no-radio-group";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { ScreeningQuestion } from "../../../../services/questionnaire.service";

type MedicalQuestionsStepProps = {
  questions: ScreeningQuestion[];
  answers: Record<string, YesNoAnswer>;
  loading?: boolean;
  onAnswer: (id: string, value: YesNoAnswer) => void;
  onValidityChange: (isValid: boolean) => void;
};

export function MedicalQuestionsStep({
  questions,
  answers,
  loading = false,
  onAnswer,
  onValidityChange,
}: MedicalQuestionsStepProps) {
  const theme = useTheme();

  const allAnswered = useMemo(
    () =>
      questions.length > 0 &&
      questions.every((item) => answers[item.id] === "yes" || answers[item.id] === "no"),
    [answers, questions],
  );

  useEffect(() => {
    onValidityChange(allAnswered);
  }, [allAnswered, onValidityChange]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <ThemedText style={styles.heading}>Medical questions</ThemedText>
      <ThemedText style={[styles.intro, { color: theme.textSecondary }]}>
        Before you can become a blood donor, we'll ask you a few medical
        questions to ensure it's safe for you and the recipient.
      </ThemedText>

      <Spacer height={16} />
      <ConfidentialityNote />
      <Spacer height={20} />

      {loading ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <ThemedView style={[styles.questionnaireCard, { shadowColor: theme.text }]}>
          <ThemedText style={styles.cardTitle}>
            Please complete the questions
          </ThemedText>

          <ThemedView style={styles.questions}>
            {questions.map((item, index) => (
              <MedicalQuestionRow
                key={item.id}
                question={item.text}
                value={answers[item.id] ?? null}
                onChange={(value) => onAnswer(item.id, value)}
                showDivider={index < questions.length - 1}
              />
            ))}
            {!questions.length ? (
              <ThemedText style={{ color: theme.textSecondary }}>
                Save your details to load the screening questions.
              </ThemedText>
            ) : null}
          </ThemedView>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 16,
  },
  heading: {
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  intro: {
    marginTop: 8,
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  questionnaireCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
    marginBottom: 16,
  },
  questions: {
    gap: 16,
    backgroundColor: "transparent",
  },
});
