// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerified from "./pages/EmailVerified";
import CandidatHome from "./pages/CandidatHome";
import EmployeurHome from "./pages/EmployeurHome";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./pages/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

function RoleBasedRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  return user.role === 'candidat' ? <Navigate to="/candidat" /> : <Navigate to="/employeur" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/redirect" element={<RoleBasedRedirect />} />

          <Route path="/candidat" element={
            <ProtectedRoute>
              <CandidatHome />
            </ProtectedRoute>
          }/>

          <Route path="/employeur" element={
            <ProtectedRoute>
              <EmployeurHome />
            </ProtectedRoute>
          }/>

          <Route path="/profil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
