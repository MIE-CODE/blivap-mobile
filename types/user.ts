export interface IRegister {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  termsAndCondition: boolean;
  privacyPolicy: boolean;
}
export interface ILogin {
  email: string;
  password: string;
}

export interface User {
  createdAt: string;
  dateOfBirth: string;
  email: string;
  emailVerified: boolean;
  firstname: string;
  hasAcceptedTermsAndConditions: boolean;
  id: string;
  isDeleted: boolean;
  lastActive: string;
  lastname: string;
  nationalIdentificationNumberVerified: boolean;
  phonenumber: string;
  profileImage: string;
  roles: string[];
  updatedAt: string;
}
