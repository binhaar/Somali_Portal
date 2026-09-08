import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // AUTHENTICATION STATUS
  // =========================================================

  const isAuthenticated = Boolean(user);

  // =========================================================
  // CHECK CURRENT SESSION
  // =========================================================

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

  // =========================================================
  // RUN SESSION CHECK WHEN APP STARTS
  // =========================================================

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // =========================================================
  // LOGIN
  // =========================================================

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

      // Save authenticated user in React state.
      // JWT/session cookie is handled by the backend.
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

  // =========================================================
  // LOGOUT
  // =========================================================

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

  // =========================================================
  // REFRESH USER
  // =========================================================

  const refreshUser = async () => {
    return await checkSession();
  };

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}