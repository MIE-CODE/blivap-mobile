import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { $api } from "../../services/api-client";
import { updateUser } from "../../stores/auth.slice";
import { setAvatars } from "../../stores/avatar.slice";
import { useAppDispatch } from "../../stores/hooks";
import { getErrorMessage } from "../../utils/lib";

export const useAvatar = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getAvatars();
  }, []);

  const selectAvatar = (val: string) => setSelect(val);

  const getAvatars = async () => {
    try {
      setLoading(true);
      const res = await $api.avatars.get();
      const data = res.data.map((e) => e.url);
      dispatch(setAvatars({ avatars: data }));
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Failed to fetch"),
      });
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!select) return;
    try {
      setLoading(true);
      const res = await $api.avatars.set(select);
      const profileImage = res.data.profileImage;
      dispatch(updateUser({ profileImage }));
      Toast.show({ type: "success", text1: "Avatar updated" });
      router.replace("/home");
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Failed to choose"),
      });
    } finally {
      setLoading(false);
    }
  };

  return { selectAvatar, submit, select, loading };
};
