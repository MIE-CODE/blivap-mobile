import { store } from "@/../stores";
import { logout } from "@/../stores/auth.slice";
import { config } from "@/constants/env";
import Toast from "react-native-toast-message";
import { clearAuthToken } from "./auth-storage";
import { redirectToLogin } from "./navigation";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export const api = async <T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = store.getState().auth.token;
  const { apiUrl } = config;
  const res = await fetch(`${apiUrl}${url}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);

    if (res.status === 401) {
      await clearAuthToken();
      store.dispatch(logout());
      Toast.show({
        type: "error",
        text1: "Session expired, please sign in again",
      });
      redirectToLogin();
    }

    throw new ApiError(
      errorBody?.message ?? `Request failed with status ${res.status}`,
      res.status,
    );
  }
  return (await res.json()) as T;
};
