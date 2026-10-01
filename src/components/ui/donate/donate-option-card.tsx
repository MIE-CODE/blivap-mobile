import BloodDropWhiteIcon from "@/assets/icons/blood-drop-white.svg";
import HeartDonationIcon from "@/assets/icons/heart-donation.svg";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { DonateColors } from "./donate-colors";

export type DonationOption = "blood" | "request" | "sperm";

type DonateOptionCardProps = {
  option: DonationOption;
  selected: boolean;
  onPress: () => void;
  onCtaPress?: () => void;
};

const CARD_CONTENT: Record<
  DonationOption,
  {
    tag: string;
    title: string;
    description: string;
    cta: string;
  }
> = {
  blood: {
    tag: "GIVE LIFE",
    title: "Donate Blood",
    description:
      "Give blood to save lives. Find nearby active donation camps, check eligibility, and schedule a walk-in.",
    cta: "Start Donation Journey",
  },
  request: {
    tag: "EMERGENCY",
    title: "Request Donation",
    description:
      "Request blood from registered compatible donors in your area. Initiate fast-track emergency requests.",
    cta: "Create Request Post",
  },
  sperm: {
    tag: "SPERM",
    title: "Sperm Donation",
    description:
      "Become a sperm donor and help families build their future. Learn eligibility criteria and the donation process.",
    cta: "Learn More",
  },
};

export function DonateOptionCard({
  option,
  selected,
  onPress,
  onCtaPress,
}: DonateOptionCardProps) {
  const theme = useTheme();
  const content = CARD_CONTENT[option];
  const isBlood = option === "blood";
  const isRequest = option === "request";
  const isSperm = option === "sperm";

  const accentColor = isSperm ? DonateColors.spermAccent : theme.primary;

  return (
    <Pressable onPress={onPress}>
      <ThemedView
        style={[
          styles.card,
          isBlood
            ? {
                backgroundColor: theme.primary,
                shadowColor: DonateColors.cardShadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 12,
                elevation: 6,
                borderWidth: selected ? 2 : 0,
                borderColor: selected ? "#FFFFFF" : "transparent",
              }
            : {
                backgroundColor: theme.card,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? accentColor : accentColor,
                shadowColor: theme.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              },
        ]}
      >
        <ThemedView style={styles.cardHeader}>
          <ThemedView
            style={[
              styles.iconWrap,
              isBlood && { backgroundColor: DonateColors.giveLifeTagBg },
              isRequest && { backgroundColor: DonateColors.requestIconBg },
              isSperm && { backgroundColor: DonateColors.spermIconBg },
            ]}
          >
            {isBlood ? (
              <BloodDropWhiteIcon width={20} height={20} />
            ) : (
              <HeartDonationIcon
                width={16}
                height={16}
                color={accentColor}
              />
            )}
          </ThemedView>

          <ThemedView
            style={[
              styles.tag,
              isBlood && { backgroundColor: DonateColors.giveLifeTagBg },
              isRequest && { backgroundColor: DonateColors.emergencyTagBg },
              isSperm && { backgroundColor: DonateColors.spermTagBg },
            ]}
          >
            <ThemedText
              style={[
                styles.tagText,
                {
                  color: isBlood ? "#FFFFFF" : accentColor,
                },
              ]}
            >
              {content.tag}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText
          style={[
            styles.title,
            { color: isBlood ? "#FFFFFF" : theme.text },
          ]}
        >
          {content.title}
        </ThemedText>

        <ThemedText
          style={[
            styles.description,
            {
              color: isBlood ? "rgba(255, 255, 255, 0.85)" : theme.textSecondary,
            },
          ]}
        >
          {content.description}
        </ThemedText>

        <Pressable
          style={styles.ctaRow}
          onPress={(event) => {
            event.stopPropagation?.();
            onCtaPress?.();
          }}
        >
          <ThemedText
            style={[
              styles.ctaText,
              { color: isBlood ? "#FFFFFF" : accentColor },
            ]}
          >
            {content.cta}
          </ThemedText>
          <Feather
            name="chevron-right"
            size={16}
            color={isBlood ? "#FFFFFF" : accentColor}
          />
        </Pressable>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 10,
    fontFamily: Fonts.poppins.semiBold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.inter.bold,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: Fonts.poppins.regular,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
    backgroundColor: "transparent",
  },
  ctaText: {
    fontSize: 13,
    fontFamily: Fonts.poppins.semiBold,
  },
});
