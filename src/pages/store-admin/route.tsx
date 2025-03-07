import { Navigate, useRoutes } from 'react-router-dom'
import Home from './landingPage/Home'
import Dashboard from './dashboard/dashboard'
import SignIn from '../../modules/auth/components/SignInForm'
import SignUp from '../../modules/auth/components/SignUpForm'
import AppLayout from '../../shared/layout/AppLayout'
import StorePage from '../../modules/store/components/NewStore'
import { ProtectedRoute } from '../../Routes/ProtectedRoute'
const routes = [
  { path: '/', element: <Home /> },
  { path: 'login', element: <SignIn /> },
  { path: 'register', element: <SignUp /> },
  { path: 'new-store', element: <StorePage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: 'dashboard',
        element: <AppLayout />, 
        children: [
          { index: true, element: <Dashboard /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default AppRoutes;