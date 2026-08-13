import { LoginResponse } from "../types/api-response";
import { ILogin } from "../types/user";
import { api } from "./fetcher";

export default () => {
  return {
    async login(params: ILogin): Promise<LoginResponse> {
      return await api("/authentication/login", {
        method: "POST",
        body: JSON.stringify(params),
      });
    },
    register() {},
    verifyOtp() {},
  };
};
