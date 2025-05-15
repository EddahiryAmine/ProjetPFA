import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      Hello
    </div>
  );
}

export default RoleSelection;
