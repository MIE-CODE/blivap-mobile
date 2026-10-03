import { IResponse } from "../types/api-response";
import { api } from "./fetcher";

export default () => {
  return {
    async ensureSession(bookingId: string): Promise<IResponse<unknown>> {
      return await api(
        `/meetups/bookings/${encodeURIComponent(bookingId)}/session`,
        { method: "POST" },
      );
    },
    async getSession(sessionId: string): Promise<IResponse<unknown>> {
      return await api(`/meetups/${encodeURIComponent(sessionId)}`, {
        method: "GET",
      });
    },
    async verifyCode(
      sessionId: string,
      code: string,
    ): Promise<IResponse<unknown>> {
      return await api(
        `/meetups/${encodeURIComponent(sessionId)}/verify-code`,
        {
          method: "POST",
          body: JSON.stringify({ code }),
        },
      );
    },
    async requesterConfirm(sessionId: string): Promise<IResponse<unknown>> {
      return await api(
        `/meetups/${encodeURIComponent(sessionId)}/requester-confirm`,
        { method: "PATCH" },
      );
    },
    async donorConfirm(sessionId: string): Promise<IResponse<unknown>> {
      return await api(
        `/meetups/${encodeURIComponent(sessionId)}/donor-confirm`,
        { method: "PATCH" },
      );
    },
    /** Either party — ends an active meetup and cancels the booking. */
    async terminate(
      sessionId: string,
      payload: { reason: string; details?: string },
    ): Promise<IResponse<unknown>> {
      return await api(
        `/meetups/${encodeURIComponent(sessionId)}/terminate`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
    },
  };
};
