import React from "react";
import { useAuth } from "../authContext";

const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="logout-button"
    >
      Logout
    </button>
  );
};

export default LogoutButton;