import { Button } from "@/components/button";
import { Spacer } from "@/components/spacer";
import { ThemedInput } from "@/components/themed-input";
import { ThemedSeparator } from "@/components/themed-separator";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
// social buttons icons
import AppleIcon from "@/assets/icons/apple.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import { ThemedCheckbox } from "@/components/themed-checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Formik } from "formik";
import { RegisterSchema } from "../../../schemas/auth.schema";
export default function Register() {
  const { register } = useAuth();
  const theme = useTheme();
  return (
    <ThemedView safe>
      <Spacer height={21} />
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <ThemedText type="title">Create Account</ThemedText>
        <Spacer height={8} />
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Fill your information bellow or register with your social account
        </ThemedText>
      </ThemedView>
      <Spacer height={24} />
      <Formik
        initialValues={{
          fullName: "",
          phoneNumber: "",
          email: "",
          password: "",
          termsAndCondition: false,
          privacyPolicy: false,
        }}
        validationSchema={RegisterSchema}
        onSubmit={register}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          touched,
          errors,
          values,
          isValid,
          setFieldValue,
        }) => {
          const hasAcceptedTerms =
            values.privacyPolicy && values.termsAndCondition;

          return (
            <>
              <ThemedView style={styles.form}>
                <ThemedInput
                  label="Full name"
                  placeholder="John Doe"
                  keyboardType="default"
                  value={values.fullName}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  error={touched.fullName && errors.fullName}
                />
                <ThemedInput
                  label="Phone number"
                  placeholder="08012345678"
                  keyboardType="phone-pad"
                  value={values.phoneNumber}
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  error={touched.phoneNumber && errors.phoneNumber}
                />
                <ThemedInput
                  label="Email"
                  placeholder="john.doe@example.com"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email}
                />
                <ThemedInput
                  label="Password"
                  placeholder="********"
                  keyboardType="default"
                  isPassword
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={touched.password && errors.password}
                />
              </ThemedView>
              <Spacer height={10} />
              <ThemedView style={{ gap: 10 }}>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <ThemedCheckbox
                    value={values.termsAndCondition}
                    handleCheck={() =>
                      setFieldValue(
                        "termsAndCondition",
                        !values.termsAndCondition,
                      )
                    }
                  />
                  <ThemedText
                    style={{ fontSize: 12, lineHeight: 22, fontWeight: "500" }}
                  >
                    Agree with{" "}
                    <Link
                      href="/register"
                      style={{
                        color: "#0005F2",
                        textDecorationLine: "underline",
                      }}
                    >
                      Terms & Condition{" "}
                    </Link>
                  </ThemedText>
                </ThemedView>
                <ThemedView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <ThemedCheckbox
                    value={values.privacyPolicy}
                    handleCheck={() =>
                      setFieldValue("privacyPolicy", !values.privacyPolicy)
                    }
                  />
                  <ThemedText
                    style={{ fontSize: 12, lineHeight: 22, fontWeight: "500" }}
                  >
                    Agree with{" "}
                    <Link
                      href="/register"
                      style={{
                        color: "#0005F2",
                        textDecorationLine: "underline",
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <Spacer height={24} />
              <Button
                size="large"
                onPress={() => handleSubmit()}
                disabled={!hasAcceptedTerms || !isValid}
              >
                Sign Up
              </Button>
            </>
          );
        }}
      </Formik>

      <Spacer height={24} />
      <ThemedView style={styles.or}>
        <ThemedSeparator thickness={0.5} color="#00000080" width="25%" />
        <ThemedText
          style={{
            color: "#333333",
            fontSize: 12,
            lineHeight: 22,
            fontWeight: "500",
          }}
        >
          Or continue with
        </ThemedText>
        <ThemedSeparator thickness={0.5} color="#00000080" width="25%" />
      </ThemedView>
      <Spacer height={16} />
      <ThemedView style={styles.socialButtonsContainer}>
        <Pressable
          style={[
            styles.socialButton,
            { paddingHorizontal: 16, paddingVertical: 13.9 },
          ]}
        >
          <FacebookIcon />
        </Pressable>
        <Pressable
          style={[
            styles.socialButton,
            { paddingHorizontal: 17, paddingVertical: 8 },
          ]}
        >
          <GoogleIcon />
        </Pressable>
        <Pressable
          style={[
            styles.socialButton,
            { paddingHorizontal: 18.5, paddingVertical: 14 },
          ]}
        >
          <AppleIcon color={theme.text} />
        </Pressable>
      </ThemedView>
      <Spacer height={24} />
      <ThemedText
        style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}
      >
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#0005F2" }}>
          Sign in
        </Link>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 22,
    textAlign: "center",
    color: "#000000",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#282828",
    textAlign: "center",
  },
  form: {
    gap: 24,
  },
  or: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginHorizontal: 46,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  socialButton: {
    borderWidth: 0.5,
    borderColor: "#6B728080",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
