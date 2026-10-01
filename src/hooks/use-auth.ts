import { getPostAuthRoute } from "@/utils/auth-routes";
import { openRoute } from "@/utils/open-route";
import { toE164Phone } from "@/utils/phone";
import { useRouter } from "expo-router";

import { useState } from "react";
import Toast from "react-native-toast-message";
import { $api } from "../../services/api-client";
import {
  firebaseIdToken,
  isSocialCancelled,
  SocialProvider,
} from "../../services/social-auth";
import { clearAuthToken, saveAuthToken } from "../../services/auth-storage";
import { redirectToLogin } from "../../services/navigation";
import { registerForPushNotifications } from "../../services/push-notifications";
import { logout, setCredentials, updateUser } from "../../stores/auth.slice";
import { useAppDispatch } from "../../stores/hooks";
import { ILogin, IOtp, IRegister, IVerifyNin } from "../../types/user";
import { getErrorMessage } from "../../utils/lib";

function registerPushInBackground() {
  console.log("[push] auth.trigger_register_after_login");
  void registerForPushNotifications();
}

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

  const verifyNin = async (payload: IVerifyNin) => {
    try {
      setLoading(true);
      const res = await $api.auth.verifyNin(payload);
      const updatedUser = res.data;

      dispatch(
        updateUser(
          updatedUser ?? {
            nationalIdentificationNumberVerified: true,
          },
        ),
      );

      Toast.show({
        type: "success",
        text1: "Identity verified",
      });
      openRoute("/donate-blood/medical-questions");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "NIN verification failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithSocial = async (provider: SocialProvider) => {
    try {
      setLoading(true);
      const idToken = await firebaseIdToken(provider);
      const res = await $api.auth.social({ idToken });
      const { user, accessToken: token } = res.data;
      await saveAuthToken(token);
      dispatch(setCredentials({ user, token }));
      registerPushInBackground();
      Toast.show({ type: "success", text1: "Signed In" });
      router.replace(getPostAuthRoute(user));
    } catch (e) {
      if (isSocialCancelled(e)) return;
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Could not sign in"),
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
      registerPushInBackground();
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
      registerPushInBackground();
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

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await $api.auth.forgotPassword({ email });
      Toast.show({
        type: "success",
        text1: "Reset link sent to your email",
      });
      return true;
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Could not send reset email"),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetToken: string, password: string) => {
    try {
      setLoading(true);
      await $api.auth.resetPassword({ resetToken, password });
      Toast.show({ type: "success", text1: "Password reset successfully" });
      router.replace("/login");
      return true;
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Password reset failed"),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, password: string) => {
    try {
      setLoading(true);
      await $api.auth.changePassword({ oldPassword, password });
      Toast.show({ type: "success", text1: "Password changed" });
      return true;
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Could not change password"),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    try {
      setLoading(true);
      await $api.auth.resendEmailVerification(email);
      Toast.show({ type: "success", text1: "Verification code sent" });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Could not resend the code"),
      });
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await $api.auth.logout();
    } catch {
      // Local session still ends if the server token is already invalid.
    }
    await clearAuthToken();
    dispatch(logout());
    Toast.show({
      type: "success",
      text1: "Logged out",
    });
    redirectToLogin();
  };

  return {
    register,
    login,
    signInWithSocial,
    verifyOtp,
    verifyNin,
    me,
    forgotPassword,
    resetPassword,
    changePassword,
    resendVerification,
    logOut,
    loading,
  };
};
