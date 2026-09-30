import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import { resetTokenSchema } from "../../../../schemas/auth.schema";

export default function passwordResetCode() {
  const { loading, forgotPassword } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = typeof emailParam === "string" ? emailParam : "";

  return (
    <ThemedView safe style={{ flex: 1, alignItems: "flex-start" }}>
      <Spacer height={30} />
      <BackBtn onPress={() => router.back()} />
      <Spacer height={19} />
      <ThemedText style={styles.header}>Check your email</ThemedText>
      <Spacer height={16} />
      <ThemedText>
        We sent a reset link{email ? ` to ${email}` : ""}. Open it and paste the
        token from the link (the value after token=).
      </ThemedText>
      <Spacer height={27} />

      <Formik
        initialValues={{ token: "" }}
        validationSchema={resetTokenSchema}
        onSubmit={(values) =>
          router.push({
            pathname: "/set-new-password",
            params: { token: values.token.trim() },
          })
        }
        validateOnMount
      >
        {({
          handleSubmit,
          values,
          handleBlur,
          handleChange,
          isValid,
          touched,
          errors,
        }) => (
          <ThemedView style={{ width: "100%" }}>
            <ThemedInput
              label="Reset token"
              placeholder="Paste the token from your email"
              value={values.token}
              onChangeText={handleChange("token")}
              onBlur={handleBlur("token")}
              autoCapitalize="none"
              autoCorrect={false}
              error={touched.token && errors.token}
            />
            <Spacer height={23} />
            <Button
              size="large"
              onPress={() => handleSubmit()}
              disabled={!isValid}
              loading={loading}
            >
              Continue
            </Button>
            <Spacer height={20} />
            <ThemedText
              type="subtitle"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              Haven’t got the email yet?{" "}
              <ThemedText
                onPress={() => {
                  if (email) void forgotPassword(email);
                }}
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
