import { Navigate, Route, Routes } from "react-router-dom";

import ComingSoon from "./pages/ComingSoon";

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
      {/* =========================
          PUBLIC PAGES
      ========================= */}

      {/* Temporary Coming Soon Page */}
      <Route
        path="/"
        element={<ComingSoon />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* =========================
          ADMIN PAGES
      ========================= */}

      <Route
        path="/admin"
        element={<AdminRoute />}
      >
        <Route element={<AdminLayout />}>

          {/* /admin → /admin/dashboard */}
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<Users />}
          />

          {/* Services */}
          <Route
            path="services"
            element={<Services />}
          />

          {/* Categories */}
          <Route
            path="categories"
            element={<Categories />}
          />

          {/* Ministries */}
          <Route
            path="ministries"
            element={<Ministries />}
          />

          {/* Agencies */}
          <Route
            path="agencies"
            element={<Agencies />}
          />

          {/* Provinces */}
          <Route
            path="provinces"
            element={<Provinces />}
          />

          {/* Cabinet */}
          <Route
            path="cabinet"
            element={<Cabinet />}
          />

          {/* News */}
          <Route
            path="news"
            element={<News />}
          />

          {/* Events */}
          <Route
            path="events"
            element={<Events />}
          />

          {/* Emergency Contacts */}
          <Route
            path="emergency-contacts"
            element={<EmergencyContacts />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>
      </Route>

      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;