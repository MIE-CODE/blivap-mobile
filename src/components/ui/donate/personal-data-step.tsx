import { Dropdown } from "@/components/dropdown";
import { Spacer } from "@/components/spacer";
import { ThemedDatePicker } from "@/components/themed-date-picker";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  ResidenceOption,
  ResidenceToggle,
} from "@/components/ui/donate/residence-toggle";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../stores/hooks";
import { BloodType } from "../../../../types/donor";

const BLOOD_TYPE_OPTIONS = (
  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodType[]
).map((value) => ({ label: value, value }));

export type ExpenseCoverage = "requested" | "self";

export type DonorRegistrationDraft = {
  bloodType: string;
  country: string;
  state: string;
  city: string;
  area: string;
  expenseCoverage: ExpenseCoverage;
};

export function isDonorDraftValid(draft: DonorRegistrationDraft) {
  return (
    BLOOD_TYPE_OPTIONS.some((option) => option.value === draft.bloodType) &&
    draft.country.trim().length >= 2 &&
    draft.state.trim().length >= 2 &&
    draft.city.trim().length >= 2 &&
    draft.area.trim().length >= 2
  );
}

type PersonalDataStepProps = {
  onDraftChange: (draft: DonorRegistrationDraft) => void;
  onValidityChange: (isValid: boolean) => void;
};

export function PersonalDataStep({
  onDraftChange,
  onValidityChange,
}: PersonalDataStepProps) {
  const theme = useTheme();
  const { user } = useAppSelector((s) => s.auth);

  const [bloodType, setBloodType] = useState<string | null>(null);
  const [expenseCoverage, setExpenseCoverage] =
    useState<ExpenseCoverage>("self");
  const [form, setForm] = useState({
    fullName: user ? `${user.firstname} ${user.lastname}`.trim() : "",
    dateOfBirth: user?.dateOfBirth ?? "",
    correspondenceName: user?.firstname ?? "",
    email: user?.email ?? "",
    state: "",
    country: "",
    street: "",
    city: "",
    phone: user?.phonenumber ?? "",
  });
  const [residence, setResidence] = useState<ResidenceOption>("nigeria");

  const draft = useMemo<DonorRegistrationDraft>(
    () => ({
      bloodType: bloodType ?? "",
      country: residence === "nigeria" ? "Nigeria" : form.country,
      state: form.state,
      city: form.city,
      area: form.street,
      expenseCoverage,
    }),
    [
      bloodType,
      expenseCoverage,
      form.city,
      form.country,
      form.state,
      form.street,
      residence,
    ],
  );

  useEffect(() => {
    onDraftChange(draft);
    onValidityChange(isDonorDraftValid(draft));
  }, [draft, onDraftChange, onValidityChange]);

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
        Enter your blood type and the area where you can donate. We use city and
        area for matching, not your street number.
      </ThemedText>

      <Spacer height={24} />
      <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
      <Spacer height={14} />

      <ThemedView style={styles.form}>
        <Dropdown
          label="Blood type"
          placeholder="Select blood type"
          options={BLOOD_TYPE_OPTIONS}
          value={bloodType}
          onChange={setBloodType}
        />
        <ThemedView style={styles.expenseBlock}>
          <ThemedText style={styles.emailLabel}>Donor welfare</ThemedText>
          <ThemedText style={[styles.expenseQuestion, { color: theme.text }]}>
            Who will cover the donor's welfare expenses?
          </ThemedText>
          <ThemedView style={styles.expenseOptions}>
            {(
              [
                ["self", "I will cover my own welfare expenses"],
                [
                  "requested",
                  "The person requesting blood will cover the donor's eligible welfare expenses",
                ],
              ] as const
            ).map(([value, label]) => {
              const selected = expenseCoverage === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setExpenseCoverage(value)}
                  style={[
                    styles.expenseOption,
                    {
                      borderColor: selected ? theme.primary : "#D1D5DB",
                      backgroundColor: selected ? "#F8E8EA" : "#FFFFFF",
                    },
                  ]}
                >
                  <ThemedView
                    style={[
                      styles.expenseRadio,
                      {
                        borderColor: selected ? theme.primary : "#D1D5DB",
                        backgroundColor: selected ? theme.primary : "#FFFFFF",
                      },
                    ]}
                  />
                  <ThemedText
                    style={{
                      flex: 1,
                      color: selected ? theme.primary : theme.text,
                      fontFamily: Fonts.inter.medium,
                      fontSize: 13,
                      lineHeight: 18,
                    }}
                  >
                    {label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>
          <ThemedText
            style={[styles.expenseNote, { color: theme.textSecondary }]}
          >
            Welfare support may cover eligible expenses associated with
            attending the donation, such as transportation and refreshments. It
            is not payment for blood.
          </ThemedText>
        </ThemedView>
        <ThemedInput
          label="Full name"
          value={form.fullName}
          onChangeText={(value) => update("fullName", value)}
        />
        <ThemedDatePicker
          label="Date of birth"
          placeholder="Select date of birth"
          value={form.dateOfBirth || null}
          onChange={(iso) => update("dateOfBirth", iso)}
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

        {residence === "abroad" ? (
          <ThemedInput
            label="Country"
            value={form.country}
            onChangeText={(value) => update("country", value)}
          />
        ) : null}

        <ThemedInput
          label="State"
          value={form.state}
          onChangeText={(value) => update("state", value)}
        />
        <ThemedInput
          label="Area"
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
  expenseBlock: {
    gap: 8,
    backgroundColor: "transparent",
  },
  expenseQuestion: {
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  expenseOptions: {
    gap: 8,
    backgroundColor: "transparent",
  },
  expenseOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  expenseRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 1,
  },
  expenseNote: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
});
