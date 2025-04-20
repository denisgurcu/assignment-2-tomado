import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const AuthRequired = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default AuthRequired;