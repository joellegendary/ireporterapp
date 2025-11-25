// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ReportProvider } from "./context/ReportContext";
import { useAuth } from "./context/AuthContext";

import { Toaster } from "react-hot-toast";

// Pages
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Profile/Profile";
import CreateReport from "./pages/CreateReport/CreateReport";
import EditReport from "./pages/EditReport/EditReport";
import Reports from "./pages/Reports/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

// --------------------------------------------
// ROUTES HANDLER
// --------------------------------------------
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* AUTH ROUTES - Redirect if already authenticated */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate
              to={user?.role === "admin" ? "/admin" : "/dashboard"}
              replace
            />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !isAuthenticated ? (
            <Signup />
          ) : (
            <Navigate
              to={user?.role === "admin" ? "/admin" : "/dashboard"}
              replace
            />
          )
        }
      />

      {/* USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* PROFILE - Accessible to all authenticated users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* CREATE REPORT - Accessible to all authenticated users */}
      <Route
        path="/create-report"
        element={
          <ProtectedRoute>
            <CreateReport />
          </ProtectedRoute>
        }
      />

      {/* EDIT REPORT - Accessible to all authenticated users */}
      <Route
        path="/edit-report/:reportId"
        element={
          <ProtectedRoute>
            <EditReport />
          </ProtectedRoute>
        }
      />

      {/* USER REPORTS - Accessible to all authenticated users */}
      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* ALL REPORTS - Consider if this should be admin only? */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTES REDIRECT */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// --------------------------------------------
// MAIN APP WRAPPER
// --------------------------------------------
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ReportProvider>
          <div className="App">
            <Toaster
              position="top-right"
              gutter={12}
              toastOptions={{
                duration: 2500,
                style: {
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#1f2937",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  animation: "slideIn 0.35s ease-out",
                },
                success: {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="#10B981"
                        opacity="0.9"
                      />
                      <path
                        d="M8 12.5L10.5 15L16 9.5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  style: {
                    background: "rgba(209, 250, 229, 0.35)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                  },
                },
                error: {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="#EF4444"
                        opacity="0.9"
                      />
                      <path
                        d="M15 9L9 15"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 9L15 15"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                  style: {
                    background: "rgba(254, 226, 226, 0.35)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                  },
                },
              }}
            />

            <AppRoutes />
          </div>
        </ReportProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
