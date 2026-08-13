import { BackBtn } from "@/components/back-btn";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";

export default function Donors() {
  const router = useRouter();
  return (
    <ThemedView safe>
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <BackBtn onPress={() => router.back()} />
        <ThemedText>Available Donors</ThemedText>
        <Spacer width={40} />
      </ThemedView>
    </ThemedView>
  );
}
