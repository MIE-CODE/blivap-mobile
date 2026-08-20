import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useRouter } from "expo-router";
import { useAppSelector } from "../../stores/hooks";

export default function settings() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { logOut } = useAuth();
  if (!isAuthenticated) return <Redirect href="/login" />;
  return (
    <ThemedView safe style={{ gap: 50 }}>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BackBtn onPress={() => useRouter().replace("/home")} />
        <ThemedText type="title" style={{ textAlign: "center" }}>
          Settings
        </ThemedText>
        <Spacer />
      </ThemedView>
      <Button onPress={logOut}>Logout</Button>
    </ThemedView>
  );
}
