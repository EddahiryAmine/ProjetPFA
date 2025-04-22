import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom"; // pour redirection

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'candidat', 
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post('/api/register', form);

     
      const token = res.data.access_token;
      localStorage.setItem('token', token);

      setMessage("✅ Compte créé ! Un email de vérification vous a été envoyé.");
      setTimeout(() => {
        navigate("/verify-email"); // ou une autre page informative
      }, 2500);

    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data);
      const errorMsg = error.response?.data?.message || "Une erreur s'est produite.";
      setMessage("❌ " + errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <h2>Créer un compte</h2>
      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px' }} />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px' }} />
        <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px' }} />
        <input name="password_confirmation" placeholder="Confirmer" type="password" onChange={handleChange} required style={{ width: '100%', marginBottom: '10px' }} />
        <select name="role" onChange={handleChange} value={form.role} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="candidat">Candidat</option>
          <option value="employeur">Employeur</option>
        </select>
        <button type="submit" style={{ width: '100%' }}>S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
