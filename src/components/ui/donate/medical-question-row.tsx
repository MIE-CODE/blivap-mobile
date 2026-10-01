import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { YesNoAnswer, YesNoRadioGroup } from "./yes-no-radio-group";

type MedicalQuestionRowProps = {
  question: string;
  value: YesNoAnswer;
  onChange: (value: YesNoAnswer) => void;
  onInfoPress?: () => void;
  showDivider?: boolean;
};

export function MedicalQuestionRow({
  question,
  value,
  onChange,
  onInfoPress,
  showDivider = true,
}: MedicalQuestionRowProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.questionRow}>
        <ThemedText style={styles.question}>{question}</ThemedText>
        <Pressable
          style={[styles.infoBtn, { borderColor: theme.primary }]}
          onPress={onInfoPress}
          hitSlop={8}
        >
          <Feather name="info" size={10} color={theme.primary} />
        </Pressable>
      </ThemedView>

      <YesNoRadioGroup value={value} onChange={onChange} />

      {showDivider ? (
        <Line strokeWidth={1} strokeColor={theme.hairline} style={styles.divider} />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    backgroundColor: "transparent",
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "transparent",
  },
  question: {
    flex: 1,
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  infoBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  divider: {
    marginTop: 4,
  },
});
