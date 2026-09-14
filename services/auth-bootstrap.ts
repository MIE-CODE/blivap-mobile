import { AppDispatch } from "../stores";
import {
  logout,
  setAuthInitialized,
  setCredentials,
  setToken,
} from "../stores/auth.slice";
import { $api } from "./api-client";
import { clearAuthToken, getAuthToken } from "./auth-storage";
import { registerForPushNotifications } from "./push-notifications";

export async function bootstrapAuth(dispatch: AppDispatch) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return;
    }

    dispatch(setToken(token));

    const res = await $api.auth.me();
    dispatch(setCredentials({ user: res.data, token }));
    // Existing session: register FCM without blocking bootstrap.
    void registerForPushNotifications();
  } catch {
    await clearAuthToken();
    dispatch(logout());
  } finally {
    dispatch(setAuthInitialized());
  }
}
