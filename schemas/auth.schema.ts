import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  firstname: Yup.string().required("Full name is required"),
  lastname: Yup.string().required("Full name is required"),
  phonenumber: Yup.string()
    .min(11, "Invalid Phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .test("is-iso-date", "Invalid date", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    })
    .test("not-future", "Date of birth cannot be in the future", (value) => {
      if (!value) return false;
      return new Date(value).getTime() <= Date.now();
    }),
  termsAndCondition: Yup.bool().required(),
  privacyPolicy: Yup.bool().required(),
});

export const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .required("Code is required")
    .length(6, "Code must be 6 characters"),
});
export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
