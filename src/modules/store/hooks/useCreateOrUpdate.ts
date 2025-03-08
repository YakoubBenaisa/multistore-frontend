
import { useState, useCallback } from "react";
import  {StoreService} from "../services/store";
import { responseType,Store } from "../types/types";
import { setStore } from "../states/storeSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


export function useCreate( ) {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const userId = useSelector((state: any) => state.user.user?.id);
  const storeId = useSelector((state:any)=> state.user.user?.storeId)

  const createStore = useCallback(
    async (params: {name: string, description: string}): Promise<responseType> => {
      setLoading(true);
      setError(null);
      try {

        const response = await StoreService.create(params, userId, storeId);
        setLoading(false);
        
        if (response.success === false) throw new Error("Failed to create store");
        //localStorage.setItem('storeId', response.data.id);
        const store: Omit<Store, 'owner' | 'owner_id' | 'created_at' | 'updated_at'> = response.data;
        console.log(store)
        //dispatch(setStore(store));
        return response;

      } catch (err: any) {
        setError(err);
        console.log(err.message)
        setTimeout(() => {
          setError(null);
        }, 3000);
        

        setLoading(false);
        throw err;
      }
    },
    []
  );

  return { createStore, loading, error };
}




export function useUpdate( ) {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const userId = useSelector((state: any) => state.user.user?.id);
  const storeId = useSelector((state:any)=> state.user.user?.storeId)

  const updateStore = useCallback(
    async (params: {name: string, description: string}): Promise<responseType> => {
      setLoading(true);
      setError(null);
      try {

        const response = await StoreService.update(params, userId, storeId);
        setLoading(false);
        
        if (response.success === false) throw new Error("Failed to create store");
        //localStorage.setItem('storeId', response.data.id);
        const store: Omit<Store, 'owner' | 'owner_id' | 'created_at' | 'updated_at'> = response.data;
        console.log(response.data.data)
        console.log(store)
        return response;

      } catch (err: any) {
        setError(err);
        console.log(err.message)
        setTimeout(() => {
          setError(null);
        }, 3000);
        

        setLoading(false);
        throw err;
      }
    },
    []
  );

  return { updateStore, loading, error };
}