// AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainHome from './pages/landingPage/Home';
import Home from './pages/Store/dashboard/src/pages/Dashboard/Home';
import AppLayout from './pages/Store/dashboard/src/layout/AppLayout';
import UserProfiles from './pages/Store/dashboard/src/pages/UserProfiles';
import Calendar from './pages/Store/dashboard/src/pages/Calendar';
import Blank from './pages/Store/dashboard/src/pages/Blank';
import FormElements from './pages/Store/dashboard/src/pages/Forms/FormElements'; 
import BasicTables from './pages/Store/dashboard/src/pages/Tables/BasicTables';
import Alerts from './pages/Store/dashboard/src/pages/UiElements/Alerts';
import Avatars from './pages/Store/dashboard/src/pages/UiElements/Avatars';
import Badges from './pages/Store/dashboard/src/pages/UiElements/Badges';
import Buttons from './pages/Store/dashboard/src/pages/UiElements/Buttons';
import Images from './pages/Store/dashboard/src/pages/UiElements/Images';
import Videos from './pages/Store/dashboard/src/pages/UiElements/Videos';
import LineChart from './pages/Store/dashboard/src/pages/Charts/LineChart';
import BarChart from './pages/Store/dashboard/src/pages/Charts/BarChart';
import './dashboardStyle.css'
const AppRoutes = () => {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'));

  return (
    <Router >
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<MainHome />} />
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
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
