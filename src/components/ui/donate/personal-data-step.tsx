import { Spacer } from "@/components/spacer";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { NinUploadSection } from "@/components/ui/donate/nin-upload-section";
import {
  ResidenceOption,
  ResidenceToggle,
} from "@/components/ui/donate/residence-toggle";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../stores/hooks";

export function PersonalDataStep() {
  const theme = useTheme();
  const { user } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({
    fullName: user ? `${user.firstname} ${user.lastname}`.trim() : "Katty George",
    dateOfBirth: user?.dateOfBirth ?? "24-10-1998",
    correspondenceName: user?.firstname ?? "Katty",
    email: user?.email ?? "katty.george@mail.com",
    postalCode: "98852",
    houseNumber: "12B",
    street: "Orchard Street",
    city: "Lagos",
    phone: user?.phonenumber ?? "+234 812 345 6789",
  });
  const [residence, setResidence] = useState<ResidenceOption>("nigeria");

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <ThemedText style={styles.heading}>Get tested</ThemedText>
      <ThemedText style={[styles.intro, { color: theme.textSecondary }]}>
        You meet the main medical requirements. Enter your personal details as
        stated on your NIN Card to schedule verification.
      </ThemedText>

      <Spacer height={20} />
      <NinUploadSection />

      <Spacer height={24} />
      <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
      <Spacer height={14} />

      <ThemedView style={styles.form}>
        <ThemedInput
          label="Full name"
          value={form.fullName}
          onChangeText={(value) => update("fullName", value)}
        />
        <ThemedInput
          label="Date of birth"
          value={form.dateOfBirth}
          onChangeText={(value) => update("dateOfBirth", value)}
        />
        <ThemedInput
          label="Correspondence name"
          value={form.correspondenceName}
          onChangeText={(value) => update("correspondenceName", value)}
        />

        <ThemedView style={styles.emailHighlight}>
          <ThemedText style={styles.emailLabel}>Email address</ThemedText>
          <ThemedText
            style={[styles.emailHint, { color: theme.textSecondary }]}
          >
            A valid email address is required to arrange your donation
            appointments.
          </ThemedText>
          <ThemedInput
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => update("email", value)}
          />
        </ThemedView>

        <ResidenceToggle value={residence} onChange={setResidence} />

        <ThemedView style={styles.addressRow}>
          <ThemedView style={styles.halfField}>
            <ThemedInput
              placeholder="Postal code"
              value={form.postalCode}
              onChangeText={(value) => update("postalCode", value)}
            />
          </ThemedView>
          <ThemedView style={styles.halfField}>
            <ThemedInput
              placeholder="House no."
              value={form.houseNumber}
              onChangeText={(value) => update("houseNumber", value)}
            />
          </ThemedView>
        </ThemedView>

        <ThemedInput
          label="Street"
          value={form.street}
          onChangeText={(value) => update("street", value)}
        />
        <ThemedInput
          label="City"
          value={form.city}
          onChangeText={(value) => update("city", value)}
        />
        <ThemedInput
          label="Phone number"
          value={form.phone}
          keyboardType="phone-pad"
          onChangeText={(value) => update("phone", value)}
        />
      </ThemedView>
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
  sectionTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
  },
  form: {
    gap: 16,
    backgroundColor: "transparent",
  },
  emailHighlight: {
    backgroundColor: "#FFF1F1",
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  emailLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
  },
  emailHint: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  addressRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  halfField: {
    flex: 1,
  },
});
