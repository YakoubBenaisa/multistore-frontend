import { useRoutes } from 'react-router-dom'
import Home from './landingPage/Home'
import Dashboard from './dashboard/dashboard'
import SignIn from '../../modules/auth/components/SignInForm'
import SignUp from '../../modules/auth/components/SignUpForm'
import AppLayout from '../../shared/layout/AppLayout'
import NewStorePage from '../../modules/store/components/NewStore'
import { ProtectedRoute } from '../../Routes/ProtectedRoute'
import ProfilePage from './detailsPage/Profile'

const routes = [
  { path: '/home', element: <Home /> },
  { path: 'login', element: <SignIn /> },
  { path: 'register', element: <SignUp /> },
  { path: 'store/create', element: <NewStorePage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />, 
        children: [
          { index: true, element: <Dashboard /> },
          {path: 'profile', element: <ProfilePage />},
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