// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;   // ✅ FIX: Added
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Still loading? Don't redirect yet.
  if (loading) return <div>Loading...</div>;

  // Not logged in AT ALL → go to login
  if (!user) return <Navigate to="/login" replace />;

  // If this route requires a role, and user doesn't match → redirect
  if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/dashboard" replace />; // default user page
  }

  return <>{children}</>;
};

export default ProtectedRoute;
