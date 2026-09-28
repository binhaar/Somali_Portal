import { Navigate, Route, Routes } from "react-router-dom";

// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/Contact";
import PublicServices from "./pages/Services";
import History from "./pages/History";
import Tourism from "./pages/Tourism";

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
import AdminServices from "./pages/admin/Services";
import Categories from "./pages/admin/Categories";
import Ministries from "./pages/admin/Ministries";
import Agencies from "./pages/admin/Agencies";
import Provinces from "./pages/admin/Provinces";
import Cabinet from "./pages/admin/Cabinet";
import News from "./pages/admin/News";
import Events from "./pages/admin/Events";
import EmergencyContacts from "./pages/admin/EmergencyContacts";
import Settings from "./pages/admin/Settings";
import HistoryAdmin from "./pages/admin/History";

// ✅ TOURISM ADMIN
import TourismAdmin from "./pages/admin/Tourism";

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

      {/* PUBLIC SERVICES */}
      <Route
        path="/services"
        element={<PublicServices />}
      />

      {/* PUBLIC HISTORY */}
      <Route
        path="/history"
        element={<History />}
      />

      {/* PUBLIC TOURISM */}
      <Route
        path="/tourism"
        element={<Tourism />}
      />

      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route
        path="/admin"
        element={<AdminRoute />}
      >

        <Route element={<AdminLayout />}>

          {/* =================================================
              ADMIN ROOT
          ================================================= */}

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
            element={<AdminServices />}
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
              HISTORY
          ================================================= */}

          <Route
            path="history"
            element={<HistoryAdmin />}
          />

          {/* =================================================
              TOURISM ADMIN
          ================================================= */}

          <Route
            path="tourism"
            element={<TourismAdmin />}
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