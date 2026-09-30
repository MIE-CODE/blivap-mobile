import { IResponse } from "../types/api-response";
import { api } from "./fetcher";

export type CreateBookingPayload = {
  donorUserId: string;
  hospitalId: string;
  scheduledAt: string;
};

export default () => {
  return {
    async request(payload: CreateBookingPayload): Promise<IResponse<unknown>> {
      return await api("/bookings/request", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async sent(): Promise<IResponse<unknown>> {
      return await api("/bookings/sent?limit=50", { method: "GET" });
    },
    async received(): Promise<IResponse<unknown>> {
      return await api("/bookings/received?limit=50", { method: "GET" });
    },
    async accept(id: string): Promise<IResponse<unknown>> {
      return await api(`/bookings/${encodeURIComponent(id)}/accept`, {
        method: "PATCH",
      });
    },
    async decline(id: string): Promise<IResponse<unknown>> {
      return await api(`/bookings/${encodeURIComponent(id)}/decline`, {
        method: "PATCH",
      });
    },
  };
};
