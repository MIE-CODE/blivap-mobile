import {
  getHasSeenBriefing,
  setHasSeenBriefing,
} from "../../services/briefing-storage";
import { useAppSelector } from "../../stores/hooks";
import { useCallback, useEffect, useState } from "react";

export function useProductBriefing() {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!userId) {
        setVisible(false);
        setIsReady(false);
        return;
      }

      setIsReady(false);

      try {
        const hasSeen = await getHasSeenBriefing(userId);
        if (!cancelled) {
          setVisible(!hasSeen);
          setIsReady(true);
        }
      } catch {
        if (!cancelled) {
          setVisible(false);
          setIsReady(true);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const dismissBriefing = useCallback(async () => {
    if (!userId) {
      setVisible(false);
      return;
    }

    await setHasSeenBriefing(userId);
    setVisible(false);
  }, [userId]);

  return {
    visible: isReady && visible,
    dismissBriefing,
  };
}
