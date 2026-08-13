import { User } from "./user";

export interface LoginResponse {
  data: {
    accessToken: string;
    accessTokenExpires: string;
    user: User;
    message: string;
  };
  message: string;
}
