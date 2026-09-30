import { BackBtn } from "@/components/back-btn";
import { DonorCard } from "@/components/donor-card";
import { Dropdown } from "@/components/dropdown";
import { Spacer } from "@/components/spacer";
import { DonorsEmptyState } from "@/components/ui/donors/donors-empty-state";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useDonors } from "@/hooks/use-donors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

const BLOOD_TYPE_OPTIONS = [
  { label: "All types", value: "" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
];

const LOCATION_OPTIONS = [
  { label: "All locations", value: "" },
  { label: "Lagos", value: "Lagos" },
  { label: "Abuja", value: "Abuja" },
  { label: "Port Harcourt", value: "Port Harcourt" },
  { label: "Ibadan", value: "Ibadan" },
  { label: "Kano", value: "Kano" },
  { label: "Enugu", value: "Enugu" },
];

export default function Donors() {
  const router = useRouter();
  const [bloodType, setBloodType] = useState<string | null>("");
  const [location, setLocation] = useState<string | null>("");
  const { loading, donors } = useDonors({
    bloodType: bloodType || undefined,
    search: location || undefined,
    syncStore: false,
  });
  return (
    <ThemedView safe style={{ flex: 1, paddingHorizontal: 0 }}>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <BackBtn onPress={() => router.back()} />
        <ThemedText>Available Donors</ThemedText>
        <Spacer width={40} />
      </ThemedView>
      <Spacer height={18} />
      <ThemedView
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          gap: 16,
          width: "100%",
        }}
      >
        <Dropdown
          placeholder="Blood Type"
          options={BLOOD_TYPE_OPTIONS}
          value={bloodType}
          onChange={setBloodType}
          style={{ flex: 1 }}
        />
        <Dropdown
          placeholder="Location"
          options={LOCATION_OPTIONS}
          value={location}
          onChange={setLocation}
          style={{ flex: 1 }}
        />
      </ThemedView>
      <Spacer height={5} />
      <ScrollView
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          [...Array(4)].map((_, index) => <DonorCard key={index} skeleton />)
        ) : !donors?.length ? (
          <DonorsEmptyState
            title={bloodType || location ? "No donors found" : "No donors yet"}
            message={
              bloodType || location
                ? "Try another blood type or location."
                : "People who finish donor registration will show up here."
            }
          />
        ) : (
          donors?.map((donor) => <DonorCard key={donor.id} data={donor} />)
        )}
      </ScrollView>
    </ThemedView>
  );
}
