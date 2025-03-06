import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { loginSuccess, logoutAction } from "../states/auth";
import { getUser, refreshToken } from "../services/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        dispatch(logoutAction());
        setIsLoading(false);
        return;
      }

      try {
        // Use the service function to fetch user data
        const result = await getUser(accessToken);
        
        dispatch(loginSuccess(result.data));
        console.log(result.data)
      } catch (error: any) {
        // Check if the error message indicates an invalid/expired token
        if (
          error.message === "Invalid token" ||
          error.message.toLowerCase().includes("unauthorized")
        ) {
          // If no refresh token exists, logout immediately
          if (!localStorage.getItem("refreshToken")) {
            dispatch(logoutAction());
            setIsLoading(false);
            return;
          }
          try {
            // Attempt to refresh the token
            await refreshToken();
            // Retry authentication after refreshing token
            return authenticate();
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            dispatch(logoutAction());
          }
        } else {
          console.error("Authentication error:", error);
          dispatch(logoutAction());
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only attempt to authenticate if not already authenticated
   if (!isAuthenticated) {
      authenticate();
   } else {
      setIsLoading(false);
    }
  }, [dispatch, isAuthenticated]);

  return { isAuthenticated, user, isLoading };
};
