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
import { ThemedDatePicker } from "@/components/themed-date-picker";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import { RegisterSchema } from "../../../schemas/auth.schema";
export default function Register() {
  const { register, loading, signInWithSocial } = useAuth();
  const theme = useTheme();
  return (
    <ThemedView safe style={{ paddingBottom: 20 }}>
      <Spacer height={21} />
      <ThemedView style={{ alignItems: "center", justifyContent: "center" }}>
        <ThemedText type="title">Create Account</ThemedText>
        <Spacer height={8} />
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Fill your information bellow or register with your social account
        </ThemedText>
      </ThemedView>
      <Spacer height={24} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            firstname: "",
            lastname: "",
            phonenumber: "",
            email: "",
            password: "",
            dateOfBirth: "",
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
            setFieldTouched,
          }) => {
            const hasAcceptedTerms =
              values.privacyPolicy && values.termsAndCondition;

            return (
              <>
                <ThemedView style={styles.form}>
                  <ThemedInput
                    label="Firstname"
                    placeholder="John"
                    keyboardType="default"
                    value={values.firstname}
                    onChangeText={handleChange("firstname")}
                    onBlur={handleBlur("fullName")}
                    error={touched.firstname && errors.firstname}
                  />
                  <ThemedInput
                    label="Lastname"
                    placeholder="Doe"
                    keyboardType="default"
                    value={values.lastname}
                    onChangeText={handleChange("lastname")}
                    onBlur={handleBlur("fullName")}
                    error={touched.lastname && errors.lastname}
                  />
                  <ThemedInput
                    label="Phone number"
                    placeholder="08012345678"
                    keyboardType="phone-pad"
                    value={values.phonenumber}
                    onChangeText={handleChange("phonenumber")}
                    onBlur={handleBlur("phoneNumber")}
                    error={touched.phonenumber && errors.phonenumber}
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
                  <ThemedDatePicker
                    label="Date of birth"
                    placeholder="Select date of birth"
                    value={values.dateOfBirth}
                    onChange={(iso) => setFieldValue("dateOfBirth", iso)}
                    onBlur={() => setFieldTouched("dateOfBirth", true)}
                    error={touched.dateOfBirth && errors.dateOfBirth}
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
                      style={{
                        fontSize: 12,
                        lineHeight: 22,
                        fontWeight: "500",
                      }}
                    >
                      Agree with{" "}
                      <Link
                        href="/register"
                        style={{
                          color: theme.link,
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
                      style={{
                        fontSize: 12,
                        lineHeight: 22,
                        fontWeight: "500",
                      }}
                    >
                      Agree with{" "}
                      <Link
                        href="/register"
                        style={{
                          color: theme.link,
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
                  disabled={loading || !hasAcceptedTerms || !isValid}
                  loading={loading}
                >
                  Sign Up
                </Button>
              </>
            );
          }}
        </Formik>

        <Spacer height={24} />
        <ThemedView style={styles.or}>
          <ThemedSeparator thickness={0.5} color={theme.hairline} width="25%" />
          <ThemedText
            style={{
              color: theme.textSecondary,
              fontSize: 12,
              lineHeight: 22,
              fontWeight: "500",
            }}
          >
            Or continue with
          </ThemedText>
          <ThemedSeparator thickness={0.5} color={theme.hairline} width="25%" />
        </ThemedView>
        <Spacer height={16} />
        <ThemedView style={styles.socialButtonsContainer}>
          <Pressable
            accessibilityLabel="Continue with Facebook"
            disabled={loading}
            onPress={() => {
              void signInWithSocial("facebook");
            }}
            style={[
              styles.socialButton,
              { paddingHorizontal: 16, paddingVertical: 13.9 },
            ]}
          >
            <FacebookIcon />
          </Pressable>
          <Pressable
            accessibilityLabel="Continue with Google"
            disabled={loading}
            onPress={() => {
              void signInWithSocial("google");
            }}
            style={[
              styles.socialButton,
              { paddingHorizontal: 17, paddingVertical: 8 },
            ]}
          >
            <GoogleIcon />
          </Pressable>
          <Pressable
            accessibilityLabel="Continue with Apple"
            disabled={loading}
            onPress={() => {
              void signInWithSocial("apple");
            }}
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
          <Link href="/login" style={{ color: theme.link }}>
            Sign in
          </Link>
        </ThemedText>
      </ScrollView>
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
