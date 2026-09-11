import { BackBtn } from "@/components/back-btn";
import { DonorCard } from "@/components/donor-card";
import { Dropdown } from "@/components/dropdown";
import { Spacer } from "@/components/spacer";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useDonors } from "@/hooks/use-donors";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import { useAppSelector } from "../../../../../stores/hooks";

export default function Donors() {
  const router = useRouter();
  const { donors } = useAppSelector((s) => s.donors);
  const { loading, get } = useDonors();

  const bloodTypeOptions = [
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
    { label: "A+", value: "A+" },
    // ...
  ];
  useEffect(() => {
    get();
  }, []);
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
          options={bloodTypeOptions}
          value="0+"
          onChange={() => {}}
        />
        <Dropdown
          placeholder="Location"
          options={bloodTypeOptions}
          value="0+"
          onChange={() => {}}
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
          <ThemedView style={{ alignItems: "center", marginTop: 50 }}>
            <ThemedIcon name="cloud-offline-outline" size={60} />
          </ThemedView>
        ) : (
          donors?.map((donor) => <DonorCard key={donor.id} data={donor} />)
        )}
      </ScrollView>
    </ThemedView>
  );
}
