// AppRoutes.tsx
import { BrowserRouter } from 'react-router-dom';
import StoreAdminRoutes from '../pages/store-admin/route';

const AppRoutes = () => {
  return (
    
    <BrowserRouter>
    <StoreAdminRoutes />
  </BrowserRouter>

  );
};

export default AppRoutes;