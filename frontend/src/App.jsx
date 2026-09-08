import { Navigate, Route, Routes } from "react-router-dom";

// ==============================
// PUBLIC PAGES
// ==============================

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ==============================
// ADMIN
// ==============================

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

      {/* =========================================
          PUBLIC HOME
      ========================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* =========================================
          AUTHENTICATION
      ========================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================================
          ADMIN AREA
      ========================================= */}

      <Route
        path="/admin"
        element={<AdminRoute />}
      >
        <Route
          element={<AdminLayout />}
        >

          {/* /admin */}
          {/* automatically redirects to dashboard */}

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
          <Route path="settings" element={<Settings />} />

          {/* Cabinet */}

          <Route
            path="cabinet"
            element={<Cabinet />}
          />
          <Route path="news" element={<News />} />

          <Route path="events" element={<Events />} />
          <Route
          path="emergency-contacts"
            element={<EmergencyContacts />}
           />

        </Route>
      </Route>

      {/* =========================================
          UNKNOWN ROUTES
      ========================================= */}

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