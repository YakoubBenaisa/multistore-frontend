// useLogin.ts
import { useState, useCallback } from "react";
import { create } from "../services/store";
import { resType } from "../types/types";
import { setStore } from "../../../shared/states/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


export function useCreate() {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const userId = useSelector((state: any) => state.user.user?.id);
    const dispatch = useDispatch();

  const createStore = useCallback(
    async (params: {name: string, description: string}): Promise<resType<any>> => {
      setLoading(true);
      setError(null);
      try {

        const response = await create(params, userId);
        setLoading(false);
        
        if (response.success === false) throw new Error(response.message);
        localStorage.setItem('storeId', response.data.id);
        dispatch(setStore(response.data.id));
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
    [dispatch]
  );

  return { createStore, loading, error };
}
