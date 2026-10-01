import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { NinInputGuidelines } from "@/components/ui/donate/nin-input-guidelines";
import { ResidenceStatus } from "@/components/ui/donate/residence-status";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Redirect } from "expo-router";
import { Formik } from "formik";
import { ScrollView, StyleSheet } from "react-native";
import {
  VerifyIdentitySchema,
  VerifyIdentityValues,
} from "../../../../schemas/donate.schema";
import { useAppSelector } from "../../../../stores/hooks";

export default function VerifyIdentityScreen() {
  const theme = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const { verifyNin, loading } = useAuth();

  const initialValues: VerifyIdentityValues = {
    nin: "",
    email: user?.email ?? "",
    residence: "nigeria",
  };

  const handleSubmit = async (values: VerifyIdentityValues) => {
    if (values.residence === "abroad") return;
    await verifyNin({ nin: values.nin });
  };
  if (user?.nationalIdentificationNumberVerified)
    return <Redirect href="/donate-blood/medical-questions" />;
  return (
    <ThemedView safe style={styles.container}>
      <Header title="Verify Identity" />

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={VerifyIdentitySchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit: submitForm,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => {
          const isAbroad = values.residence === "abroad";

          return (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <ThemedText style={styles.heading}>Verify Identity</ThemedText>
                <ThemedText
                  style={[styles.intro, { color: theme.textSecondary }]}
                >
                  Please enter your personal details as they appear on your
                  National Identity Number (NIN) registration to proceed safely.
                </ThemedText>

                <Spacer height={20} />

                {isAbroad ? (
                  <>
                    <ThemedView
                      style={[
                        styles.warningBanner,
                        {
                          backgroundColor: theme.tint,
                          borderLeftColor: theme.primary,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[styles.warningTitle, { color: theme.primary }]}
                      >
                        Not available abroad
                      </ThemedText>
                      <ThemedText
                        style={[styles.warningBody, { color: theme.primary }]}
                      >
                        We don't verify users who live outside Nigeria for now.
                        Please select "I live in Nigeria" to continue.
                      </ThemedText>
                    </ThemedView>
                    <Spacer height={20} />
                  </>
                ) : null}

                <ThemedView
                  style={[
                    styles.card,
                    {
                      borderColor: theme.hairline,
                      backgroundColor: theme.card,
                      shadowColor: theme.text,
                      opacity: isAbroad ? 0.55 : 1,
                    },
                  ]}
                >
                  <ThemedText style={styles.sectionTitle}>
                    Enter your NIN Number
                  </ThemedText>
                  <Spacer height={12} />
                  <ThemedInput
                    label="NIN Number"
                    placeholder="98652120001"
                    keyboardType="number-pad"
                    maxLength={11}
                    value={values.nin}
                    onChangeText={(text) =>
                      setFieldValue("nin", text.replace(/\D/g, "").slice(0, 11))
                    }
                    onBlur={handleBlur("nin")}
                    error={touched.nin && errors.nin}
                    disabled={isAbroad}
                  />
                  <Spacer height={12} />
                  <NinInputGuidelines />
                </ThemedView>

                <Spacer height={20} />
                <ThemedInput
                  label="Email Address *"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email}
                  disabled
                />

                <Spacer height={20} />
                <ResidenceStatus
                  value={values.residence}
                  onChange={(value) => setFieldValue("residence", value)}
                />
              </ScrollView>

              <ThemedView style={styles.footer}>
                <Button
                  size="large"
                  loading={loading}
                  disabled={loading || isAbroad || !isValid || !dirty}
                  onPress={() => submitForm()}
                  textStyle={{ fontFamily: Fonts.inter.bold, fontSize: 16 }}
                >
                  Submit Application
                </Button>
                <Spacer height={4} />
              </ThemedView>
            </>
          );
        }}
      </Formik>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  heading: {
    fontFamily: Fonts.inter.bold,
    fontSize: 22,
    lineHeight: 28,
  },
  intro: {
    marginTop: 8,
    fontFamily: Fonts.inter.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 15,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  warningBanner: {
    borderLeftWidth: 3,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  warningTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: 13,
  },
  warningBody: {
    fontFamily: Fonts.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
});
