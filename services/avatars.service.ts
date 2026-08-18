import { IResponse } from "../types/api-response";
import { IAvatar } from "../types/avatar";
import { api } from "./fetcher";

export default () => {
  return {
    async get(): Promise<IResponse<IAvatar[]>> {
      return await api("/avatar", { method: "GET" });
    },
    async set(
      profileImage: string,
    ): Promise<IResponse<{ profileImage: string }>> {
      return await api("/avatar", {
        method: "POST",
        body: JSON.stringify({ profileImage }),
      });
    },
  };
};
