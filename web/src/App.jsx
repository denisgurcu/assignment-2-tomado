import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import AuthRequired from "./authRequired";
import PomodoroTimer from "./components/PomodoroTimer";
import TaskBoard from "./components/TaskBoard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import LogoutButton from "./components/LogoutButton";

const App = () => {
  return (
    <Router>
      {/* Wrap AuthProvider inside the Router */}
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthRequired>
                <div className="main-layout">
                  <PomodoroTimer />
                  <TaskBoard />
                  <LogoutButton />
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