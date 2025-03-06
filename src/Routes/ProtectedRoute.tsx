

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";


export const ProtectedRoute: React.FC = () => {
    const isAuthenticated = useAuth().isAuthenticated;
    
    const user = useSelector((state: RootState) => state.user.user);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    // If user is authenticated but has no store, redirect to new-store
    if (!user?.storeId) {
      return <Navigate to="/new-store" replace />;
    }
  
    // If user is authenticated and has a store, allow access to the requested route
    return <Outlet />;
  };

  