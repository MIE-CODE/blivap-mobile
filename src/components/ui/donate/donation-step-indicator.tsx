import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

export type DonationStep = {
  label: string;
  stepNumber: number;
};

type DonationStepIndicatorProps = {
  steps: DonationStep[];
  currentStep: number;
  onStepPress?: (stepNumber: number) => void;
};

export function DonationStepIndicator({
  steps,
  currentStep,
  onStepPress,
}: DonationStepIndicatorProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      {steps.map((step) => {
        const isActive = step.stepNumber === currentStep;
        const isCompleted = step.stepNumber < currentStep;

        const lineColor =
          isCompleted || isActive ? theme.primary : "#E0E0E0";

        const stepTextColor = isCompleted
          ? theme.textSecondary
          : isActive
            ? theme.primary
            : "#757575";

        const labelColor = isActive ? theme.text : "#757575";

        return (
          <Pressable
            key={step.label}
            style={styles.step}
            disabled={!isCompleted || !onStepPress}
            onPress={() => onStepPress?.(step.stepNumber)}
          >
            <ThemedView style={styles.stepHeader}>
              {isCompleted ? (
                <Feather
                  name="check"
                  size={13}
                  color={theme.status.success}
                  strokeWidth={2.5}
                />
              ) : (
                <ThemedView
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isActive ? theme.primary : "#D1D5DB",
                    },
                  ]}
                />
              )}
              <ThemedText
                style={[
                  styles.stepNumber,
                  {
                    color: stepTextColor,
                    fontFamily: isActive
                      ? Fonts.inter.semiBold
                      : Fonts.inter.regular,
                  },
                ]}
              >
                Step {step.stepNumber}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.line, { backgroundColor: lineColor }]} />

            <ThemedText
              style={[
                styles.label,
                {
                  color: labelColor,
                  fontFamily: isActive
                    ? Fonts.inter.semiBold
                    : Fonts.inter.regular,
                },
              ]}
            >
              {step.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  step: {
    flex: 1,
    gap: 6,
    backgroundColor: "transparent",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "transparent",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: "100%",
    height: 4,
    borderRadius: 2,
  },
  stepNumber: {
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
});
