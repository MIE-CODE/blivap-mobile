import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import { resetPasswordSchema } from "../../../../schemas/auth.schema";

export default function setNewPassword() {
  const { loading, resetPassword } = useAuth();
  const router = useRouter();
  const { token: tokenParam } = useLocalSearchParams<{ token?: string }>();
  const token = typeof tokenParam === "string" ? tokenParam : "";

  return (
    <ThemedView safe style={{ flex: 1, alignItems: "flex-start" }}>
      <Spacer height={30} />
      <BackBtn onPress={() => router.back()} />
      <Spacer height={19} />
      <ThemedText style={styles.header}>Set a new password</ThemedText>
      <Spacer height={16} />
      <ThemedText>
        Create a new password. Ensure it differs from previous ones for security
      </ThemedText>
      <Spacer height={27} />

      {!token ? (
        <ThemedText>
          This reset is missing a token. Request a new email and paste the token
          from the link.
        </ThemedText>
      ) : (
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={(values) => resetPassword(token, values.password)}
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
                label="Password"
                placeholder="Enter your new password"
                isPassword
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
              />
              <Spacer height={17} />
              <ThemedInput
                label="Confirm Password"
                placeholder="Re-enter password"
                isPassword
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword && errors.confirmPassword}
              />
              <Spacer height={28} />
              <Button
                size="large"
                onPress={() => handleSubmit()}
                disabled={!isValid}
                loading={loading}
                style={{ borderRadius: 10 }}
              >
                Update Password
              </Button>
            </ThemedView>
          )}
        </Formik>
      )}
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
