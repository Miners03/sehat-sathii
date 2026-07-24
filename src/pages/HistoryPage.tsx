import React from "react";
import { Navigate } from "react-router";

export const HistoryPage: React.FC = () => {
  return <Navigate to="/dashboard" replace />;
};
