import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../../states/store';

// PublicRoute.tsx
export const PublicRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isLogged);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// ProtectedRoute.tsx
export const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isLogged);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

