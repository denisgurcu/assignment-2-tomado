import React from "react";
import { useAuth } from "../authContext";

const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <button onClick={signOut} style={{ marginTop: "20px", cursor: "pointer" }}>
      Logout
    </button>
  );
};

export default LogoutButton;