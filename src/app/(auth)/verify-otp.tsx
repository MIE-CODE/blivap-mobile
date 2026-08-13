import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import CodeInput from "@/components/code-input";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/router";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function VerifyOtp() {
  const theme = useTheme();
  const [code, setCode] = useState<string>("");
  const isCodeValid = code.length === 4;
  const router = useRouter();
  return (
    <ThemedView safe>
      <Spacer height={32} />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <BackBtn onPress={() => router.back()} />
      </ThemedView>
      <Spacer height={53} />
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <ThemedText type="title">Verify Code</ThemedText>
        <ThemedText type="subtitle">
          Please enter the code we just send to email
        </ThemedText>
        <ThemedText type="subtitle" style={{ color: theme.link }}>
          james.john@gmail.com
        </ThemedText>
        <Spacer height={32} />
        <CodeInput value={code} onCodeChange={setCode} inputCount={4} />
        <Spacer height={24} />
        <ThemedText type="subtitle" style={{ color: theme.textSecondary }}>
          Didn’t receive the OTP?{" "}
        </ThemedText>
        <ThemedText
          style={{
            color: theme.text,
            textDecorationLine: "underline",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Resend code
        </ThemedText>
        <Spacer height={24} />
      </ThemedView>

      <Button
        size="large"
        onPress={() => navigate("/login")}
        disabled={!isCodeValid}
        variant={isCodeValid ? "primary" : "disabled"}
      >
        Verify
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 25, padding: 12 },
});
