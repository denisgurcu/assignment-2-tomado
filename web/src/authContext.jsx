import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a token exists in localStorage on app initialization
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = (jwtToken) => {
    // Save the JWT in localStorage
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setIsAuthenticated(true);
    navigate("/"); // Redirect to the main app
  };

  const signOut = () => {
    // Clear the JWT from localStorage
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/sign-in"); // Redirect to the login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, token }}>
      {children}
    </AuthContext.Provider>
  );
};