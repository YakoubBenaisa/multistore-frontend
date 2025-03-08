// useLogin.ts
import { useState, useCallback } from "react";
import { AuthService } from "../services/auth";
import { LoginCredentials, LoginResponse } from "../types/types";

export function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<LoginResponse> => {
      setLoading(true);
      setError(null);
      try {

        const data = await AuthService.loginUser(credentials);
        
        setLoading(false);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        
        console.log(localStorage.getItem('accessToken'));
        console.log(localStorage.getItem('refreshToken'));
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

  return { login, loading, error };
}
