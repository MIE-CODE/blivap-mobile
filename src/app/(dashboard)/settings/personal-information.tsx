import { ThemedDatePicker } from "@/components/themed-date-picker";
import { ThemedInput } from "@/components/themed-input";
import { SettingsScreenLayout } from "@/components/ui/settings/settings-screen-layout";
import { usePersonalInformation } from "@/hooks/use-personal-information";
import { Formik } from "formik";
import { PersonalInformationSchema } from "../../../../schemas/settings.schema";

export default function PersonalInformation() {
  const { initialValues, dateOfBirth, loading, savePersonalInformation } =
    usePersonalInformation();

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={PersonalInformationSchema}
      onSubmit={savePersonalInformation}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        errors,
        values,
        isValid,
        dirty,
      }) => (
        <SettingsScreenLayout
          title="Personal Information"
          footerLabel="Save Changes"
          onFooterPress={() => handleSubmit()}
          footerDisabled={loading || !isValid || !dirty}
          footerLoading={loading}
        >
          <ThemedInput
            label="First Name"
            placeholder="John"
            keyboardType="default"
            value={values.firstname}
            onChangeText={handleChange("firstname")}
            onBlur={handleBlur("firstname")}
            error={touched.firstname && errors.firstname}
          />
          <ThemedInput
            label="Last Name"
            placeholder="Doe"
            keyboardType="default"
            value={values.lastname}
            onChangeText={handleChange("lastname")}
            onBlur={handleBlur("lastname")}
            error={touched.lastname && errors.lastname}
          />
          <ThemedInput
            label="Email Address"
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            error={touched.email && errors.email}
          />
          <ThemedInput
            label="Phone Number"
            placeholder="08012345678"
            keyboardType="phone-pad"
            value={values.phonenumber}
            onChangeText={handleChange("phonenumber")}
            onBlur={handleBlur("phonenumber")}
            error={touched.phonenumber && errors.phonenumber}
          />
          <ThemedDatePicker
            label="Date of Birth"
            placeholder="Not set"
            value={dateOfBirth || null}
            disabled
          />
        </SettingsScreenLayout>
      )}
    </Formik>
  );
}
