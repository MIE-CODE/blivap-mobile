import { toE164Phone, toLocalPhone } from "@/utils/phone";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { PersonalInformationValues } from "../../schemas/settings.schema";
import { $api } from "../../services/api-client";
import { updateUser } from "../../stores/auth.slice";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { User } from "../../types/user";
import { getErrorMessage } from "../../utils/lib";

function extractUpdatedUser(response: unknown): Partial<User> | null {
  if (!response || typeof response !== "object") return null;

  const root = response as Record<string, unknown>;
  const data = root.data;

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (nested.user && typeof nested.user === "object") {
      return nested.user as Partial<User>;
    }
    if ("firstname" in nested || "email" in nested || "phonenumber" in nested) {
      return nested as Partial<User>;
    }
  }

  if (root.user && typeof root.user === "object") {
    return root.user as Partial<User>;
  }

  return null;
}

export function usePersonalInformation() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo<PersonalInformationValues>(
    () => ({
      firstname: user?.firstname ?? "",
      lastname: user?.lastname ?? "",
      email: user?.email ?? "",
      phonenumber: toLocalPhone(user?.phonenumber),
    }),
    [user],
  );

  const dateOfBirth = user?.dateOfBirth ?? "";

  const savePersonalInformation = async (values: PersonalInformationValues) => {
    try {
      setLoading(true);

      const payload = {
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
        email: values.email.trim(),
        phonenumber: toE164Phone(values.phonenumber),
      };

      const res = await $api.auth.update(payload);
      const serverUser = extractUpdatedUser(res);

      // Always apply what we just saved so UI updates immediately.
      dispatch(updateUser({ ...payload, ...(serverUser ?? {}) }));

      // Sync full user from server when available.
      try {
        const meRes = await $api.auth.me();
        if (meRes?.data) {
          dispatch(updateUser(meRes.data));
        }
      } catch {
        // Local payload already applied.
      }

      Toast.show({
        type: "success",
        text1: "Personal information updated",
      });
      router.back();
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Failed to update personal information"),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    initialValues,
    dateOfBirth,
    loading,
    savePersonalInformation,
  };
}
