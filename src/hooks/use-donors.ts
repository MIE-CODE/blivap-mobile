import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { $api } from "../../services/api-client";
import { setDonors } from "../../stores/donors.slice";
import { useAppDispatch } from "../../stores/hooks";
import { getErrorMessage } from "../../utils/lib";

export const useDonors = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    get();
  }, []);
  const get = async () => {
    try {
      setLoading(true);
      const res = await $api.donors.get();
      dispatch(setDonors({ donors: res.data }));
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Error occured"),
      });
    } finally {
      setLoading(false);
    }
  };
  return { get, loading };
};
