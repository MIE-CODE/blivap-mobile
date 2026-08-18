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
import { useAuth } from "@/hooks/use-auth";
import { Formik } from "formik";
import { LoginSchema } from "../../../schemas/auth.schema";
export default function Login() {
  const { login, loading } = useAuth();
  return (
    <ThemedView safe style={styles.container}>
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <ThemedText type="title">Sign In</ThemedText>
        <Spacer height={24} />
        <ThemedText type="subtitle">
          Hi! Welcome back, you’ve been missed
        </ThemedText>
      </ThemedView>
      <Spacer height={24} />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={login}
        validateOnMount
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          errors,
          values,
          isValid,
        }) => (
          <>
            <ThemedView style={styles.form}>
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
            <ThemedText style={{ textAlign: "right" }}>
              <Link
                href="/forgot-password"
                style={{
                  color: "#0005F2",
                  textDecorationLine: "underline",
                  fontSize: 12,
                }}
              >
                Forgot password?
              </Link>
            </ThemedText>
            <Spacer height={24} />
            <Button
              size="large"
              onPress={() => handleSubmit()}
              disabled={loading || !isValid}
              loading={loading}
            >
              Sign In
            </Button>
          </>
        )}
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
          <AppleIcon />
        </Pressable>
      </ThemedView>
      <Spacer height={24} />
      <ThemedText
        style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}
      >
        Already have an account?{" "}
        <Link href="/register" style={{ color: "#0005F2" }}>
          Sign Up
        </Link>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
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
