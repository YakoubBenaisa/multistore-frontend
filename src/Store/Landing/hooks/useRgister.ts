// useLogin.ts
import { useState, useCallback } from "react";
import { registerUser } from "../service/auth";
import { RegisterCredentials, RegisterResponse } from "../types/types";


export function useRegister() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
setLoading(true);
      setError(null);
      try {
        const data = await registerUser(credentials);
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
