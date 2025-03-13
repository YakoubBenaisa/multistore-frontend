

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { StoreService } from "../services/store";
import { RootState } from "../../../redux/store";
import type { Store } from "../types/types";

// Hook for getting store data
export function useGetStore() {
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
      const storeResponse = await StoreService.getStore(storeId);
      
      // Clean the store data before dispatching
      const { owner_id, created_at, updated_at, owner, ...cleanStore } = storeResponse.data;
      
      // Dispatch the cleaned store data to Redux
      //dispatch(setStore(cleanStore));
      
      return cleanStore as Store;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return { fetchStore, loading, error };
}