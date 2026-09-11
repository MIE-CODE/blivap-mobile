import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedView } from "@/components/themed-view";
import { DonateHeader } from "@/components/ui/donate/donate-header";
import {
  DonateOptionCard,
  DonationOption,
} from "@/components/ui/donate/donate-option-card";
import { UrgentAlertBanner } from "@/components/ui/donate/urgent-alert-banner";
import { Fonts } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const DONATION_OPTIONS: DonationOption[] = ["blood", "request", "sperm"];

export function DonateOptionsScreen() {
  const [selectedOption, setSelectedOption] = useState<DonationOption>("blood");

  const startBloodDonation = () => {
    router.push("/donate-blood/verify-identity");
  };

  const handleConfirm = () => {
    if (selectedOption === "blood") {
      startBloodDonation();
    }
  };

  const handleCtaPress = (option: DonationOption) => {
    if (option === "blood") {
      startBloodDonation();
    }
  };

  return (
    <ThemedView safe style={styles.container}>
      <DonateHeader />
      <Spacer height={8} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <UrgentAlertBanner />

        <ThemedView style={styles.cards}>
          {DONATION_OPTIONS.map((option) => (
            <DonateOptionCard
              key={option}
              option={option}
              selected={selectedOption === option}
              onPress={() => setSelectedOption(option)}
              onCtaPress={() => handleCtaPress(option)}
            />
          ))}
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <Button
          size="large"
          onPress={handleConfirm}
          textStyle={{ fontFamily: Fonts.inter.bold, fontSize: 16 }}
          style={{ borderRadius: 16 }}
        >
          Confirm Donation
        </Button>
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
  scrollContent: {
    paddingBottom: 16,
  },
  cards: {
    gap: 16,
    backgroundColor: "transparent",
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
