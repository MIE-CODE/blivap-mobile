import * as Yup from "yup";

export const PersonalInformationSchema = Yup.object({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  phonenumber: Yup.string()
    .min(11, "Invalid Phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export type PersonalInformationValues = Yup.InferType<
  typeof PersonalInformationSchema
>;
