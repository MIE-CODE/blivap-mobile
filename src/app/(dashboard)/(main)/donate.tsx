import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DonatePage() {
  return (
    <ThemedView>
      <SafeAreaView>
        <ThemedView>
          <ThemedText type="title">Donate</ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}
