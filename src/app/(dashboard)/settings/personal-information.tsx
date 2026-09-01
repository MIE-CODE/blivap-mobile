import { ThemedInput } from "@/components/themed-input";
import { ThemedView } from "@/components/themed-view";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function PersonalInformation() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
    gender: "",
    address: "",
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsScreenLayout
      title="Personal Information"
      footerLabel="Save Changes"
      onFooterPress={() => {}}
    >
      <ThemedInput
        label="Full Name"
        placeholder="Input text"
        value={form.fullName}
        onChangeText={(value) => update("fullName", value)}
      />
      <ThemedInput
        label="Email Address"
        placeholder="Input text"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(value) => update("email", value)}
      />
      <ThemedInput
        label="Phone Number"
        placeholder="Input text"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(value) => update("phone", value)}
      />
      <ThemedView style={styles.row}>
        <ThemedView style={styles.half}>
          <ThemedInput
            label="Date of Birth"
            placeholder="Input text"
            value={form.dateOfBirth}
            onChangeText={(value) => update("dateOfBirth", value)}
          />
        </ThemedView>
        <ThemedView style={styles.half}>
          <ThemedInput
            label="Blood Group"
            placeholder="Input text"
            value={form.bloodGroup}
            onChangeText={(value) => update("bloodGroup", value)}
          />
        </ThemedView>
      </ThemedView>
      <ThemedInput
        label="Gender"
        placeholder="Input text"
        value={form.gender}
        onChangeText={(value) => update("gender", value)}
      />
      <ThemedInput
        label="Home Address"
        placeholder="Enter Text Here"
        value={form.address}
        onChangeText={(value) => update("address", value)}
        multiline
        style={styles.addressInput}
        textAlignVertical="top"
      />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  addressInput: {
    minHeight: 120,
    paddingTop: 13.5,
  },
});
