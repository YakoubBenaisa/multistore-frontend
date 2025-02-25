// AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainHome from './Store/Landing/pages/Home';
import Home from './Store/Admin/pages/Dashboard/Home';
import AppLayout from './Store/Admin/layout/AppLayout';
import UserProfiles from './Store/Admin/pages/UserProfiles';
import Calendar from './Store/Admin/pages/Calendar';
import Blank from './Store/Admin/pages/Blank';
import FormElements from './Store/Admin/pages/Forms/FormElements'; 
import BasicTables from './Store/Admin/pages/Tables/BasicTables';
import Alerts from './Store/Admin/pages/UiElements/Alerts';
import Avatars from './Store/Admin/pages/UiElements/Avatars';
import Badges from './Store/Admin/pages/UiElements/Badges';
import Buttons from './Store/Admin/pages/UiElements/Buttons';
import Images from './Store/Admin/pages/UiElements/Images';
import Videos from './Store/Admin/pages/UiElements/Videos';
import LineChart from './Store/Admin/pages/Charts/LineChart';
import BarChart from './Store/Admin/pages/Charts/BarChart';
import './dashboardStyle.css'
import NotFound from './Store/Admin/pages/OtherPage/NotFound';
import SignIn from './Store/Landing/pages/SignIn';
import SignUp from './Store/Landing/pages/SignUp';
import { useSelector } from 'react-redux';
import { RootState } from './states/store';

const AppRoutes = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isLogged)

  return (
    <Router >
      <Routes>
        {/* Public Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to={"/dashboard"}/>: <MainHome />} />
        <Route path='/login' element={isAuthenticated ? <Navigate to={"/dashboard"}/> : <SignIn />}/>
        <Route path='/register' element={isAuthenticated ? <Navigate to={"/dashboard"}/> : <SignUp />}/>
        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <AppLayout /> : <Navigate to="/" replace />
          }
        >
          {/* Nested Routes for Dashboard */}
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
          <Route path='ss' element={<NotFound/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
