import { useRouter } from "expo-router";

import { useState } from "react";
import Toast from "react-native-toast-message";
import { $api } from "../../services/api-client";
import { ApiError } from "../../services/fetcher";
import { logout, setCredentials } from "../../stores/auth.slice";
import { useAppDispatch } from "../../stores/hooks";
import { ILogin, IRegister } from "../../types/user";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const register = async (payload: IRegister) => {
    const { fullName, phoneNumber, email, password } = payload;
    const res = await $api.auth.register();
    console.log({ fullName, phoneNumber, email, password });
    router.push("/verify-otp");
  };

  const verifyOtp = (payload: string) => {
    if (payload.length === 4) {
      router.push("/login");
    }
  };
  const login = async (payload: ILogin) => {
    try {
      setLoading(true);
      const res = await $api.auth.login(payload);
      const {
        user,
        accessToken: token,
        user: { profileImage },
      } = res.data;
      Toast.show({ type: "success", text1: "Signed In" });
      dispatch(setCredentials({ user, token }));
      router.replace("/home");
      setLoading(false);
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "Login failed";
      Toast.show({ type: "error", text1: message });
      setLoading(false);
    }
  };

  const logOut = () => {
    dispatch(logout());
    Toast.show({
      type: "error",
      text1: "Logged out",
    });
    router.replace("/login");
  };
  return { register, login, verifyOtp, logOut, loading };
};
