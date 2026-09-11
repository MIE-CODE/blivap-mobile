import * as Yup from "yup";

export const VerifyIdentitySchema = Yup.object({
  nin: Yup.string()
    .required("NIN number is required")
    .matches(/^\d{11}$/, "NIN must be exactly 11 digits with no spaces or hyphens"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  residence: Yup.mixed<"nigeria" | "abroad">()
    .oneOf(["nigeria", "abroad"])
    .required("Residence status is required"),
});

export type VerifyIdentityValues = Yup.InferType<typeof VerifyIdentitySchema>;
