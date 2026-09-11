import { Button } from "@/components/button";
import { Line } from "@/components/themed-line";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SettingsCard } from "@/components/ui/settings/settings-toggle-row";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { SettingsSectionLabel } from "@/components/ui/settings/settings-section-label";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet } from "react-native";

const FAQ_ITEMS = [
  {
    question: "How often can I donate whole blood?",
    answer:
      "You can donate whole blood every 56 days. Platelet donations can be made more frequently, typically every 7 days up to 24 times per year.",
  },
  {
    question: "What should I eat before donating?",
    answer:
      "Eat a healthy, low-fat meal and stay well-hydrated. Avoid fatty foods before donation as they can affect test results.",
  },
  {
    question: "Can I donate if I recently got a tattoo?",
    answer:
      "In most states, yes, as long as the tattoo was applied in a licensed facility and has fully healed.",
  },
  {
    question: "How long does a donation take?",
    answer:
      "The entire process takes about an hour, but the actual blood draw usually lasts 8 to 10 minutes.",
  },
];

export default function HelpSupport() {
  const theme = useTheme();

  return (
    <SettingsScreenLayout title="Help & Support">
      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Frequently Asked Questions" />
        <SettingsCard>
          {FAQ_ITEMS.map((item, index) => (
            <ThemedView key={item.question}>
              <ThemedView style={styles.faqItem}>
                <ThemedText style={styles.faqQuestion}>{item.question}</ThemedText>
                <ThemedText
                  style={[styles.faqAnswer, { color: theme.textSecondary }]}
                >
                  {item.answer}
                </ThemedText>
              </ThemedView>
              {index < FAQ_ITEMS.length - 1 ? (
                <Line
                  strokeWidth={1}
                  strokeColor="#E5E7EB"
                  style={styles.divider}
                />
              ) : null}
            </ThemedView>
          ))}
        </SettingsCard>
      </ThemedView>

      <ThemedView style={styles.section}>
        <SettingsSectionLabel title="Contact Us" />
        <SettingsCard>
          <Pressable
            onPress={() => Linking.openURL("mailto:support@blivapdonation.org")}
          >
            <ContactRow
              title="Email Support"
              value="support@blivapdonation.org"
              icon="mail"
            />
          </Pressable>
          <Line strokeWidth={1} strokeColor="#E5E7EB" style={styles.divider} />
          <Pressable onPress={() => Linking.openURL("tel:18005552566")}>
            <ContactRow
              title="Phone Support"
              value="1-800-555-BLOOD (2566)"
              icon="phone"
            />
          </Pressable>
        </SettingsCard>
      </ThemedView>

      <Button size="large" onPress={() => {}}>
        Report a Problem
      </Button>
    </SettingsScreenLayout>
  );
}

function ContactRow({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: "mail" | "phone";
}) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.contactRow}>
      <ThemedView style={[styles.contactIcon, { backgroundColor: "#FFE2E2" }]}>
        <Feather name={icon} size={16} color={theme.primary} />
      </ThemedView>
      <ThemedView style={styles.contactCopy}>
        <ThemedText style={styles.contactTitle}>{title}</ThemedText>
        <ThemedText style={[styles.contactValue, { color: theme.textSecondary }]}>
          {value}
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={[styles.chevronWrap, { backgroundColor: theme.backgroundElement }]}
      >
        <Feather name="chevron-right" size={16} color={theme.textSecondary} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  faqQuestion: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  faqAnswer: {
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    marginHorizontal: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contactCopy: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  contactValue: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
