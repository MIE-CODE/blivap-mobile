import { IAuthResponse, IResponse } from "../types/api-response";
import {
  IChangePassword,
  IForgotPassword,
  ILogin,
  IOtp,
  IRegister,
  IResetPassword,
  IUpdateUser,
  IVerifyNin,
} from "../types/user";
import { api } from "./fetcher";

export default () => {
  return {
    async login(payload: ILogin): Promise<IResponse<IAuthResponse>> {
      return await api("/authentication/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async register(
      payload: Omit<IRegister, "termsAndCondition" | "privacyPolicy">,
    ): Promise<IResponse<IAuthResponse>> {
      return await api("/authentication/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async verifyOtp(payload: IOtp): Promise<IResponse<{ message: string }>> {
      return await api("/authentication/verify-email", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async me(): Promise<IResponse<IAuthResponse["user"]>> {
      return await api("/authentication/me", { method: "GET" });
    },
    async update(
      payload: IUpdateUser,
    ): Promise<IResponse<IAuthResponse["user"]>> {
      return await api("/authentication/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    async verifyNin(
      payload: IVerifyNin,
    ): Promise<IResponse<IAuthResponse["user"]>> {
      return await api("/nin-verification", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async forgotPassword(
      payload: IForgotPassword,
    ): Promise<IResponse<{ message?: string }>> {
      return await api("/authentication/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async resetPassword(
      payload: IResetPassword,
    ): Promise<IResponse<{ message?: string }>> {
      return await api("/authentication/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async changePassword(
      payload: IChangePassword,
    ): Promise<IResponse<{ message?: string }>> {
      return await api("/authentication/change-password", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    async resendEmailVerification(email: string): Promise<IResponse<{ message?: string }>> {
      const query = new URLSearchParams({ email });
      return await api(
        `/authentication/resend-email-verification-link?${query.toString()}`,
        { method: "POST" },
      );
    },
    async logout(): Promise<IResponse<unknown>> {
      return await api("/authentication/logout", { method: "POST" });
    },
  };
};
