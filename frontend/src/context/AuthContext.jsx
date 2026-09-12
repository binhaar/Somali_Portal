import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export const AuthContext = createContext(null);

/*
|--------------------------------------------------------------------------
| useAuth
|--------------------------------------------------------------------------
*/

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

/*
|--------------------------------------------------------------------------
| AuthProvider
|--------------------------------------------------------------------------
*/

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  /*
  |--------------------------------------------------------------------------
  | Check Current Session
  |--------------------------------------------------------------------------
  */

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
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Check Session On App Start
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  const register = async (payload) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        payload
      );

      return {
        success: true,
        data: response.data,
        user: response.data?.user || null,
        message:
          response.data?.message ||
          "Account created successfully.",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";

      return {
        success: false,
        message,
        error: error.response?.data || error,
      };
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

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
      setUser(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Refresh User
  |--------------------------------------------------------------------------
  */

  const refreshUser = async () => {
    return await checkSession();
  };

  /*
  |--------------------------------------------------------------------------
  | Context Value
  |--------------------------------------------------------------------------
  */

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,

    login,
    register,
    logout,

    checkSession,
    refreshUser,
  };

  /*
  |--------------------------------------------------------------------------
  | Provider
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}