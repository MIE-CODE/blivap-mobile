import { AppDispatch } from "../stores";
import {
  logout,
  setAuthInitialized,
  setCredentials,
  setToken,
} from "../stores/auth.slice";
import { $api } from "./api-client";
import { clearAuthToken, getAuthToken } from "./auth-storage";

export async function bootstrapAuth(dispatch: AppDispatch) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return;
    }

    dispatch(setToken(token));

    const res = await $api.auth.me();
    dispatch(setCredentials({ user: res.data, token }));
  } catch {
    await clearAuthToken();
    dispatch(logout());
  } finally {
    dispatch(setAuthInitialized());
  }
}
