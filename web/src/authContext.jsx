import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// an authentication context to manage user authentication state across the app
const AuthContext = createContext();

// access the authentication context
// this did made things easier
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // store the user's  token
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  // Check if a token exists in 
  // with this user's authentication state persists even after refreshing the page (works!!)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); 
      setIsAuthenticated(true); 
    }
  }, []); 

  // handle user sign-in
  const signIn = (jwtToken) => {
    localStorage.setItem("token", jwtToken); // Save the token in localStorage
    setToken(jwtToken); 
    setIsAuthenticated(true); // mark the user as authenticated
    navigate("/"); // take the user to the  app
  };

  //  handle user sign-out
  const signOut = () => {
    localStorage.removeItem("token"); // remove the token from localStorage
    setToken(null); 
    setIsAuthenticated(false); 
    navigate("/sign-in"); // take the user to the login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, token }}>
      {children} 
    </AuthContext.Provider>
  );
};