import React from "react";
import { Navigate } from "react-router";

export const ResultsPage: React.FC = () => {
  return <Navigate to="/insights" replace />;
};
