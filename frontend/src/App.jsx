import { Navigate, Route, Routes } from "react-router-dom";

// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/Contact";

// =========================================================
// ADMIN COMPONENTS
// =========================================================

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

// =========================================================
// ADMIN PAGES
// =========================================================

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

// =========================================================
// APP
// =========================================================

function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* CONTACT */}
      <Route
        path="/contact"
        element={<Contact />}
      />


      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route
        path="/admin"
        element={<AdminRoute />}
      >
        <Route
          element={<AdminLayout />}
        >

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

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          {/* =================================================
              USERS
          ================================================= */}

          <Route
            path="users"
            element={<Users />}
          />

          {/* =================================================
              SERVICES
          ================================================= */}

          <Route
            path="services"
            element={<Services />}
          />

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <Route
            path="categories"
            element={<Categories />}
          />

          {/* =================================================
              MINISTRIES
          ================================================= */}

          <Route
            path="ministries"
            element={<Ministries />}
          />

          {/* =================================================
              AGENCIES
          ================================================= */}

          <Route
            path="agencies"
            element={<Agencies />}
          />

          {/* =================================================
              PROVINCES
          ================================================= */}

          <Route
            path="provinces"
            element={<Provinces />}
          />

          {/* =================================================
              CABINET
          ================================================= */}

          <Route
            path="cabinet"
            element={<Cabinet />}
          />

          {/* =================================================
              NEWS
          ================================================= */}

          <Route
            path="news"
            element={<News />}
          />

          {/* =================================================
              EVENTS
          ================================================= */}

          <Route
            path="events"
            element={<Events />}
          />

          {/* =================================================
              EMERGENCY CONTACTS
          ================================================= */}

          <Route
            path="emergency-contacts"
            element={<EmergencyContacts />}
          />

          {/* =================================================
              SETTINGS
          ================================================= */}

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>
      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      {/* Any unknown URL → Home */}
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