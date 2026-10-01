import SuccessSticker from "@/assets/icons/Sticker.svg";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { openRoute } from "@/utils/open-route";
import { StyleSheet } from "react-native";
export default function success() {
  return (
    <ThemedView safe style={{ flex: 1, justifyContent: "center" }}>
      <ThemedView style={{ alignItems: "center" }}>
        <SuccessSticker />
        <Spacer height={33} />
        <ThemedText style={styles.header}>Succesful</ThemedText>
        <Spacer height={22} />
        <ThemedText style={{ textAlign: "center" }}>
          Congratulations! Your password has been changed. Click continue to
          login
        </ThemedText>
      </ThemedView>

      <Spacer height={36} />
      <Button
        size="large"
        onPress={() => openRoute("/login")}
        style={{ borderRadius: 10 }}
      >
        continue
      </Button>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 19.1,
  },
});
