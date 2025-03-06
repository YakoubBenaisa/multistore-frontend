// useLogin.ts
import { useState, useCallback } from "react";
import { registerUser } from "../services/auth";
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
        //console.log(data);
        const refreshToken = data.data.refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('accessToken', data.data.accessToken);
        return data;
      } catch (err: any) {
        //console.log(err.message)
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    []
  );      

  return { register, loading, error };
}
