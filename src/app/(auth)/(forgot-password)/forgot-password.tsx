import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import { forgotPasswordSchema } from "../../../../schemas/auth.schema";

export default function forgotPassword() {
  const { loading } = useAuth();
  const router = useRouter();
  return (
    <ThemedView safe style={{ flex: 1, alignItems: "flex-start" }}>
      <Spacer height={30} />
      <BackBtn onPress={() => router.back()} />
      <Spacer height={19} />
      <ThemedText style={styles.header}>Forgot password</ThemedText>
      <Spacer height={16} />
      <ThemedText>Please enter your email to reset the password</ThemedText>
      <Spacer height={27} />

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={() => router.push("/password-reset-code")}
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
              label="Your Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && errors.email}
            />
            <Spacer height={23} />
            <Button
              size="large"
              onPress={() => handleSubmit()}
              disabled={!isValid}
              loading={loading}
            >
              Reset Password
            </Button>
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
