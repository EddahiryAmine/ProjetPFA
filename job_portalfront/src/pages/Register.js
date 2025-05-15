import React, { useState, useEffect } from "react";
import axios from "../axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Register() {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'candidat',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await axios.post('/api/register', form);
      
      const token = res.data.access_token;
      localStorage.setItem('token', token);

      setMessage("✅ Compte créé ! Un email de vérification vous a été envoyé.");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/verify-email");
      }, 2500);

    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data);
      const errorMsg = error.response?.data?.message || "Une erreur s'est produite.";
      setMessage("❌ " + errorMsg);
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="login-container min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card-wrapper animate-fade-in shadow rounded-4 overflow-hidden" style={{
              maxWidth: "900px",
              margin: "0 auto"
            }}>
              <div className="row g-0">
                {/* Formulaire d'inscription - plus compact */}
                <div className="col-md-6">
                  <div className="card border-0">
                    <div className="card-body p-4">
                      {/* Logo animé */}
                      <div className="text-center mb-4">
                        <div className="logo-bounce mb-2">
                          <div className="logo-circle d-inline-flex align-items-center justify-content-center rounded-circle" style={{
                            width: "64px",
                            height: "64px",
                            background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
                            boxShadow: "0 8px 15px rgba(10, 88, 202, 0.3)"
                          }}>
                            <i className="bi bi-briefcase-fill text-white fs-3"></i>
                          </div>
                        </div>
                        <h3 className="mb-0 fw-bold animate-slide-up">JobPortal</h3>
                        <p className="text-muted small animate-slide-up-delay">Créez votre compte</p>
                      </div>
                      
                      {/* Message d'erreur ou de succès */}
                      {message && (
                        <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"} mb-3 p-2 ${message.startsWith("✅") ? "animate-pulse" : "animate-shake"}`} role="alert">
                          <small>{message}</small>
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit}>
                        {/* Nom - Style minimaliste */}
                        <div className="form-group input-animation mb-3">
                          <div className="input-with-icon">
                            <i className="bi bi-person text-primary position-absolute ms-3" style={{ top: "50%", transform: "translateY(-50%)" }}></i>
                            <input
                              type="text"
                              className="form-control bg-light border-0 ps-5"
                              name="name"
                              id="name"
                              placeholder="Votre nom"
                              value={form.name}
                              onChange={handleChange}
                              required
                              style={{
                                height: "48px",
                                borderRadius: "24px"
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Email - Style minimaliste */}
                        <div className="form-group input-animation mb-3">
                          <div className="input-with-icon">
                            <i className="bi bi-envelope text-primary position-absolute ms-3" style={{ top: "50%", transform: "translateY(-50%)" }}></i>
                            <input
                              type="email"
                              className="form-control bg-light border-0 ps-5"
                              name="email"
                              id="email"
                              placeholder="Adresse email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              style={{
                                height: "48px",
                                borderRadius: "24px"
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Mot de passe - Style minimaliste */}
                        <div className="form-group input-animation mb-3">
                          <div className="input-with-icon">
                            <i className="bi bi-shield-lock text-primary position-absolute ms-3" style={{ top: "50%", transform: "translateY(-50%)" }}></i>
                            <input
                              type="password"
                              className="form-control bg-light border-0 ps-5"
                              name="password"
                              id="password"
                              placeholder="Mot de passe"
                              value={form.password}
                              onChange={handleChange}
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={() => setPasswordFocused(false)}
                              required
                              style={{
                                height: "48px",
                                borderRadius: "24px"
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Confirmation mot de passe - Style minimaliste */}
                        <div className="form-group input-animation mb-3">
                          <div className="input-with-icon">
                            <i className="bi bi-shield-check text-primary position-absolute ms-3" style={{ top: "50%", transform: "translateY(-50%)" }}></i>
                            <input
                              type="password"
                              className="form-control bg-light border-0 ps-5"
                              name="password_confirmation"
                              id="password_confirmation"
                              placeholder="Confirmer le mot de passe"
                              value={form.password_confirmation}
                              onChange={handleChange}
                              required
                              style={{
                                height: "48px",
                                borderRadius: "24px"
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Sélecteur de rôle - Plus compact */}
                        <div className="form-group mb-3">
                          <div className="role-toggle-wrapper p-1 bg-light rounded-pill d-flex" style={{ border: "1px solid #e9ecef" }}>
                            <div className="role-option flex-grow-1">
                              <input
                                type="radio"
                                className="btn-check"
                                name="role"
                                id="role-candidat"
                                value="candidat"
                                checked={form.role === 'candidat'}
                                onChange={handleChange}
                              />
                              <label
                                className="btn btn-sm w-100 rounded-pill py-1"
                                htmlFor="role-candidat"
                                style={{
                                  fontSize: "0.85rem",
                                  transition: "all 0.3s ease",
                                  background: form.role === 'candidat' ? "linear-gradient(135deg, #0d6efd, #0a58ca)" : "transparent",
                                  color: form.role === 'candidat' ? "#fff" : "#495057"
                                }}
                              >
                                <i className={`bi bi-person-badge ${form.role === 'candidat' ? "me-1" : ""}`}></i>
                                {form.role === 'candidat' && "Candidat"}
                              </label>
                            </div>
                            <div className="role-option flex-grow-1">
                              <input
                                type="radio"
                                className="btn-check"
                                name="role"
                                id="role-employeur"
                                value="employeur"
                                checked={form.role === 'employeur'}
                                onChange={handleChange}
                              />
                              <label
                                className="btn btn-sm w-100 rounded-pill py-1"
                                htmlFor="role-employeur"
                                style={{
                                  fontSize: "0.85rem",
                                  transition: "all 0.3s ease",
                                  background: form.role === 'employeur' ? "linear-gradient(135deg, #0d6efd, #0a58ca)" : "transparent",
                                  color: form.role === 'employeur' ? "#fff" : "#495057"
                                }}
                              >
                                <i className={`bi bi-building ${form.role === 'employeur' ? "me-1" : ""}`}></i>
                                {form.role === 'employeur' && "Employeur"}
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Bouton d'inscription - Animé */}
                        <div className="form-group mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 rounded-pill py-2 btn-elevated"
                            disabled={isLoading}
                            style={{
                              background: "linear-gradient(135deg, #0d6efd, #0a58ca)",
                              border: "none",
                              boxShadow: "0 4px 10px rgba(13, 110, 253, 0.3)",
                            }}
                          >
                            {isLoading ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <>
                                S'inscrire <i className="bi bi-arrow-right-circle ms-1"></i>
                              </>
                            )}
                          </button>
                        </div>
                        
                        {/* Séparateur */}
                        <div className="separator d-flex align-items-center my-3">
                          <div className="line flex-grow-1"></div>
                          <span className="mx-2 text-muted small">ou</span>
                          <div className="line flex-grow-1"></div>
                        </div>
                        
                        {/* Boutons sociaux - Plus compacts */}
                        <div className="social-buttons d-flex justify-content-center gap-2 mb-3">
                          <button type="button" className="btn btn-sm btn-outline-light social-btn">
                            <i className="bi bi-google text-danger"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-light social-btn">
                            <i className="bi bi-facebook text-primary"></i>
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-light social-btn">
                            <i className="bi bi-linkedin text-info"></i>
                          </button>
                        </div>
                        
                        {/* Lien de connexion */}
                        <div className="text-center mt-3">
                          <small className="text-muted">
                            Vous avez déjà un compte ?{" "}
                            <Link to="/" className="text-primary text-decoration-none fw-bold page-transition">
                              Se connecter
                            </Link>
                          </small>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                {/* Partie droite - Image et présentation */}
                <div className="col-md-6 d-none d-md-block">
                  <div className="h-100 position-relative" style={{
                    background: "linear-gradient(135deg, #0d6efd, #0143a3)",
                    overflow: "hidden"
                  }}>
                    {/* Éléments décoratifs animés */}
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                    
                    <div className="position-relative h-100 d-flex flex-column justify-content-center p-4 text-white">
                      {/* Contenu de l'image de droite */}
                      <div className="mb-4 slide-up-stagger">
                        <h2 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>JobPortal</h2>
                        <p className="mb-0 lead" style={{ fontSize: "1rem" }}>Créez votre profil professionnel</p>
                      </div>
                      
                      <div className="slide-up-stagger delay-1">
                        <div className="d-flex align-items-center mb-3">
                          <div className="feature-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary" style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem"
                          }}>
                            <i className="bi bi-person-plus"></i>
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>Créez votre profil professionnel</div>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="feature-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary" style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem"
                          }}>
                            <i className="bi bi-briefcase"></i>
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>Accédez à des offres exclusives</div>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <div className="feature-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary" style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem"
                          }}>
                            <i className="bi bi-shield-check"></i>
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>100% gratuit et sécurisé</div>
                        </div>
                      </div>
                      
                      {/* Illustration animée */}
                      <div className="position-absolute bottom-0 end-0 me-3 mb-3 floating-icon">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="white" fillOpacity="0.2" />
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="white" strokeWidth="1.5" />
                          <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="white" strokeWidth="1.5" />
                          <path d="M20 21H4" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles et animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Animations et styles */
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* Animation du logo */
          .logo-bounce {
            animation: bounce 1s ease-in-out;
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
          
          /* Animation slide-up */
          .animate-slide-up {
            animation: slideUp 0.5s ease-out forwards;
          }
          
          .animate-slide-up-delay {
            animation: slideUp 0.5s ease-out 0.2s forwards;
            opacity: 0;
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Animation shake pour l'erreur */
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          
          @keyframes shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-3px); }
            40%, 60% { transform: translateX(3px); }
          }
          
          /* Animation pulse pour le message de succès */
          .animate-pulse {
            animation: pulse 1.5s infinite;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
            70% { box-shadow: 0 0 0 5px rgba(25, 135, 84, 0); }
            100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
          }
          
          /* Style pour les inputs */
          .input-animation input {
            transition: all 0.3s ease;
          }
          
          .input-animation input:focus {
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
            transform: translateY(-2px);
          }
          
          /* Style pour séparateur */
          .separator .line {
            height: 1px;
            background-color: #e9ecef;
          }
          
          /* Style pour boutons sociaux */
          .social-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
            background: white;
          }
          
          .social-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          }
          
          /* Animation du bouton d'inscription */
          .btn-elevated {
            transition: all 0.3s ease;
          }
          
          .btn-elevated:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(13, 110, 253, 0.4) !important;
          }
          
          .btn-elevated:active {
            transform: translateY(-1px);
          }
          
          /* Cercles décoratifs */
          .decoration-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            z-index: 1;
          }
          
          .circle-1 {
            width: 100px;
            height: 100px;
            top: 10%;
            left: -20px;
            animation: float 8s infinite ease-in-out;
          }
          
          .circle-2 {
            width: 150px;
            height: 150px;
            bottom: 10%;
            right: -50px;
            animation: float 12s infinite ease-in-out reverse;
          }
          
          .circle-3 {
            width: 60px;
            height: 60px;
            top: 50%;
            left: 50%;
            animation: float 10s infinite ease-in-out 2s;
          }
          
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, -15px); }
          }
          
          /* Animation pour la partie droite */
          .slide-up-stagger {
            animation: slideUp 0.6s ease-out forwards;
            opacity: 0;
          }
          
          .delay-1 {
            animation-delay: 0.3s;
          }
          
          /* Animation floating icon */
          .floating-icon {
            animation: floating 3s ease-in-out infinite;
          }
          
          @keyframes floating {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          /* Animation pour les transitions de page */
          .page-transition {
            position: relative;
            transition: all 0.3s ease;
          }
          
          .page-transition:hover {
            color: #0a58ca !important;
          }
          
          .page-transition:hover::after {
            width: 100%;
          }
          
          .page-transition::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: #0a58ca;
            transition: width 0.3s ease;
          }
        `
      }} />
      
      {/* Script pour activer les animations */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener("DOMContentLoaded", function() {
            // Réinitialiser les animations pour qu'elles commencent correctement
            const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-slide-up-delay, .slide-up-stagger');
            animatedElements.forEach(el => {
              el.style.opacity = '0';
            });
            
            // Démarrer les animations après un court délai
            setTimeout(() => {
              animatedElements.forEach((el, index) => {
                setTimeout(() => {
                  el.style.opacity = '1';
                }, index * 100);
              });
            }, 300);
          });
        `
      }} />
    </div>
  );
}

export default Register;