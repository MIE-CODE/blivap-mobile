import { IResponse } from "../types/api-response";
import { InAppNotification } from "../types/notification";
import { RegisterFcmSubscriptionPayload } from "../types/push-notification";
import { api } from "./fetcher";

export default () => {
  return {
    async list(params?: {
      skip?: number;
      limit?: number;
    }): Promise<IResponse<InAppNotification[]>> {
      const query = new URLSearchParams({
        skip: String(params?.skip ?? 0),
        limit: String(params?.limit ?? 30),
      });
      return await api(`/notifications?${query.toString()}`, { method: "GET" });
    },
    async markRead(id: string): Promise<IResponse<unknown>> {
      return await api(`/notifications/${encodeURIComponent(id)}/read`, {
        method: "PATCH",
      });
    },
    async markAllRead(): Promise<IResponse<unknown>> {
      return await api("/notifications/mark-all-read", { method: "POST" });
    },
    async registerFcmSubscription(
      payload: RegisterFcmSubscriptionPayload,
    ): Promise<IResponse<{ id?: string; message?: string }>> {
      return await api("/notifications/push-subscriptions/fcm", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
};
