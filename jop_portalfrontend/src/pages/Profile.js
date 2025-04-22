import React from "react";
import { useAuth } from "../pages/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profil</h2>
      <p><strong>Nom:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Rôle:</strong> {user?.role}</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}

export default Profile;
