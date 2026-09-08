import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

// =========================================================
// AUTH CONTEXT
// =========================================================

export const AuthContext = createContext(null);

// =========================================================
// USE AUTH HOOK
// =========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}

// =========================================================
// AUTH PROVIDER
// =========================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =======================================================
  // AUTHENTICATION STATUS
  // =======================================================

  const isAuthenticated = Boolean(user);

  // =======================================================
  // CHECK CURRENT SESSION
  // =======================================================

  const checkSession = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");

      const currentUser =
        response.data?.user || response.data;

      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }

      return currentUser;
    } catch (error) {
      // No valid session
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =======================================================
  // RUN SESSION CHECK WHEN APP STARTS
  // =======================================================

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // =======================================================
  // LOGIN
  // =======================================================

  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const loggedInUser =
        response.data?.user || response.data;

      if (!loggedInUser) {
        throw new Error(
          "Login successful, but user information was not returned."
        );
      }

      // Save authenticated user
      // JWT/session cookie is handled by backend
      setUser(loggedInUser);

      return {
        success: true,
        user: loggedInUser,
        data: response.data,
      };
    } catch (error) {
      setUser(null);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please check your email and password.";

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout request failed:",
        error.response?.data?.message ||
          error.message
      );
    } finally {
      // Always remove user from frontend state
      setUser(null);
    }
  };

  // =======================================================
  // REFRESH USER
  // =======================================================

  const refreshUser = async () => {
    return await checkSession();
  };

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  const value = {
    user,
    setUser,

    loading,

    isAuthenticated,

    login,
    logout,

    checkSession,
    refreshUser,
  };

  // =======================================================
  // PROVIDER
  // =======================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}