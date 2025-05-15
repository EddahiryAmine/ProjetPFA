import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "./AuthContext";

function Login() {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'candidat',
  });
const { login } = useAuth();
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
    setIsLoading(true);
    try {
      const res = await axios.post('/api/login', form);
login(res.data.user, res.data.access_token);
      const { role, profile_completed } = res.data.user;

      if (role === 'candidat') {
        if (!profile_completed) {
          navigate('/complete-profile');
        } else {
          navigate('/candidathome');
        }
      } else if (role === 'employeur') {
        navigate('/employeur');
      }      setIsLoading(false);
    } catch (error) {
      console.error(error.response.data);
      setErrorMessage("Identifiants incorrects. Veuillez réessayer.");
      setIsLoading(false);
      setTimeout(() => setErrorMessage(""), 3000);
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
                {/* Formulaire de connexion - plus compact */}
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
                        <p className="text-muted small animate-slide-up-delay">Connexion à votre espace</p>
                      </div>
                      
                      {/* Message de vérification */}
                      {verifiedMessage && (
                        <div className="alert alert-success mb-3 p-2 animate-pulse" role="alert">
                          <small>{verifiedMessage}</small>
                          <button type="button" className="btn-close float-end p-2" onClick={() => setVerifiedMessage("")}></button>
                        </div>
                      )}
                      
                      {/* Message d'erreur */}
                      {errorMessage && (
                        <div className="alert alert-danger mb-3 p-2 animate-shake" role="alert">
                          <small><i className="bi bi-exclamation-triangle me-2"></i>{errorMessage}</small>
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit}>
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
                        
                        {/* Se souvenir et mot de passe oublié */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="rememberMe"
                              style={{ borderColor: "#adb5bd" }}
                            />
                            <label className="form-check-label small" htmlFor="rememberMe">
                              Se souvenir de moi
                            </label>
                          </div>
                          <a href="#" className="text-primary small text-decoration-none">Mot de passe oublié?</a>
                        </div>
                        
                        {/* Bouton de connexion - Animé */}
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
                                Se connecter <i className="bi bi-arrow-right-circle ms-1"></i>
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
                        
                        {/* Lien d'inscription */}
                        <div className="text-center mt-3">
                          <small className="text-muted">
                            Pas encore de compte ?{" "}
                            <Link to="/register" className="text-primary text-decoration-none fw-bold">
                              Créer un compte
                            </Link>
                          </small>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 d-none d-md-block">
                  <div className="h-100 position-relative" style={{
                    background: "linear-gradient(135deg, #0d6efd, #0143a3)",
                    overflow: "hidden"
                  }}>
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                    
                    <div className="position-relative h-100 d-flex flex-column justify-content-center p-4 text-white">
                      <div className="mb-4 slide-up-stagger">
                        <h2 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>JobPortal</h2>
                        <p className="mb-0 lead" style={{ fontSize: "1rem" }}>Votre passerelle vers l'emploi</p>
                      </div>
                      
                      <div className="slide-up-stagger delay-1">
                        <div className="d-flex align-items-center mb-3">
                          <div className="feature-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary" style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem"
                          }}>
                            <i className="bi bi-search"></i>
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>Trouvez des opportunités</div>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="feature-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary" style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem"
                          }}>
                            <i className="bi bi-people"></i>
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>Connectez avec des recruteurs</div>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <div className="feature-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary" style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem"
                          }}>
                            <i className="bi bi-graph-up"></i>
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>Suivez votre progression</div>
                        </div>
                      </div>
                      
                      <div className="position-absolute bottom-0 end-0 me-3 mb-3 floating-icon">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6H4V18H20V6Z" fill="white" fillOpacity="0.2" />
                          <path d="M20 6H4V18H20V6Z" stroke="white" strokeWidth="1.5" />
                          <path d="M3 9H21" stroke="white" strokeWidth="1.5" />
                          <path d="M7 3V6" stroke="white" strokeWidth="1.5" />
                          <path d="M17 3V6" stroke="white" strokeWidth="1.5" />
                          <path d="M12 12L8 16" stroke="white" strokeWidth="1.5" />
                          <path d="M12 12L16 16" stroke="white" strokeWidth="1.5" />
                          <path d="M12 12V16" stroke="white" strokeWidth="1.5" />
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
          
          /* Animation du bouton de connexion */
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

export default Login;