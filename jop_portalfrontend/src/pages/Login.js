import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'candidat',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "true") {
      setVerifiedMessage("✅ Votre adresse email a été vérifiée. Vous pouvez maintenant vous connecter.");
    } else if (params.get("verified") === "false") {
      setVerifiedMessage("❌ Le lien de vérification est invalide ou expiré.");
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/redirect');
    } catch (error) {
      console.error(error.response.data);
      alert("Erreur de connexion : " + (error.response?.data?.message || "Vérifiez vos identifiants."));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      {verifiedMessage && (
        <div style={{ color: "green", marginBottom: "20px" }}>
          {verifiedMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          name="password"
          placeholder="Mot de passe"
          type="password"
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <select
          name="role"
          onChange={handleChange}
          value={form.role}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        >
          <option value="candidat">Candidat</option>
          <option value="employeur">Employeur</option>
        </select>
        <button type="submit" style={{ width: "100%" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
