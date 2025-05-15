import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from './AuthContext'; // adapte si besoin

const LogoutButton = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
    } catch (err) {
      console.warn("Erreur de logout :", err);
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      <i className="bi bi-box-arrow-right me-1"></i> Se déconnecter
    </button>
  );
};

export default LogoutButton;
