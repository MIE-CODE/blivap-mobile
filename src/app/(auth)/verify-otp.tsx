import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import CodeInput from "@/components/code-input";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { openRoute } from "@/utils/open-route";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import { otpSchema } from "../../../schemas/auth.schema";
import { useAppSelector } from "../../../stores/hooks";

export default function VerifyOtp() {
  const theme = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const { verifyOtp, resendVerification, loading } = useAuth();
  return (
    <ThemedView safe style={{ flex: 1 }}>
      <Spacer height={32} />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <BackBtn onPress={() => openRoute("/login")} />
      </ThemedView>
      <Spacer height={53} />
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <ThemedText type="title">Verify Code</ThemedText>
        <ThemedText type="subtitle">
          Please enter the code we just send to email
        </ThemedText>
        <ThemedText type="subtitle" style={{ color: theme.link }}>
          {user?.email}
        </ThemedText>
        <Spacer height={32} />
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpSchema}
          onSubmit={(val) =>
            verifyOtp({
              email: user?.email ?? "",
              emailValidationToken: val.otp,
            })
          }
          validateOnMount
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isValid,
            setFieldTouched,
          }) => (
            <>
              <CodeInput
                value={values.otp}
                onCodeChange={handleChange("otp")}
                onBlur={() => setFieldTouched("otp", true)}
                error={touched.otp && errors.otp}
                inputCount={6}
                type="text"
                inputStyle={{ fontSize: 16, paddingHorizontal: 18 }}
              />
              <Spacer height={24} />
              <ThemedText
                type="subtitle"
                style={{ color: theme.textSecondary }}
              >
                Didn’t receive the OTP?{" "}
              </ThemedText>
              <ThemedText
                onPress={() => {
                  if (user?.email) void resendVerification(user.email);
                }}
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
              <Button
                style={{ width: "100%" }}
                size="large"
                onPress={() => handleSubmit()}
                disabled={!isValid || loading}
                loading={loading}
              >
                Verify
              </Button>
            </>
          )}
        </Formik>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 25, padding: 12 },
});
