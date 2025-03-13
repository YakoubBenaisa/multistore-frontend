import { useState, useCallback } from "react";
import { StoreService } from "../services/store";
import type {  StoreResponse } from "../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";


// Hook for creating a store
export function useCreateStore() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const user_id = useSelector((state: RootState) => state.user.user?.id)

  const createStore = useCallback(async (
    params: { name: string; description: string },
    userId: string = user_id || '',
    storeId: string = ''
  ): Promise<StoreResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const storeResponse = await StoreService.create(params, userId, storeId);
      
      
      // Dispatch the cleaned store data to Redux
      
      return storeResponse;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createStore, loading, error };
}

// Hook for updating a store
export function useUpdateStore() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const user_id = useSelector((state: RootState) => state.user.user?.id)
  const store_id = useSelector((state: RootState) => state.user.user?.storeId)

  const updateStore = useCallback(async (
    params: { name: string; description: string },
    userId: string = user_id || '',
    storeId: string = store_id || '',
  ): Promise<StoreResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const storeResponse = await StoreService.update(params, userId, storeId);
      
      // Clean the store data before dispatching
      
      // Dispatch the cleaned store data to Redux
      
      return storeResponse;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStore, loading, error };
}