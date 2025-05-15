import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const [titreDiplome, setTitreDiplome] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [cv, setCv] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [error, setError] = useState('');
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [cvName, setCvName] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    let isMounted = true;

    // Animation d'entrée
    setTimeout(() => {
      const form = document.querySelector('.profile-form-container');
      if (form) form.classList.add('visible');
    }, 300);

    const fetchPreferences = async () => {
      if (!token) {
        setError("Utilisateur non authentifié.");
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/preferences', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const prefs = res.data?.data;

        if (Array.isArray(prefs) && prefs.length > 0) {
          if (isMounted) setPreferences(prefs);
        } else {
          if (isMounted) setError("Aucune préférence disponible.");
        }
      } catch (err) {
        console.error("Erreur chargement préférences :", err.response || err.message);
        if (isMounted) setError("Erreur lors du chargement des préférences.");
      } finally {
        if (isMounted) setLoadingPrefs(false);
      }
    };

    fetchPreferences();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    if (!cv) {
      setError("Veuillez téléverser un CV.");
      return;
    }

    if (selectedPrefs.length < 3 || selectedPrefs.length > 6) {
      setError('Veuillez sélectionner entre 3 et 6 préférences.');
      return;
    }

    const form = new FormData();
    form.append('titre_diplome', titreDiplome);
    form.append('portfolio_link', portfolio);
    form.append('cv', cv);
    selectedPrefs.forEach(id => form.append('preferences[]', Number(id)));

    try {
      // Animation de chargement
      document.querySelector('.submit-btn').classList.add('loading');
      
      await axios.post('http://localhost:8000/api/candidat/complete-profile', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Animation de succès
      document.querySelector('.submit-btn').classList.remove('loading');
      document.querySelector('.submit-btn').classList.add('success');
      
      setTimeout(() => {
        showSuccessNotification();
        setTimeout(() => {
          navigate("/candidathome");
        }, 1500);
      }, 1000);

    } catch (err) {
      document.querySelector('.submit-btn').classList.remove('loading');
      console.error("Erreur lors de la soumission :", err.response || err.message);
      setError(err.response?.data?.message || "Erreur lors de la soumission.");
    }
  };

  const showSuccessNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = '<div class="checkmark-circle"><div class="checkmark draw"></div></div><p>Profil complété avec succès!</p>';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  const handleIgnore = () => {
    // Animation de sortie
    const form = document.querySelector('.profile-form-container');
    form.classList.add('exit');
    
    setTimeout(() => {
      setShowAlert(false);
      setTimeout(() => {
        navigate("/candidathome");
      }, 300);
    }, 500);
  };
  
  const nextStep = () => {
    const currentStep = document.querySelector(`.step-${formStep}`);
    if (currentStep) currentStep.classList.add('slide-out');
    
    setTimeout(() => {
      setFormStep(formStep + 1);
      setTimeout(() => {
        const nextStep = document.querySelector(`.step-${formStep + 1}`);
        if (nextStep) nextStep.classList.add('slide-in');
      }, 100);
    }, 300);
  };
  
  const prevStep = () => {
    const currentStep = document.querySelector(`.step-${formStep}`);
    if (currentStep) currentStep.classList.add('slide-reverse');
    
    setTimeout(() => {
      setFormStep(formStep - 1);
      setTimeout(() => {
        const prevStep = document.querySelector(`.step-${formStep - 1}`);
        if (prevStep) prevStep.classList.add('slide-in-reverse');
      }, 100);
    }, 300);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCv(file);
      setCvName(file.name);
    }
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="profile-completion-overlay">
      <div className="profile-form-container">
        <div className="alert-header">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="alert-title">
            <h2>Complétez votre profil</h2>
            <p>Pour profiter pleinement de toutes les fonctionnalités de JobPortal</p>
          </div>
          <button className="close-btn" onClick={handleIgnore}>×</button>
        </div>

        {error && <div className="error-message"><span>⚠️</span>{error}</div>}
        {loadingPrefs && <div className="loading-spinner"><div></div><div></div><div></div><div></div></div>}

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(formStep / 3) * 100}%` }}></div>
          </div>
          <div className="step-indicators">
            <div className={`step-indicator ${formStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-indicator ${formStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-indicator ${formStep >= 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`form-step step-1 ${formStep === 1 ? 'active' : ''}`}>
            <h3>Votre formation</h3>
            <p>Parlez-nous de votre parcours académique</p>
            
            <div className="form-floating mb-3">
              <input
                type="text"
                id="diplomeTitre"
                className="form-control custom-input"
                value={titreDiplome}
                onChange={e => setTitreDiplome(e.target.value)}
                placeholder="Exemple: Master en informatique"
                required
              />
              <label htmlFor="diplomeTitre">Titre du diplôme</label>
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
            </div>
            
            <div className="btn-group">
              <button type="button" className="btn btn-skip" onClick={handleIgnore}>Faire plus tard</button>
              <button type="button" className="btn btn-next" onClick={nextStep}>Suivant</button>
            </div>
          </div>

          <div className={`form-step step-2 ${formStep === 2 ? 'active' : ''}`}>
            <h3>Vos compétences</h3>
            <p>Montrez vos réalisations et vos domaines d'expertise</p>
            
            <div className="form-floating mb-3">
              <input
                type="url"
                id="portfolioLink"
                className="form-control custom-input"
                value={portfolio}
                onChange={e => setPortfolio(e.target.value)}
                placeholder="https://monportfolio.com"
              />
              <label htmlFor="portfolioLink">Lien vers votre portfolio (facultatif)</label>
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
            </div>
            
            <div className="file-upload-container">
              <label htmlFor="cvFile" className="file-upload-label">
                <div className="file-upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="file-upload-text">
                  {cvName ? cvName : "Téléverser votre CV"}
                  <span className="file-format">PDF, DOC ou DOCX</span>
                </div>
              </label>
              <input
                type="file"
                id="cvFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
            </div>
            
            <div className="btn-group">
              <button type="button" className="btn btn-back" onClick={prevStep}>Retour</button>
              <button type="button" className="btn btn-next" onClick={nextStep}>Suivant</button>
            </div>
          </div>

          <div className={`form-step step-3 ${formStep === 3 ? 'active' : ''}`}>
            <h3>Vos préférences</h3>
            <p>Sélectionnez entre 3 et 6 domaines qui vous intéressent</p>
            
            <div className="preferences-container">
              {preferences.map(pref => (
                <label key={pref.id} className={`preference-item ${selectedPrefs.includes(pref.id) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    value={pref.id}
                    checked={selectedPrefs.includes(pref.id)}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSelectedPrefs(prev => 
                        prev.includes(val) 
                          ? prev.filter(id => id !== val)
                          : [...prev, val]
                      );
                    }}
                  />
                  <span>{pref.nom}</span>
                </label>
              ))}
            </div>
            <div className="preferences-counter">
              {selectedPrefs.length} sur {preferences.length} sélectionnés 
              <span className={selectedPrefs.length >= 3 && selectedPrefs.length <= 6 ? 'valid' : 'invalid'}>
                (3-6 requis)
              </span>
            </div>
            
            <div className="btn-group">
              <button type="button" className="btn btn-back" onClick={prevStep}>Retour</button>
              <button type="submit" className="btn submit-btn">
                <span className="btn-text">Terminer</span>
                <span className="btn-loader"></span>
                <span className="btn-check">✓</span>
              </button>
            </div>
          </div>
        </form>

        <div className="benefits-section">
          <h4>En complétant votre profil, vous pourrez :</h4>
          <ul className="benefits-list">
            <li>
              <div className="benefit-icon">🔍</div>
              <div className="benefit-text">Recevoir des offres d'emploi personnalisées</div>
            </li>
            <li>
              <div className="benefit-icon">🚀</div>
              <div className="benefit-text">Postuler en un clic aux offres qui vous correspondent</div>
            </li>
            <li>
              <div className="benefit-icon">📊</div>
              <div className="benefit-text">Suivre l'état de vos candidatures</div>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        /* CSS pour les animations et le style moderne */
        :root {
          --primary: #0066CC;
          --primary-light: #4D94FF;
          --primary-dark: #0052A3;
          --white: #FFFFFF;
          --light-gray: #F5F7FA;
          --mid-gray: #E0E7F1;
          --dark-gray: #6B7C93;
          --success: #10B981;
          --error: #EF4444;
          --warning: #F59E0B;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
          --shadow-lg: 0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05);
          --shadow-hover: 0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.10);
          --transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        }

        /* Overlay et conteneur principal */
        .profile-completion-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          overflow-y: auto;
          padding: 2rem 1rem;
        }

        .profile-form-container {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 800px;
          padding: 0;
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: var(--transition);
          overflow: hidden;
        }

        .profile-form-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .profile-form-container.exit {
          opacity: 0;
          transform: translateY(-20px);
        }

        /* En-tête alerte */
        .alert-header {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          display: flex;
          padding: 1.5rem;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          position: relative;
        }

        .alert-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255,255,255,0.2);
          border-radius: 50%;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .alert-icon svg {
          width: 28px;
          height: 28px;
          stroke: var(--white);
        }

        .alert-title {
          flex-grow: 1;
        }

        .alert-title h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .alert-title p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.95rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--white);
          font-size: 1.8rem;
          line-height: 1;
          cursor: pointer;
          opacity: 0.7;
          transition: var(--transition);
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .close-btn:hover {
          opacity: 1;
          background-color: rgba(255,255,255,0.1);
        }

        /* Messages d'erreur et chargement */
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border-left: 4px solid var(--error);
          padding: 0.75rem 1rem;
          margin: 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        .error-message span {
          margin-right: 0.5rem;
        }

        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .loading-spinner div {
          width: 12px;
          height: 12px;
          background-color: var(--primary);
          border-radius: 100%;
          display: inline-block;
          margin: 0 6px;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-spinner div:nth-child(1) { animation-delay: -0.32s; }
        .loading-spinner div:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        /* Formulaire et étapes */
        form {
          padding: 0 1.5rem;
        }

        .form-step {
          display: none;
          opacity: 0;
          transition: var(--transition);
          padding: 1.5rem 0;
        }

        .form-step.active {
          display: block;
          opacity: 1;
          animation: fadeIn 0.5s forwards;
        }

        .form-step.slide-out {
          animation: slideOut 0.3s forwards;
        }

        .form-step.slide-reverse {
          animation: slideOutReverse 0.3s forwards;
        }

        .form-step.slide-in {
          animation: slideIn 0.3s forwards;
        }

        .form-step.slide-in-reverse {
          animation: slideInReverse 0.3s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-50px); opacity: 0; }
        }

        @keyframes slideOutReverse {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(50px); opacity: 0; }
        }

        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInReverse {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .form-step h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--primary-dark);
        }

        .form-step p {
          color: var(--dark-gray);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        /* Barre de progression */
        .progress-bar-container {
          padding: 1.5rem 1.5rem 0;
        }

        .progress-bar {
          height: 6px;
          background-color: var(--mid-gray);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-bar .progress {
          height: 100%;
          background: linear-gradient(to right, var(--primary-light), var(--primary));
          border-radius: 3px;
          transition: width 0.4s ease;
        }

        .step-indicators {
          display: flex;
          justify-content: space-between;
          padding: 0 10%;
        }

        .step-indicator {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: var(--mid-gray);
          color: var(--dark-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .step-indicator.active {
          background-color: var(--primary);
          color: var(--white);
          box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.2);
        }

        /* Champs de formulaire */
        .form-floating {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .custom-input {
          height: 56px;
          padding: 1rem 1rem 0.5rem 3rem;
          font-size: 1rem;
          border: 2px solid var(--mid-gray);
          border-radius: 8px;
          transition: var(--transition);
          width: 100%;
          background-color: var(--white);
        }

        .custom-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
          outline: none;
        }

        .form-floating label {
          position: absolute;
          top: 0;
          left: 3rem;
          height: 100%;
          padding: 1rem 0.75rem;
          pointer-events: none;
          border: none;
          transform-origin: 0 0;
          transition: var(--transition);
          color: var(--dark-gray);
          font-size: 1rem;
        }

        .custom-input:focus ~ label,
        .custom-input:not(:placeholder-shown) ~ label {
          transform: scale(0.85) translateY(-0.5rem);
          color: var(--primary);
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: var(--dark-gray);
          transition: var(--transition);
        }

        .custom-input:focus ~ .input-icon {
          color: var(--primary);
        }

        /* Upload de fichier */
        .file-upload-container {
          margin-bottom: 1.5rem;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 2px dashed var(--mid-gray);
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition);
        }

        .file-upload-label:hover {
          border-color: var(--primary-light);
          background-color: rgba(0, 102, 204, 0.03);
        }

        input[type="file"] {
          position: absolute;
          left: -9999px;
        }

        .file-upload-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(0, 102, 204, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          color: var(--primary);
          flex-shrink: 0;
        }

        .file-upload-icon svg {
          width: 20px;
          height: 20px;
          stroke: var(--primary);
        }

        .file-upload-text {
          flex-grow: 1;
          font-weight: 500;
          display: flex;
          flex-direction: column;
        }

        .file-format {
          font-size: 0.8rem;
          color: var(--dark-gray);
          margin-top: 0.25rem;
        }

        /* Préférences */
        .preferences-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .preference-item {
          padding: 0.75rem;
          border-radius: 6px;
          border: 2px solid var(--mid-gray);
          background-color: var(--white);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }

        .preference-item input {
          position: absolute;
          opacity: 0;
        }

        .preference-item:hover {
          border-color: var(--primary-light);
        }

        .preference-item.selected {
          border-color: var(--primary);
          background-color: rgba(0, 102, 204, 0.05);
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .preference-item.selected:before {
          content: "✓";
          margin-right: 0.5rem;
          color: var(--primary);
          font-weight: bold;
        }

        .preferences-counter {
          text-align: right;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          color: var(--dark-gray);
        }

        .preferences-counter .valid {
          color: var(--success);
          font-weight: 500;
        }

        .preferences-counter .invalid {
          color: var(--error);
          font-weight: 500;
        }

        /* Boutons */
        .btn-group {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          transition: var(--transition);
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-next, .submit-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          min-width: 120px;
        }

        .btn-next:hover, .submit-btn:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        .btn-back {
          background-color: var(--light-gray);
          color: var(--dark-gray);
          border: 1px solid var(--mid-gray);
        }

        .btn-back:hover {
          background-color: var(--mid-gray);
        }

        .btn-skip {
          background: none;
          color: var(--dark-gray);
          text-decoration: underline;
          padding: 0.75rem;
        }

        .btn-skip:hover {
          color: var(--primary-dark);
        }

        .submit-btn {
          position: relative;
        }

        .submit-btn .btn-text {
          opacity: 1;
          transition: var(--transition);
        }

        .submit-btn .btn-loader {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: var(--white);
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
        }

        .submit-btn .btn-check {
          position: absolute;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
        }

        .submit-btn.loading .btn-text {
          opacity: 0;
          visibility: hidden;
        }

        .submit-btn.loading .btn-loader {
          opacity: 1;
          visibility: visible;
          animation: spin 1s infinite linear;
        }

        .submit-btn.success .btn-text,
        .submit-btn.success .btn-loader {
          opacity: 0;
          visibility: hidden;
        }

        .submit-btn.success .btn-check {
          opacity: 1;
          visibility: visible;
          animation: pop 0.3s forwards;
        }

        .submit-btn.success {
          background: linear-gradient(135deg, var(--success), #0D946B);
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @keyframes pop {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* Section des avantages */
        .benefits-section {
          background-color: var(--light-gray);
          padding: 1.5rem;
          border-top: 1px solid var(--mid-gray);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .benefits-section h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--primary-dark);
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          animation: fadeInRight 0.5s forwards;
          animation-delay: calc(0.1s * var(--i));
          opacity: 0;
        }

        .benefits-list li:nth-child(1) { --i: 1; }
        .benefits-list li:nth-child(2) { --i: 2; }
        .benefits-list li:nth-child(3) { --i: 3; }

        @keyframes fadeInRight {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .benefit-icon {
          width: 32px;
          height: 32px;
          background-color: rgba(0, 102, 204, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.2rem;
        }

        .benefit-text {
          flex-grow: 1;
          font-size: 0.9rem;
        }

        /* Notification de succès */
        .success-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: var(--white);
          border-left: 4px solid var(--success);
          padding: 1rem;
          border-radius: 8px;
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          transform: translateX(120%);
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          z-index: 2000;
        }

        .success-notification.show {
          transform: translateX(0);
        }

        .checkmark-circle {
          width: 32px;
          height: 32px;
          position: relative;
          background: var(--success);
          border-radius: 50%;
          margin-right: 1rem;
        }

        .checkmark {
          width: 12px;
          height: 22px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          border-bottom: 3px solid white;
          border-right: 3px solid white;
        }

        .checkmark.draw {
          animation: drawCheck 0.5s forwards;
        }

        @keyframes drawCheck {
          0% { height: 0; width: 0; opacity: 1; }
          20% { height: 0; width: 12px; opacity: 1; }
          40% { height: 22px; width: 12px; opacity: 1; }
          100% { height: 22px; width: 12px; opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-form-container {
            max-width: 100%;
            border-radius: 0;
            min-height: 100vh;
          }
          
          .alert-header {
            border-radius: 0;
          }
          
          .preferences-container {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .btn-group {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CompleteProfile;