import { User } from "./user";

export interface IResponse<T> {
  data: T;
  message: string;
  status: number;
  error?: string | null | undefined;
  errors?: Record<string, string[]> | undefined;
}

export interface IAuthResponse {
  accessToken: string;
  accessTokenExpires: string;
  user: User;
  message: string;
}

export interface SignupResponse {
  accessToken: string;
  accessTokenExpires: string; // ISO date string
  user: User;
}
