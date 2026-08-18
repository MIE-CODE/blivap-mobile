import { IAuthResponse, IResponse } from "../types/api-response";
import { ILogin, IOtp, IRegister } from "../types/user";
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
  };
};
