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

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* CREATE REPORT */}
      <Route
        path="/create-report"
        element={
          <ProtectedRoute>
            <CreateReport />
          </ProtectedRoute>
        }
      />

      {/* EDIT REPORT */}
      <Route
        path="/edit-report/:reportId"
        element={
          <ProtectedRoute>
            <EditReport />
          </ProtectedRoute>
        }
      />

      {/* USER REPORTS */}
      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* ALL REPORTS */}
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
              position="top-center"
              gutter={12}
              toastOptions={{
                duration: 3000,
                style: {
                  padding: "10px 10px",
                  borderRadius: "18px",
                  background: "rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  color: "#1f2937",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                },

                success: {
                  icon: (
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  ),
                  style: {
                    background: "rgba(209, 250, 229, 0.25)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                  },
                },

                error: {
                  icon: (
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </div>
                  ),
                  style: {
                    background: "rgba(254, 226, 226, 0.25)",
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
