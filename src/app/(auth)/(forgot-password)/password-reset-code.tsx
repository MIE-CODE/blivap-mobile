import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import CodeInput from "@/components/code-input";
import { Spacer } from "@/components/spacer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import { otpSchema } from "../../../../schemas/auth.schema";

export default function passwordResetCode() {
  const { loading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const email = "fake@gmail.com";
  return (
    <ThemedView safe style={{ flex: 1, alignItems: "flex-start" }}>
      <Spacer height={30} />
      <BackBtn onPress={() => router.back()} />
      <Spacer height={19} />
      <ThemedText style={styles.header}>Check your email</ThemedText>
      <Spacer height={16} />
      <ThemedText>
        We sent a reset link to {email.split("@")[0].slice(0, 5).concat("...")}
        @gmail.com{"\n"}enter 5 digit code that mentioned in the email
      </ThemedText>
      <Spacer height={27} />

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        onSubmit={() => router.push("/set-new-password")}
        validateOnMount
      >
        {({
          handleSubmit,
          values,
          handleBlur,
          setFieldTouched,
          handleChange,
          isValid,
          touched,
          errors,
        }) => (
          <ThemedView style={{ width: "100%" }}>
            <CodeInput
              value={values.otp}
              onCodeChange={handleChange("otp")}
              onBlur={() => setFieldTouched("otp", true)}
              error={touched.otp && errors.otp}
              inputCount={6}
              type="text"
            />
            <Spacer height={23} />
            <Button
              size="large"
              onPress={() => handleSubmit()}
              disabled={!isValid}
              loading={loading}
            >
              Verify Code
            </Button>
            <Spacer height={20} />
            <ThemedText
              type="subtitle"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              Haven’t got the email yet?{" "}
              <ThemedText
                style={{
                  color: theme.link,
                  textDecorationLine: "underline",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                Resend email
              </ThemedText>
            </ThemedText>
          </ThemedView>
        )}
      </Formik>
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
