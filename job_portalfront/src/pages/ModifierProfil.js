import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaGraduationCap, 
  FaGlobe, 
  FaFile, 
  FaCheck, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaSave
} from 'react-icons/fa';

const ModifierProfil = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    titre_diplome: '',
    portfolio_link: '',
    preferences: [],
  });
  const [cv, setCv] = useState(null);
  const [allPreferences, setAllPreferences] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const meRes = await axios.get('http://localhost:8000/api/candidat/me');
        setForm({
          name: meRes.data.name,
          email: meRes.data.email,
          titre_diplome: meRes.data.titre_diplome || '',
          portfolio_link: meRes.data.portfolio_link || '',
          preferences: meRes.data.preferences || []
        });

        const prefsRes = await axios.get('http://localhost:8000/api/preferences');
        setAllPreferences(prefsRes.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement du profil.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePrefChange = e => {
    const values = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
    setForm({ ...form, preferences: values });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    if (form.preferences.length < 3 || form.preferences.length > 6) {
      setError('Veuillez sélectionner entre 3 et 6 préférences.');
      setSubmitLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('titre_diplome', form.titre_diplome);
    formData.append('portfolio_link', form.portfolio_link);
    form.preferences.forEach(id => formData.append('preferences[]', id));
    if (cv) formData.append('cv', cv);
    formData.append('_method', 'PUT');

    try {
      await axios.post('http://localhost:8000/api/candidat/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Profil mis à jour avec succès');
      setSubmitLoading(false);
      setTimeout(() => navigate('/candidathome'), 1500);
    } catch (err) {
      console.error("Erreur de mise à jour :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil.");
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="fancy-loader">
          <div className="loader-circle"></div>
          <div className="loader-line-mask">
            <div className="loader-line"></div>
          </div>
          <span className="loader-text">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <style>
        {`
          /* Animation Keyframes */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes growLine {
            0% { width: 0; }
            100% { width: 100%; }
          }
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Main Styles */
          .edit-profile-page {
            min-height: 100vh;
            width: 100%;
            padding: 30px 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Poppins', sans-serif;
                        padding-top:96px;

          }
          
          .form-container {
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          .form-header {
            background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
            background-size: 200% 200%;
            animation: gradientFlow 10s ease infinite;
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
          }
          
          .form-header h2 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .form-header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          
          .form-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 5px 5px 0 0;
          }
          
          .form-body {
            padding: 30px;
          }
          
          .form-section {
            margin-bottom: 25px;
            animation: slideInRight 0.5s ease-out forwards;
            opacity: 0;
            animation-delay: calc(var(--delay, 0) * 0.1s);
          }
          
          .form-section:nth-child(1) { --delay: 1; }
          .form-section:nth-child(2) { --delay: 2; }
          .form-section:nth-child(3) { --delay: 3; }
          .form-section:nth-child(4) { --delay: 4; }
          .form-section:nth-child(5) { --delay: 5; }
          .form-section:nth-child(6) { --delay: 6; }
          
          .input-group {
            position: relative;
            margin-bottom: 20px;
          }
          
          .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #4a5568;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          
          .input-group .form-input {
            width: 100%;
            padding: 12px 15px 12px 45px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.3s ease;
            background-color: #f8fafc;
            color: #2d3748;
          }
          
          .input-group .form-input:focus {
            border-color: #4776E6;
            box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.2);
            background-color: #fff;
            outline: none;
          }
          
          .input-group:hover label {
            color: #4776E6;
          }
          
          .input-icon {
            position: absolute;
            left: 15px;
            top: 38px;
            font-size: 18px;
            color: #a0aec0;
            transition: all 0.3s ease;
          }
          
          .input-group:focus-within .input-icon {
            color: #4776E6;
            transform: scale(1.1);
          }
          
          .file-input-container {
            position: relative;
            overflow: hidden;
            padding: 10px 15px;
            background: #f0f4ff;
            border-radius: 10px;
            border: 2px dashed #c7d2fe;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .file-input-container:hover {
            background: #e6ebfe;
            border-color: #818cf8;
          }
          
          .file-input-container input[type="file"] {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          
          .file-input-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          
          .file-icon {
            font-size: 30px;
            color: #4776E6;
          }
          
          .file-text {
            font-size: 14px;
            color: #4b5563;
          }
          
          .file-name {
            margin-top: 10px;
            font-size: 14px;
            color: #4776E6;
            font-weight: 600;
          }
          
          .select-container {
            position: relative;
          }
          
          .fancy-select {
            width: 100%;
            min-height: 100px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px;
            background-color: #f8fafc;
            font-size: 15px;
            transition: all 0.3s ease;
            color: #2d3748;
          }
          
          .fancy-select:focus {
            border-color: #4776E6;
            box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.2);
            background-color: #fff;
            outline: none;
          }
          
          .preference-counter {
            position: absolute;
            right: 10px;
            bottom: 10px;
            background: #4776E6;
            color: white;
            font-size: 12px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 20px;
            opacity: 0.9;
          }
          
          .alert {
            margin: 20px 0;
            padding: 15px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: fadeIn 0.5s ease-out forwards;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          }
          
          .alert-success {
            background: linear-gradient(to right, #84fab0 0%, #8fd3f4 100%);
            color: #1a5045;
            border-left: 5px solid #2ecc71;
          }
          
          .alert-danger {
            background: linear-gradient(to right, #ff9a9e 0%, #fad0c4 100%);
            color: #943838;
            border-left: 5px solid #e74c3c;
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          
          .alert-icon {
            font-size: 24px;
            min-width: 24px;
          }
          
          .alert-text {
            flex-grow: 1;
            font-weight: 500;
          }
          
          .form-actions {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding-top: 10px;
            margin-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          
          .btn {
            padding: 12px 25px;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            border: none;
            font-size: 16px;
            min-width: 150px;
            justify-content: center;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(71, 118, 230, 0.3);
          }
          
          .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(71, 118, 230, 0.4);
          }
          
          .btn-primary:active {
            transform: translateY(1px);
          }
          
          .btn-secondary {
            background: #f8fafc;
            color: #4b5563;
            border: 2px solid #e2e8f0;
          }
          
          .btn-secondary:hover {
            background: #f1f5f9;
            color: #3b82f6;
            transform: translateY(-3px);
          }
          
          .btn-icon {
            transition: all 0.3s ease;
          }
          
          .btn:hover .btn-icon {
            transform: translateX(5px);
          }
          
          .btn-secondary:hover .btn-icon {
            transform: translateX(-5px);
          }
          
          .loader-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          }
          
          .fancy-loader {
            position: relative;
            width: 100px;
            height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .loader-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
            position: absolute;
          }
          
          .loader-line-mask {
            position: absolute;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            transform-origin: center;
            animation: rotate 1.5s linear infinite;
            mask: radial-gradient(transparent 31px, black 32px);
            -webkit-mask: radial-gradient(transparent 31px, black 32px);
          }
          
          .loader-line {
            width: 150%;
            height: 150%;
            border-radius: 50%;
            position: absolute;
            top: -25%;
            left: -25%;
            background: white;
          }
          
          .loader-text {
            position: absolute;
            bottom: -30px;
            color: #4776E6;
            font-weight: 600;
            letter-spacing: 1px;
            animation: pulse 1.5s infinite ease-in-out;
          }
          
          /* Submit loading spinner */
          .spin-icon {
            animation: rotate 1s linear infinite;
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .form-body {
              padding: 20px;
            }
            
            .form-header {
              padding: 20px;
            }
            
            .form-actions {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
            }
          }
        `}
      </style>
      
      <div className="form-container">
        <div className="form-header">
          <h2>Modifier mon profil</h2>
          <p>Mettez à jour vos informations professionnelles</p>
        </div>
        
        <div className="form-body">
          {error && (
            <div className="alert alert-danger">
              <FaExclamationTriangle className="alert-icon" />
              <span className="alert-text">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <FaCheck className="alert-icon" />
              <span className="alert-text">{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="input-group">
                <label htmlFor="name">Nom</label>
                <FaUser className="input-icon" />
                <input
                  id="name"
                  name="name"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Votre adresse email"
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <div className="input-group">
                <label htmlFor="titre_diplome">Titre du diplôme</label>
                <FaGraduationCap className="input-icon" />
                <input
                  id="titre_diplome"
                  name="titre_diplome"
                  className="form-input"
                  value={form.titre_diplome}
                  onChange={handleChange}
                  placeholder="Ex: Master en Informatique"
                />
              </div>
            </div>
            
            <div className="form-section">
              <div className="input-group">
                <label htmlFor="portfolio_link">Portfolio</label>
                <FaGlobe className="input-icon" />
                <input
                  id="portfolio_link"
                  name="portfolio_link"
                  className="form-input"
                  value={form.portfolio_link}
                  onChange={handleChange}
                  placeholder="https://votre-portfolio.com"
                />
              </div>
            </div>
            
            <div className="form-section">
              <div className="input-group">
                <label>Changer le CV</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setCv(e.target.files[0])}
                  />
                  <div className="file-input-content">
                    <FaFile className="file-icon" />
                    <span className="file-text">Glissez votre CV ici ou cliquez pour sélectionner</span>
                    {cv && <span className="file-name">{cv.name}</span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="input-group">
                <label>Préférences (3 à 6)</label>
                <div className="select-container">
                  <select
                    multiple
                    className="fancy-select"
                    value={form.preferences}
                    onChange={handlePrefChange}
                  >
                    {allPreferences.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                  <div className="preference-counter">
                    {form.preferences.length} sélectionnée(s)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <svg className="spin-icon" width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="8" />
                    </svg>
                    Traitement...
                  </>
                ) : (
                  <>
                    <FaSave className="btn-icon" /> Enregistrer
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="btn btn-secondary"
                title="Retour à la page de profil"
                onClick={() => navigate('/profilcandidat')}
              >
                <FaArrowLeft className="btn-icon" /> Retour au profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierProfil;