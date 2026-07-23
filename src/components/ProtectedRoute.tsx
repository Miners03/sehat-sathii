import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
