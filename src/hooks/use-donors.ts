import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { $api } from "../../services/api-client";
import { setDonors } from "../../stores/donors.slice";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { Donor } from "../../types/donor";
import { getErrorMessage } from "../../utils/lib";

type DonorFilters = {
  bloodType?: string;
  search?: string;
  /** Home keeps the shared list. Filtered screens keep their own copy. */
  syncStore?: boolean;
};

export const useDonors = (filters: DonorFilters = {}) => {
  const { bloodType, search, syncStore = true } = filters;
  const [loading, setLoading] = useState(false);
  const [localDonors, setLocalDonors] = useState<Donor[] | null>(null);
  const dispatch = useAppDispatch();
  const storedDonors = useAppSelector((state) => state.donors.donors);

  const get = useCallback(async () => {
    try {
      setLoading(true);
      const res = await $api.donors.get({
        bloodType: bloodType || undefined,
        search: search || undefined,
        limit: 50,
      });
      const donors = Array.isArray(res.data) ? res.data : [];
      if (syncStore) {
        dispatch(setDonors({ donors }));
      } else {
        setLocalDonors(donors);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(e, "Error occured"),
      });
    } finally {
      setLoading(false);
    }
  }, [bloodType, dispatch, search, syncStore]);

  useEffect(() => {
    void get();
  }, [get]);

  return {
    get,
    loading,
    donors: syncStore ? storedDonors : localDonors,
  };
};
