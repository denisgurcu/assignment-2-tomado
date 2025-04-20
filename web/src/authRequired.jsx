import React from "react";
import { Navigate } from "react-router-dom"; 
import { useAuth } from "./authContext"; // hook to access authentication related data

// this ensures  only authenticated users can access certain parts of the app
const AuthRequired = ({ children }) => {
  // to get the current authentication status
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect them to the Sign-In page
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />; 
    //  "replace"  prevents the user going back to the protected route 
  }

  // If the user is authenticated, allow them to access the content
  return children;
};

export default AuthRequired;