import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

const DO_GUIDELINES = [
  "Photo is clear and sharp",
  "Details can be read clearly",
  "All 4 corners of document are visible",
];

const DONT_GUIDELINES = [
  "Photo is blurry and unfocused",
  "Poor quality (too dark or bright)",
];

type NinUploadSectionProps = {
  onUpload?: () => void;
};

export function NinUploadSection({ onUpload }: NinUploadSectionProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Upload your NIN</ThemedText>

      <ThemedView style={styles.cardPreviewRow}>
        <ThemedView style={[styles.idCard, styles.idCardFront]}>
          <ThemedView style={styles.idCardHeader} />
          <ThemedView style={styles.idCardLine} />
          <ThemedView style={[styles.idCardLine, { width: "70%" }]} />
          <ThemedView style={[styles.idCardLine, { width: "50%" }]} />
        </ThemedView>
        <ThemedView style={[styles.idCard, styles.idCardBack]}>
          <ThemedView style={styles.idCardChip} />
          <ThemedView style={styles.idCardLine} />
          <ThemedView style={[styles.idCardLine, { width: "80%" }]} />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.guidelinesRow}>
        <ThemedView style={styles.guidelineColumn}>
          <ThemedText
            style={[styles.guidelineHeading, { color: theme.status.success }]}
          >
            Do
          </ThemedText>
          {DO_GUIDELINES.map((item) => (
            <ThemedView key={item} style={styles.bulletRow}>
              <ThemedText style={[styles.bullet, { color: theme.status.success }]}>
                •
              </ThemedText>
              <ThemedText style={styles.bulletText}>{item}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.guidelineColumn}>
          <ThemedText
            style={[styles.guidelineHeading, { color: theme.status.danger }]}
          >
            Don't
          </ThemedText>
          {DONT_GUIDELINES.map((item) => (
            <ThemedView key={item} style={styles.bulletRow}>
              <ThemedText style={[styles.bullet, { color: theme.status.danger }]}>
                •
              </ThemedText>
              <ThemedText style={styles.bulletText}>{item}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      <Pressable
        style={styles.uploadBox}
        onPress={onUpload}
      >
        <Feather name="file-text" size={28} color={theme.status.info} />
        <ThemedText style={styles.uploadText}>
          Drag & Drop or{" "}
          <ThemedText style={[styles.uploadLink, { color: theme.primary }]}>
            Upload
          </ThemedText>{" "}
          your NIN
        </ThemedText>
        <ThemedText style={[styles.uploadHint, { color: theme.textSecondary }]}>
          File types: pdf, png, jpg, jpeg (Max 5MB)
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
  },
  cardPreviewRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  idCard: {
    flex: 1,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    padding: 8,
    gap: 4,
  },
  idCardFront: {
    transform: [{ rotate: "-4deg" }],
  },
  idCardBack: {
    transform: [{ rotate: "4deg" }],
    marginTop: 4,
  },
  idCardHeader: {
    width: "40%",
    height: 8,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
  },
  idCardChip: {
    width: 16,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#FCD34D",
  },
  idCardLine: {
    width: "90%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
  },
  guidelinesRow: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "transparent",
  },
  guidelineColumn: {
    flex: 1,
    gap: 4,
    backgroundColor: "transparent",
  },
  guidelineHeading: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 12,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "transparent",
  },
  bullet: {
    fontSize: 12,
    lineHeight: 16,
  },
  bulletText: {
    flex: 1,
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  uploadBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderStyle: "dashed",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    textAlign: "center",
  },
  uploadLink: {
    fontFamily: Fonts.inter.semiBold,
    textDecorationLine: "underline",
  },
  uploadHint: {
    fontFamily: Fonts.inter.regular,
    fontSize: 11,
    textAlign: "center",
  },
});
