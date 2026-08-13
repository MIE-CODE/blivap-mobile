import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string()
    .min(11, "Invalid Phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  termsAndCondition: Yup.bool().required(),
  privacyPolicy: Yup.bool().required(),
});

export const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
