import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext"; // Provides authentication context to the app which I am still not sure if I understand
import AuthRequired from "./authRequired"; // Higher-order component to protect routes WE MUST PROTECT THE ROUTES!!!!
import PomodoroTimer from "./components/PomodoroTimer"; 
import TaskBoard from "./components/TaskBoard"; 
import SignIn from "./components/SignIn"; // new: Sign-in page component
import SignUp from "./components/SignUp"; // new: Sign-up page component
import LogoutButton from "./components/LogOutButton"; // new: Logout button component 
import "./App.css";

const App = () => {
  return (
    <Router>
      {/* AuthProvider wraps the entire app to provide authentication logic */}
      <AuthProvider>
        <Routes>
          {/* Public Routes - accessible without authentication */}
          <Route path="/sign-in" element={<SignIn />} /> {/* Sign-in page */}
          <Route path="/sign-up" element={<SignUp />} /> {/* Sign-up page */}

          {/* Protected Routes - requires authentication to access */}
          <Route
            path="/"
            element={
              <AuthRequired>
                {/* Main layout for authenticated users */}
                <div className="main-layout">
                  <LogoutButton /> {/* Button to log out the user */}
                  <PomodoroTimer /> 
                  <TaskBoard /> 
                </div>
              </AuthRequired>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;