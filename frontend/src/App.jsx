import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/Contact";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Services from "./pages/admin/Services";
import Categories from "./pages/admin/Categories";
import Ministries from "./pages/admin/Ministries";
import Agencies from "./pages/admin/Agencies";
import Provinces from "./pages/admin/Provinces";
import Cabinet from "./pages/admin/Cabinet";
import News from "./pages/admin/News";
import Events from "./pages/admin/Events";
import EmergencyContacts from "./pages/admin/EmergencyContacts";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Pages */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="services"
            element={<Services />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="ministries"
            element={<Ministries />}
          />

          <Route
            path="agencies"
            element={<Agencies />}
          />

          <Route
            path="provinces"
            element={<Provinces />}
          />

          <Route
            path="cabinet"
            element={<Cabinet />}
          />

          <Route
            path="news"
            element={<News />}
          />

          <Route
            path="events"
            element={<Events />}
          />

          <Route
            path="emergency-contacts"
            element={<EmergencyContacts />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;