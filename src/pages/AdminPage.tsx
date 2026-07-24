import React from "react";
import { Navigate } from "react-router";

export const AdminPage: React.FC = () => {
  return <Navigate to="/home" replace />;
};
