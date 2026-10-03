import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/Contact";
import PublicServices from "./pages/Services";
import History from "./pages/History";
import Tourism from "./pages/Tourism";
import PeopleCulture from "./pages/PeopleCulture";

// =====================================================
// ADMIN PAGES
// =====================================================

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
import HistoryAdmin from "./pages/admin/History";
import TourismAdmin from "./pages/admin/Tourism";
import PeopleCultureAdmin from "./pages/admin/PeopleCulture";
import Settings from "./pages/admin/Settings";

// =====================================================
// ADMIN AUTH & LAYOUT
// =====================================================

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
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

      <Route
        path="/services"
        element={<PublicServices />}
      />

      {/* =================================================
          NATION
      ================================================= */}

      {/* History - DO NOT CHANGE */}
      <Route
        path="/history"
        element={<History />}
      />

      {/* Tourism */}
      <Route
        path="/tourism"
        element={<Tourism />}
      />

      {/* People & Culture */}
      <Route
        path="/people-culture"
        element={<PeopleCulture />}
      />

      {/* =================================================
          ADMIN ROUTES
      ================================================= */}

      <Route
        path="/admin"
        element={<AdminRoute />}
      >
        <Route element={<AdminLayout />}>

          {/* Admin root */}
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
            element={<AdminServices />}
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

          {/* History */}
          <Route
            path="history"
            element={<HistoryAdmin />}
          />

          {/* Tourism */}
          <Route
            path="tourism"
            element={<TourismAdmin />}
          />

          {/* People & Culture */}
          <Route
            path="people-culture"
            element={<PeopleCultureAdmin />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>
      </Route>

      {/* =================================================
          FALLBACK
      ================================================= */}

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