import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStore } from "../states/storeSlice";
import { StoreService } from "../services/store";
import { RootState } from "../../../redux/store";
import type { Store } from "../types/types";

export default function useGetStore() {
  const dispatch = useDispatch();
  const storeId = useSelector((state: RootState) => state.user.user?.storeId);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStore = useCallback(async (): Promise<Store> => {
    if (!storeId) {
      throw new Error("Store ID not found");
    }

    setLoading(true);
    setError(null);

    try {
      const storeData = await StoreService.getStore(storeId);
      
      return storeData;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return { fetchStore, loading, error };
}
