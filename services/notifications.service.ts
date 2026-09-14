import { IResponse } from "../types/api-response";
import { RegisterFcmSubscriptionPayload } from "../types/push-notification";
import { api } from "./fetcher";

export default () => {
  return {
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
