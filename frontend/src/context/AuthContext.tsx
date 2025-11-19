import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
    user?: any;
    token?: string;
  }>;
  signup: (userData: any) => Promise<{
    success: boolean;
    message: string;
    user?: any;
    token?: string;
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stored session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { user, token, message } = response.data;

      setUser(user);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return {
        success: true,
        message,
        user,
        token,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Login failed",
      };
    }
  };

  // SIGNUP
  const signup = async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);

      const { user, token, message } = response.data;

      setUser(user);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return {
        success: true,
        message,
        user,
        token,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
