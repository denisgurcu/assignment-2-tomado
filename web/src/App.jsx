import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskBoard from './components/TaskBoard'; // Your task board component
import Auth from './components/Auth'; // Login/Register component
import PomodoroTimer from './components/PomodoroTimer'; // Import Pomodoro Timer component
import authRequired from './authRequired'; // Protect routes

// Protect the task board route
const ProtectedTaskBoard = authRequired(TaskBoard);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Fetch user info based on the JWT token
  const fetchUser = () => {
    const token = localStorage.getItem("authToken");
    console.log("Fetching user with token:", token);  // Log the token being used

    if (!token) return;

    fetch("http://localhost:3000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Unauthorized response:", res); // Log if the response is not ok
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        console.log("User data fetched:", data);  // Log user data response
        setIsAuthenticated(true);
        setUsername(data.email);  // Assuming email is returned
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUsername("");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Checking token on page load:", token); // Log token when the app loads

    if (token) {
      fetchUser(); // Fetch user data on page load
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    console.log("Logging in...");  // Log when login is triggered
    fetchUser();
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  const handleLogout = () => {
    console.log("Logging out...");  // Log when logout is triggered
    localStorage.removeItem("authToken"); // Remove token on logout
    setIsAuthenticated(false); // Update state to not authenticated
    setUsername(""); // Reset username
    navigate("/"); // Redirect to login page
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/dashboard"
            element={isAuthenticated ? (
              <>
                <PomodoroTimer /> {/* Pomodoro Timer */}
                <ProtectedTaskBoard /> {/* Task Board */}
              </>
            ) : (
              <Navigate to="/" />  // Redirect to login if not authenticated
            )}
          />
        </Routes>

        {isAuthenticated && (
          <button onClick={handleLogout} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            Logout
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
