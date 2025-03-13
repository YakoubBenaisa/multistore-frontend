
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';


export const PublicRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return !isAuthenticated ? <Outlet /> : <Navigate to="/home" replace />;
  };
  