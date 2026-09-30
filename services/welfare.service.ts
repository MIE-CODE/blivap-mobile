import { IResponse } from "../types/api-response";
import { api } from "./fetcher";

export default () => {
  return {
    async fund(bookingId: string): Promise<IResponse<unknown>> {
      return await api(
        `/bookings/${encodeURIComponent(bookingId)}/welfare/fund`,
        { method: "POST" },
      );
    },
    async wallet(): Promise<IResponse<unknown>> {
      return await api("/welfare/wallet", { method: "GET" });
    },
  };
};
