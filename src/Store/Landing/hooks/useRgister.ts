// useLogin.ts
import { useState, useCallback } from "react";
import { loginUser } from "../service/auth";
import { RegisterCredentials, LoginResponse } from "../types/types";


export function useRegister() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<LoginResponse> => {
setLoading(true);
      setError(null);
      try {
        const data = await loginUser(credentials);
        setLoading(false);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return data;
      } catch (err: any) {
        console.log(err.message)
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );      

  return { register, loading, error };
}
