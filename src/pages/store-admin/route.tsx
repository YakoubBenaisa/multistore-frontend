import { useRoutes } from 'react-router-dom'
import Home from './landingPage/Home'
import Dashboard from './dashboard/dashboard'
import SignIn from '../../modules/auth/components/SignInForm'
import SignUp from '../../modules/auth/components/SignUpForm'
import AppLayout from '../../shared/layout/AppLayout'
import NewStorePage from '../../modules/store/components/NewStore'
import { ProtectedRoute } from '../../Routes/ProtectedRoute'
import ProfilePage from './detailsPage/Profile'
import ProductTable from '../../modules/inventory/products/components/prod'
import ProductCreationForm from '../../modules/inventory/products/components/createProd'
import CustomerTable from '../../modules/customers/components/customers'
import OrdersTable from '../../modules/orders/comp/orderTable'
import { StorePage } from '../customers/pages/main'
import { ProductPage } from '../customers/pages/ProductPage'
import CartPage from '../customers/components/cartPage'
const routes = [
  { path: '/home', element: <Home /> },
  { path: 'login', element: <SignIn /> },
  { path: 'register', element: <SignUp /> },
  { path: 'store/create', element: <NewStorePage /> },
  { path: 'stores/:id', element: <StorePage /> },
  { path: 'products/:productId', element: <ProductPage /> },
  { path: 'stores/:id/cart', element: <CartPage /> },

  

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />, 
        children: [
          { index: true, element: <Dashboard /> },
          {path: 'profile', element: <ProfilePage />},
          {path: 'products', element: <ProductTable />},
          {path: 'create/products', element: <ProductCreationForm />},
          {path: '/customers', element: <CustomerTable/>},
          {path: '/orders', element: <OrdersTable/>}
        ],
      },
    ],
  },
  //{ path: '*', element: <Navigate to="/" replace /> },
];

const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default AppRoutes;