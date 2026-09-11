export interface IRegister {
  email: string;
  password: string;
  termsAndCondition: boolean;
  privacyPolicy: boolean;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  /** E.164-style value, e.g. `+2348012345678`. */
  phonenumber: string;
}

export interface ILogin {
  email: string;
  password: string;
}
export interface IOtp {
  emailValidationToken: string;
  email: string;
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

export interface IUpdateUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
}
