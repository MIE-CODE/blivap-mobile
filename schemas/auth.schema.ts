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

const strongPassword = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/,
    "Use uppercase, lowercase, a number, and a special character",
  )
  .required("Password is required");

export const resetPasswordSchema = Yup.object({
  password: strongPassword,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export const resetTokenSchema = Yup.object({
  token: Yup.string()
    .trim()
    .min(16, "Paste the full reset token from your email")
    .required("Reset token is required"),
});

export const changePasswordSchema = Yup.object({
  oldPassword: Yup.string().required("Current password is required"),
  password: strongPassword,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});
