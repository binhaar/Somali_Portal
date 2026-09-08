import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function AdminRoute() {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  // ==============================
  // CHECKING AUTHENTICATION
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div
            className="
              w-12
              h-12
              border-4
              border-slate-200
              border-t-green-700
              rounded-full
              animate-spin
            "
          />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // NOT LOGGED IN
  // ==============================

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ==============================
  // CHECK ADMIN ROLE
  // ==============================

  if (user.role !== "ADMIN") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ==============================
  // ADMIN ACCESS GRANTED
  // ==============================

  return <Outlet />;
}

export default AdminRoute;