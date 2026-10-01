import { IResponse } from "../types/api-response";
import { api } from "./fetcher";

export default () => {
  return {
    async messages(donationId: string): Promise<IResponse<unknown>> {
      return await api(
        `/chat/${encodeURIComponent(donationId)}/messages?limit=50`,
        { method: "GET" },
      );
    },
    async arrived(donationId: string): Promise<IResponse<unknown>> {
      return await api(`/chat/${encodeURIComponent(donationId)}/arrived`, {
        method: "POST",
      });
    },
  };
};
