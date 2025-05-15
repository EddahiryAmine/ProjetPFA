import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarEmployeur from './NavbarEmployeur';

// Vous pouvez utiliser ces icônes en installant: npm install react-icons
import { FaBuilding, FaFileAlt, FaMapMarkerAlt, FaSave, FaMoon, FaSun } from 'react-icons/fa';

const ProfileCompletion = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [adresse, setAdresse] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formAnimation, setFormAnimation] = useState(false);
  const navigate = useNavigate();
  
  // Animation au chargement de la page
  useEffect(() => {
    setFormAnimation(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/profil/employeur/ajouter-entreprise', {
        nom,
        description,
        adresse,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Animation de succès
      document.querySelector('.success-animation').classList.add('show');
      
      setTimeout(() => {
        alert('Entreprise créée avec succès !');
        navigate('/profil');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      alert('Une erreur s\'est produite, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Styles CSS intégrés
  const styles = {
    '@import': "url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap')",
    
    container: {
      display: 'flex',
      height: '100vh',
      background: darkMode ? 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      transition: 'background 0.3s ease',
      overflow: 'hidden',
    },
    
    content: {
      flex: 1,
      padding: '32px',
      background: darkMode ? 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      color: darkMode ? '#f3f4f6' : '#1e293b',
      transition: 'all 0.3s ease',
      overflowY: 'auto',

      
    },
    
    themeToggle: {
      position: 'absolute',
      top: '1.5rem',
      right: '2rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      backgroundColor: darkMode ? '#374151' : '#e5e7eb',
      color: darkMode ? '#f3f4f6' : '#4b5563',
    },
    
    themeToggleHover: {
      transform: 'rotate(15deg)',
    },
    
    icon: {
      fontSize: '1.2rem',
    },
    
    formContainer: {
      width: '100%',
      maxWidth: '750px',
      margin: '2rem auto',
      padding: '2.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      opacity: formAnimation ? 1 : 0,
      transform: formAnimation ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.5s ease',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    },
    
    formTitle: {
      fontSize: '1.8rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: '#0077b5', // Couleur bleue de LinkedIn
    },
    
    formSubtitle: {
      fontSize: '0.95rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '2rem',
    },
    
    profileForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      opacity: 0,
      transform: 'translateY(10px)',
      animation: 'fadeInUp 0.5s forwards',
    },
    
    formGroupFirst: {
      animationDelay: '0.2s',
    },
    
    formGroupSecond: {
      animationDelay: '0.4s',
    },
    
    formGroupThird: {
      animationDelay: '0.6s',
    },
    
    label: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      fontSize: '0.95rem',
      gap: '0.5rem',
    },
    
    inputIcon: {
      color: darkMode ? '#38bdf8' : '#0077b5',
    },
    
    formInput: {
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: '2px solid transparent',
      backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
      color: darkMode ? '#f3f4f6' : 'inherit',
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    
    formInputHover: {
      backgroundColor: darkMode ? '#263244' : '#f1f5f9',
    },
    
    formInputFocus: {
      outline: 'none',
      borderColor: darkMode ? '#38bdf8' : '#0077b5',
      boxShadow: darkMode ? '0 0 0 3px rgba(56, 189, 248, 0.25)' : '0 0 0 3px rgba(0, 119, 181, 0.2)',
    },
    
    formTextarea: {
      minHeight: '120px',
      resize: 'vertical',
    },
    
    submitBtn: {
      marginTop: '1rem',
      padding: '0.85rem 1.5rem',
      backgroundColor: darkMode ? '#38bdf8' : '#0077b5',
      color: darkMode ? '#0f172a' : 'white',
      border: 'none',
      borderRadius: '8px',
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      opacity: 0,
      transform: 'translateY(10px)',
      animation: 'fadeInUp 0.5s forwards',
      animationDelay: '0.8s',
    },
    
    submitBtnHover: {
      backgroundColor: darkMode ? '#0ea5e9' : '#005fa3',
      transform: 'translateY(-2px)',
      boxShadow: darkMode ? '0 4px 12px rgba(56, 189, 248, 0.4)' : '0 4px 12px rgba(0, 119, 181, 0.3)',
    },
    
    submitBtnActive: {
      transform: 'translateY(0)',
    },
    
    submitBtnLoading: {
      cursor: 'not-allowed',
      backgroundColor: darkMode ? '#475569' : '#94a3b8',
    },
    
    btnIcon: {
      fontSize: '1.1rem',
    },
    
    spinner: {
      width: '20px',
      height: '20px',
      border: darkMode ? '3px solid rgba(15, 23, 42, 0.3)' : '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTopColor: darkMode ? '#0f172a' : '#ffffff',
      animation: 'spin 1s linear infinite',
    },
    
    successAnimation: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      opacity: 0,
      zIndex: 999,
      transition: 'opacity 0.3s ease',
    },
    
    successAnimationShow: {
      opacity: 1,
    },
    
    '@keyframes fadeInUp': {
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      }
    },
    
    '@keyframes spin': {
      to: {
        transform: 'rotate(360deg)',
      }
    },
  };

  // CSS pour les animations SVG (ne peut pas être directement dans un objet styles en React)
  const svgStyles = `
    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: ${darkMode ? '#38bdf8' : '#0077b5'};
      stroke-miterlimit: 10;
      animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    }
    
    .checkmark-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    
    .checkmark-check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }
    
    @keyframes stroke {
      100% {
        stroke-dashoffset: 0;
      }
    }
    
    @keyframes scale {
      0%, 100% {
        transform: none;
      }
      50% {
        transform: scale3d(1.1, 1.1, 1);
      }
    }
    
    @keyframes fill {
      100% {
        box-shadow: inset 0px 0px 0px 30px rgba(0, 119, 181, 0.1);
      }
    }
  `;

  return (
    <div style={styles.container}>
      <NavbarEmployeur />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        ${svgStyles}
      `}} />
      
      <div style={styles.content}>

        <div 
          style={styles.themeToggle} 
          onClick={toggleDarkMode}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.themeToggleHover)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none'})}
        >
          {darkMode ? (
            <FaSun style={styles.icon} />
          ) : (
            <FaMoon style={styles.icon} />
          )}
        </div>
        
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Compléter votre profil entreprise</h2>
          <p style={styles.formSubtitle}>Ces informations apparaîtront sur votre profil professionnel</p>
          
          <form onSubmit={handleSubmit} style={styles.profileForm}>
            <div style={{...styles.formGroup, ...styles.formGroupFirst}}>
              <label htmlFor="nom" style={styles.label}>
                <FaBuilding style={styles.inputIcon} />
                <span>Nom de l'entreprise</span>
              </label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                placeholder="Ex: LinkedIn Corporation"
                style={styles.formInput}
                onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                onBlur={(e) => Object.assign(e.target.style, {outline: 'none', borderColor: 'transparent', boxShadow: 'none'})}
                onMouseOver={(e) => Object.assign(e.target.style, styles.formInputHover)}
                onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: darkMode ? '#1f2937' : '#f9fafb'})}
              />
            </div>
            
            <div style={{...styles.formGroup, ...styles.formGroupSecond}}>
              <label htmlFor="description" style={styles.label}>
                <FaFileAlt style={styles.inputIcon} />
                <span>Description de l'entreprise</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Décrivez votre entreprise, ses activités et sa mission..."
                style={{...styles.formInput, ...styles.formTextarea}}
                onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                onBlur={(e) => Object.assign(e.target.style, {outline: 'none', borderColor: 'transparent', boxShadow: 'none'})}
                onMouseOver={(e) => Object.assign(e.target.style, styles.formInputHover)}
                onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: darkMode ? '#1f2937' : '#f9fafb'})}
              ></textarea>
            </div>
            
            <div style={{...styles.formGroup, ...styles.formGroupThird}}>
              <label htmlFor="adresse" style={styles.label}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <span>Adresse complète</span>
              </label>
              <input
                type="text"
                id="adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                required
                placeholder="Ex: 123 rue de la Connexion, 75001 Paris"
                style={styles.formInput}
                onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                onBlur={(e) => Object.assign(e.target.style, {outline: 'none', borderColor: 'transparent', boxShadow: 'none'})}
                onMouseOver={(e) => Object.assign(e.target.style, styles.formInputHover)}
                onMouseOut={(e) => Object.assign(e.target.style, {backgroundColor: darkMode ? '#1f2937' : '#f9fafb'})}
              />
            </div>
            
            <button 
              type="submit" 
              style={isLoading ? {...styles.submitBtn, ...styles.submitBtnLoading} : styles.submitBtn}
              disabled={isLoading}
              onMouseOver={(e) => !isLoading && Object.assign(e.currentTarget.style, styles.submitBtnHover)}
              onMouseOut={(e) => !isLoading && Object.assign(e.currentTarget.style, {
                backgroundColor: darkMode ? '#38bdf8' : '#0077b5',
                transform: 'none',
                boxShadow: 'none'
              })}
              onMouseDown={(e) => !isLoading && Object.assign(e.currentTarget.style, styles.submitBtnActive)}
              onMouseUp={(e) => !isLoading && Object.assign(e.currentTarget.style, {transform: 'translateY(-2px)'})}
            >
              {isLoading ? (
                <div style={styles.spinner}></div>
              ) : (
                <>
                  <FaSave style={styles.btnIcon} /> Enregistrer le profil
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className={`success-animation ${isLoading ? 'show' : ''}`} style={styles.successAnimation}>
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;