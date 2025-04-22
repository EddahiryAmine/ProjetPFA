// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const goHome = () => {
    if (user.role === "candidat") navigate("/candidat");
    else if (user.role === "employeur") navigate("/employeur");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left} onClick={goHome}>
        🏠 Accueil
      </div>

      <div style={styles.right}>
        <span onClick={() => navigate("/profil")} style={styles.link}>
          👤 Profil
        </span>
        <span onClick={handleLogout} style={{ ...styles.link, color: "red" }}>
          🔓 Déconnexion
        </span>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#f2f2f2",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  left: {
    fontWeight: "bold",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    gap: "15px",
  },
  link: {
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
};

export default Navbar;
