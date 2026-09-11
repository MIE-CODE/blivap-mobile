import { getPostAuthRoute } from "@/utils/auth-routes";
import { toE164Phone } from "@/utils/phone";
import { useRouter } from "expo-router";

import { useState } from "react";
import Toast from "react-native-toast-message";
import { $api } from "../../services/api-client";
import { clearAuthToken, saveAuthToken } from "../../services/auth-storage";
import { redirectToLogin } from "../../services/navigation";
import { logout, setCredentials, updateUser } from "../../stores/auth.slice";
import { useAppDispatch } from "../../stores/hooks";
import { ILogin, IOtp, IRegister } from "../../types/user";
import { getErrorMessage } from "../../utils/lib";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (payload: IOtp) => {
    try {
      setLoading(true);
      await $api.auth.verifyOtp(payload);
      Toast.show({ type: "success", text1: "Email Verified" });
      dispatch(updateUser({ emailVerified: true }));
      router.replace("/avatar");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "OTP verification failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: ILogin) => {
    try {
      setLoading(true);
      const res = await $api.auth.login(payload);
      const { user, accessToken: token } = res.data;
      await saveAuthToken(token);
      dispatch(setCredentials({ user, token }));
      Toast.show({ type: "success", text1: "Signed In" });
      router.replace(getPostAuthRoute(user));
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Login failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const me = async (token: string) => {
    try {
      const res = await $api.auth.me();
      const user = res.data;
      await saveAuthToken(token);
      dispatch(setCredentials({ user, token }));
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Authentication failed"),
      });
    }
  };

  const register = async (payload: IRegister) => {
    try {
      setLoading(true);
      const { firstname, lastname, phonenumber, email, password, dateOfBirth } =
        payload;

      const res = await $api.auth.register({
        firstname,
        lastname,
        phonenumber: toE164Phone(phonenumber),
        email,
        password,
        dateOfBirth,
      });
      const { user, accessToken: token } = res.data;
      await saveAuthToken(token);
      dispatch(setCredentials({ user, token }));
      Toast.show({ type: "success", text1: "Registered" });
      router.replace("/verify-otp");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Register failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    await clearAuthToken();
    dispatch(logout());
    Toast.show({
      type: "success",
      text1: "Logged out",
    });
    redirectToLogin();
  };

  return { register, login, verifyOtp, me, logOut, loading };
};
