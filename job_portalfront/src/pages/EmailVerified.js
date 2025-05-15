import React, { useState, useEffect } from "react";

function EmailVerification() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    
    // Simuler un email envoyé (juste pour la démo)
    const timer = setTimeout(() => {
      setShowCheckmark(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="verification-container">
      <div className={`animation-wrapper ${isAnimating ? "animated" : ""}`}>
        <div className="verification-card">
          {/* En-tête */}
          <div className="card-header">
            <div className="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>
          
          {/* Contenu */}
          <div className="card-content">
            <h2>Vérifiez votre adresse email</h2>
            
            <div className="alert-box">
              <p>Un email de vérification a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l'email pour confirmer votre identité.</p>
            </div>
            
            {/* Animation d'enveloppe */}
            <div className="animation-container">
              <div className={`mail-icon ${showCheckmark ? "hidden" : "bouncing"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              
              <div className={`check-icon ${showCheckmark ? "pulsing" : "hidden"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="instructions">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <p>Vérifiez votre boîte de réception pour notre email</p>
              </div>
              
              <div className="instruction-step">
                <div className="step-number">2</div>
                <p>Cliquez sur le lien de vérification dans l'email</p>
              </div>
              
              <div className="instruction-step">
                <div className="step-number">3</div>
                <p>Accédez à votre compte une fois vérifié</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="actions">
              <button className="primary-button">
                Renvoyer l'email
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              
              <button className="secondary-button">
                Revenir à l'accueil
              </button>
            </div>
          </div>
          
          {/* Pied de page */}
          <div className="card-footer">
            <p>Si vous n'avez pas reçu d'email, vérifiez votre dossier spam.</p>
          </div>
        </div>
      </div>

      {/* CSS intégré */}
      <style jsx>{`
        .verification-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%);
          padding: 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .animation-wrapper {
          transform: translateY(10px);
          opacity: 0;
          transition: all 0.7s ease-out;
        }

        .animation-wrapper.animated {
          transform: translateY(0);
          opacity: 1;
        }

        .verification-card {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          max-width: 28rem;
          width: 100%;
          border: 1px solid rgba(104, 117, 245, 0.2);
        }

        .card-header {
          background-color: #4f46e5;
          padding: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .icon-wrapper {
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          padding: 1rem;
          color: white;
        }

        .card-content {
          padding: 1.5rem;
          padding-top: 2rem;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .alert-box {
          background-color: #eef2ff;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .alert-box p {
          color: #4338ca;
          text-align: center;
          margin: 0;
        }

        .animation-container {
          display: flex;
          justify-content: center;
          position: relative;
          height: 80px;
          margin: 2rem 0;
        }

        .mail-icon, .check-icon {
          position: absolute;
          transition: all 1s ease;
        }

        .mail-icon {
          color: #4f46e5;
        }

        .check-icon {
          color: #10b981;
        }

        .mail-icon.bouncing {
          animation: bounce 2s infinite;
        }

        .check-icon.pulsing {
          animation: pulse 2s infinite;
        }

        .hidden {
          transform: scale(0);
          opacity: 0;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .instructions {
          margin-bottom: 1.5rem;
        }

        .instruction-step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .step-number {
          background-color: #eef2ff;
          color: #4f46e5;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
          margin-right: 0.75rem;
          margin-top: 2px;
        }

        .instruction-step p {
          color: #4b5563;
          margin: 0;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .primary-button {
          background-color: #4f46e5;
          color: white;
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .primary-button:hover {
          background-color: #4338ca;
        }

        .arrow-icon {
          margin-left: 0.5rem;
        }

        .secondary-button {
          background-color: transparent;
          color: #4b5563;
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .secondary-button:hover {
          background-color: #f9fafb;
        }

        .card-footer {
          background-color: #f9fafb;
          padding: 1rem;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }

        .card-footer p {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default EmailVerification;