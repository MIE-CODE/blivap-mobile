import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { Line } from "@/components/themed-line";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Donor } from "../../../../types/donor";

type RequestBloodDonationModalProps = {
  visible: boolean;
  donor?: Donor;
  onClose: () => void;
};

type UrgencyLevel = "critical" | "high" | "moderate" | "low";

const URGENCY_OPTIONS: {
  value: UrgencyLevel;
  label: string;
  dotColor?: string;
}[] = [
  { value: "critical", label: "Critical (Within 12 hours)", dotColor: "#EB5757" },
  { value: "high", label: "High (Within 6 hours)" },
  { value: "moderate", label: "High (Within 6 hours)", dotColor: "#F2C94C" },
  { value: "low", label: "Low (Within 3 hours)", dotColor: "#3EB655" },
];

const UNIT_OPTIONS = [
  { label: "1 unit", value: "1" },
  { label: "2 units", value: "2" },
  { label: "3 units", value: "3" },
  { label: "4 units", value: "4" },
  { label: "5 units", value: "5" },
];

export const RequestBloodDonationModal = ({
  visible,
  donor,
  onClose,
}: RequestBloodDonationModalProps) => {
  const theme = useTheme();
  const [urgency, setUrgency] = useState<UrgencyLevel>("high");
  const [units, setUnits] = useState<string | null>(null);
  const [hospital, setHospital] = useState("");

  const handleSubmit = () => {
    if (!units) {
      Toast.show({ type: "error", text1: "Please select units needed" });
      return;
    }

    if (!hospital.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter hospital name or address",
      });
      return;
    }

    Toast.show({ type: "success", text1: "Blood donation request submitted" });
    onClose();
  };

  const handleClose = () => {
    setUrgency("high");
    setUnits(null);
    setHospital("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.background }]}
          onPress={(event) => event.stopPropagation()}
        >
          <ThemedText style={styles.title}>Request Blood Donation</ThemedText>
          <ThemedText
            type="xSmall"
            style={{ color: theme.textSecondary, marginTop: 4 }}
          >
            Fill in the details to request blood duration
          </ThemedText>

          <Line
            strokeWidth={1}
            strokeColor={Colors.gray[5]}
            style={{ marginVertical: 16 }}
          />

          <ThemedText style={styles.sectionLabel}>Urgency Level</ThemedText>
          <ThemedView style={styles.urgencyList}>
            {URGENCY_OPTIONS.map((option) => {
              const isSelected = urgency === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setUrgency(option.value)}
                  style={[
                    styles.urgencyOption,
                    {
                      borderColor: isSelected ? theme.primary : Colors.gray[5],
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.urgencyLabel,
                      isSelected && { color: theme.primary },
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  {!isSelected && option.dotColor && (
                    <View
                      style={[
                        styles.urgencyDot,
                        { backgroundColor: option.dotColor },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText style={styles.sectionLabel}>Units Needed</ThemedText>
            <Dropdown
              placeholder="Select units needed"
              options={UNIT_OPTIONS}
              value={units}
              onChange={setUnits}
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedInput
              label="Hospital/Medical Center"
              placeholder="Enter Hospital Name/Address"
              value={hospital}
              onChangeText={setHospital}
            />
          </ThemedView>

          <ThemedView style={styles.actions}>
            <Button
              variant="soft"
              onPress={handleClose}
              style={[styles.actionButton, { backgroundColor: Colors.gray[5] }]}
              textStyle={{ color: theme.text, fontSize: 14 }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              style={styles.actionButton}
              textStyle={{ fontSize: 14 }}
            >
              Submit
            </Button>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: 18,
    textAlign: "center",
  },
  sectionLabel: {
    fontFamily: Fonts.inter.semiBold,
    fontSize: 14,
    marginBottom: 10,
  },
  urgencyList: {
    gap: 10,
    marginBottom: 16,
  },
  urgencyOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  urgencyLabel: {
    fontFamily: Fonts.inter.medium,
    fontSize: 13,
    flex: 1,
  },
  urgencyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  field: {
    marginBottom: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
  },
});
