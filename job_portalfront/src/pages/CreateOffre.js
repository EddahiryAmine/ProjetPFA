import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import NavbarEmployeur from './NavbarEmployeur';

const OffreCreate = () => {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    salaire: '',
    localisation: '',
    dateExpiration: '',
    preferences: [],
  });
  const [darkMode, setDarkMode] = useState(false);
  const [allPreferences, setAllPreferences] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/employeur/preferences', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Réponse brute des préférences:", res.data);
        setAllPreferences(res.data);
      } catch (err) {
        console.error('Erreur:', err.response?.data || err.message);
      }
    };
    
    fetchPreferences();
    
    // Injecter les polices Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePrefChange = e => {
    const id = parseInt(e.target.value);
    const selected = [...form.preferences];
    
    if (selected.includes(id)) {
      setForm({ ...form, preferences: selected.filter(p => p !== id) });
    } else if (selected.length < 3) {
      setForm({ ...form, preferences: [...selected, id] });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8000/api/offres', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      
      // Animation et notification
      const notification = document.createElement('div');
      notification.className = 'success-notification';
      notification.textContent = "Offre créée avec succès !";
      notification.style = notificationStyles.success;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
        setForm({ titre: '', description: '', salaire: '', localisation: '', dateExpiration: '', preferences: [] });
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setIsSubmitting(false);
      
      // Notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.textContent = "Erreur lors de la création de l'offre";
      notification.style = notificationStyles.error;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  // Définition des styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      background: darkMode ? '#0f172a' : '#f8fafc',
      transition: 'background 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
    },
    content: {
      flex: 1,
      padding: '2rem',
      background: darkMode ? '#0f172a' : '#f8fafc',
      color: darkMode ? '#ffffff' : '#1e293b',
      transition: 'all 0.3s ease',
      overflow: 'auto',
    },
    offreContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 150, 0.1)',
      animation: 'fadeIn 0.5s ease',
    },
    offreTitle: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1e40af',
      marginBottom: '2rem',
      textAlign: 'center',
      position: 'relative',
    },
    titleAfter: {
      content: "''",
      position: 'absolute',
      left: '50%',
      bottom: '-10px',
      width: '50px',
      height: '4px',
      background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
      borderRadius: '2px',
      transform: 'translateX(-50%)',
    },
    offreForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      position: 'relative',
      marginBottom: '10px',
    },
    formRow: {
      display: 'flex',
      gap: '1.5rem',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '1rem',
      },
    },
    formGroupHalf: {
      flex: 1,
    },
    formInput: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#f0f9ff',
      color: '#1e293b',
      transition: 'all 0.3s ease',
      outline: 'none',
      fontFamily: "'Poppins', sans-serif",
    },
    formInputFocus: {
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.3)',
      backgroundColor: '#e0f2fe',
    },
    formLabel: {
      position: 'absolute',
      top: '12px',
      left: '15px',
      color: '#64748b',
      fontSize: '16px',
      pointerEvents: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent',
    },
    formLabelFocus: {
      top: '-10px',
      left: '10px',
      fontSize: '12px',
      color: '#2563eb',
      backgroundColor: '#ffffff',
      padding: '0 5px',
    },
    formLine: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 0,
      height: '2px',
      background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
      transition: 'all 0.3s ease',
    },
    formLineFocus: {
      width: '100%',
    },
    formTextarea: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#f0f9ff',
      color: '#1e293b',
      transition: 'all 0.3s ease',
      outline: 'none',
      fontFamily: "'Poppins', sans-serif",
      minHeight: '150px',
      resize: 'vertical',
    },
    formDate: {
      paddingTop: '14px',
      paddingBottom: '10px',
    },
    dateLabel: {
      top: '-10px',
      left: '10px',
      fontSize: '12px',
      color: '#2563eb',
      backgroundColor: '#ffffff',
      padding: '0 5px',
    },
    preferencesSection: {
      marginTop: '10px',
    },
    preferencesTitle: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#334155',
      marginBottom: '1rem',
    },
    preferencesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '12px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    preferenceItem: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    customCheckbox: {
      position: 'absolute',
      opacity: 0,
      cursor: 'pointer',
      height: 0,
      width: 0,
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      padding: '6px 0',
    },
    checkboxLabelDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    checkboxCustom: {
      position: 'relative',
      display: 'inline-block',
      width: '20px',
      height: '20px',
      backgroundColor: '#f0f9ff',
      border: '2px solid #cbd5e1',
      borderRadius: '4px',
      marginRight: '10px',
      transition: 'all 0.3s ease',
    },
    checkboxCustomChecked: {
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
    },
    checkboxCustomCheckedAfter: {
      content: "''",
      position: 'absolute',
      top: '2px',
      left: '6px',
      width: '5px',
      height: '10px',
      border: 'solid white',
      borderWidth: '0 2px 2px 0',
      transform: 'rotate(45deg)',
      animation: 'checkmark 0.2s ease-in-out',
    },
    checkboxText: {
      fontSize: '15px',
      color: '#334155',
    },
    noPreferences: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      color: '#64748b',
      fontStyle: 'italic',
    },
    formSubmit: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
    },
    submitButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 30px',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '180px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 7px 14px rgba(37, 99, 235, 0.25)',
    },
    submitButtonActive: {
      transform: 'translateY(1px)',
    },
    submitButtonSubmitting: {
      background: 'linear-gradient(135deg, #1e40af, #2563eb)',
      cursor: 'not-allowed',
    },
    spinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTopColor: '#fff',
      animation: 'spin 0.8s ease-in-out infinite',
    },
  };

  const notificationStyles = {
    base: `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `,
    success: `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: #10b981;
      color: white;
    `,
    error: `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: #ef4444;
      color: white;
    `,
  };

  // Style global à injecter dans la page
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes checkmark {
        0% {
          opacity: 0;
          transform: rotate(45deg) scale(0.5);
        }
        100% {
          opacity: 1;
          transform: rotate(45deg) scale(1);
        }
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      
      input, textarea, button {
        font-family: 'Poppins', sans-serif;
      }
      
      .hover-button:hover::before {
        left: 100%;
      }
      
      .hover-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: 0.5s;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      <NavbarEmployeur />
      <div style={styles.content}>
        <div style={styles.offreContainer}>
          <h2 style={styles.offreTitle}>
            Créer une Offre d'Emploi
            <span style={styles.titleAfter}></span>
          </h2>
          <form onSubmit={handleSubmit} style={styles.offreForm}>
            <div style={styles.formGroup}>
              <input 
                id="titre"
                name="titre" 
                value={form.titre} 
                onChange={handleChange}
                style={styles.formInput} 
                required 
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
                  e.target.style.backgroundColor = '#e0f2fe';
                  e.target.nextSibling.style.top = '-10px';
                  e.target.nextSibling.style.left = '10px';
                  e.target.nextSibling.style.fontSize = '12px';
                  e.target.nextSibling.style.color = '#2563eb';
                  e.target.nextSibling.style.backgroundColor = '#ffffff';
                  e.target.nextSibling.style.padding = '0 5px';
                  e.target.nextSibling.nextSibling.style.width = '100%';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '';
                  e.target.style.backgroundColor = '#f0f9ff';
                  if (!e.target.value) {
                    e.target.nextSibling.style.top = '12px';
                    e.target.nextSibling.style.left = '15px';
                    e.target.nextSibling.style.fontSize = '16px';
                    e.target.nextSibling.style.color = '#64748b';
                    e.target.nextSibling.style.backgroundColor = 'transparent';
                    e.target.nextSibling.style.padding = '0';
                  }
                  e.target.nextSibling.nextSibling.style.width = '0';
                }}
              />
              <label 
                htmlFor="titre" 
                style={{
                  ...styles.formLabel,
                  ...(form.titre ? styles.formLabelFocus : {})
                }}
              >
                Titre du poste
              </label>
              <div style={styles.formLine}></div>
            </div>
            
            <div style={styles.formGroup}>
              <textarea 
                id="description"
                name="description" 
                value={form.description} 
                onChange={handleChange}
                style={styles.formTextarea} 
                required 
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
                  e.target.style.backgroundColor = '#e0f2fe';
                  e.target.nextSibling.style.top = '-10px';
                  e.target.nextSibling.style.left = '10px';
                  e.target.nextSibling.style.fontSize = '12px';
                  e.target.nextSibling.style.color = '#2563eb';
                  e.target.nextSibling.style.backgroundColor = '#ffffff';
                  e.target.nextSibling.style.padding = '0 5px';
                  e.target.nextSibling.nextSibling.style.width = '100%';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '';
                  e.target.style.backgroundColor = '#f0f9ff';
                  if (!e.target.value) {
                    e.target.nextSibling.style.top = '12px';
                    e.target.nextSibling.style.left = '15px';
                    e.target.nextSibling.style.fontSize = '16px';
                    e.target.nextSibling.style.color = '#64748b';
                    e.target.nextSibling.style.backgroundColor = 'transparent';
                    e.target.nextSibling.style.padding = '0';
                  }
                  e.target.nextSibling.nextSibling.style.width = '0';
                }}
              ></textarea>
              <label 
                htmlFor="description" 
                style={{
                  ...styles.formLabel,
                  ...(form.description ? styles.formLabelFocus : {})
                }}
              >
                Description détaillée
              </label>
              <div style={styles.formLine}></div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                gap: '1rem',
              },
            }}>
              <div style={{...styles.formGroup, flex: 1}}>
                <input 
                  id="salaire"
                  name="salaire" 
                  value={form.salaire} 
                  onChange={handleChange}
                  style={styles.formInput} 
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
                    e.target.style.backgroundColor = '#e0f2fe';
                    e.target.nextSibling.style.top = '-10px';
                    e.target.nextSibling.style.left = '10px';
                    e.target.nextSibling.style.fontSize = '12px';
                    e.target.nextSibling.style.color = '#2563eb';
                    e.target.nextSibling.style.backgroundColor = '#ffffff';
                    e.target.nextSibling.style.padding = '0 5px';
                    e.target.nextSibling.nextSibling.style.width = '100%';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                    e.target.style.backgroundColor = '#f0f9ff';
                    if (!e.target.value) {
                      e.target.nextSibling.style.top = '12px';
                      e.target.nextSibling.style.left = '15px';
                      e.target.nextSibling.style.fontSize = '16px';
                      e.target.nextSibling.style.color = '#64748b';
                      e.target.nextSibling.style.backgroundColor = 'transparent';
                      e.target.nextSibling.style.padding = '0';
                    }
                    e.target.nextSibling.nextSibling.style.width = '0';
                  }}
                />
                <label 
                  htmlFor="salaire" 
                  style={{
                    ...styles.formLabel,
                    ...(form.salaire ? styles.formLabelFocus : {})
                  }}
                >
                  Salaire proposé
                </label>
                <div style={styles.formLine}></div>
              </div>
              
              <div style={{...styles.formGroup, flex: 1}}>
                <input 
                  id="localisation"
                  name="localisation" 
                  value={form.localisation} 
                  onChange={handleChange}
                  style={styles.formInput} 
                  required 
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
                    e.target.style.backgroundColor = '#e0f2fe';
                    e.target.nextSibling.style.top = '-10px';
                    e.target.nextSibling.style.left = '10px';
                    e.target.nextSibling.style.fontSize = '12px';
                    e.target.nextSibling.style.color = '#2563eb';
                    e.target.nextSibling.style.backgroundColor = '#ffffff';
                    e.target.nextSibling.style.padding = '0 5px';
                    e.target.nextSibling.nextSibling.style.width = '100%';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                    e.target.style.backgroundColor = '#f0f9ff';
                    if (!e.target.value) {
                      e.target.nextSibling.style.top = '12px';
                      e.target.nextSibling.style.left = '15px';
                      e.target.nextSibling.style.fontSize = '16px';
                      e.target.nextSibling.style.color = '#64748b';
                      e.target.nextSibling.style.backgroundColor = 'transparent';
                      e.target.nextSibling.style.padding = '0';
                    }
                    e.target.nextSibling.nextSibling.style.width = '0';
                  }}
                />
                <label 
                  htmlFor="localisation" 
                  style={{
                    ...styles.formLabel,
                    ...(form.localisation ? styles.formLabelFocus : {})
                  }}
                >
                  Localisation
                </label>
                <div style={styles.formLine}></div>
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <input 
                id="dateExpiration"
                type="date" 
                name="dateExpiration" 
                value={form.dateExpiration} 
                onChange={handleChange}
                style={{...styles.formInput, ...styles.formDate}} 
                required 
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
                  e.target.style.backgroundColor = '#e0f2fe';
                  e.target.nextSibling.nextSibling.style.width = '100%';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '';
                  e.target.style.backgroundColor = '#f0f9ff';
                  e.target.nextSibling.nextSibling.style.width = '0';
                }}
              />
              <label 
                htmlFor="dateExpiration" 
                style={{...styles.formLabel, ...styles.dateLabel}}
              >
                Date d'expiration
              </label>
              <div style={styles.formLine}></div>
            </div>
            
            <div style={styles.preferencesSection}>
              <h3 style={styles.preferencesTitle}>Choisir jusqu'à 3 préférences</h3>
              <div style={styles.preferencesContainer}>
                {Array.isArray(allPreferences) && allPreferences.length > 0 ? (
                  allPreferences.map(pref => (
                    <div key={pref.id} style={styles.preferenceItem}>
                      <input
                        type="checkbox"
                        id={`pref-${pref.id}`}
                        value={pref.id}
                        checked={form.preferences.includes(pref.id)}
                        onChange={handlePrefChange}
                        disabled={!form.preferences.includes(pref.id) && form.preferences.length >= 3}
                        style={styles.customCheckbox}
                      />
                      <label 
                        htmlFor={`pref-${pref.id}`} 
                        style={{
                          ...styles.checkboxLabel,
                          ...(!form.preferences.includes(pref.id) && form.preferences.length >= 3 ? styles.checkboxLabelDisabled : {})
                        }}
                      >
                        <span 
                          style={{
                            ...styles.checkboxCustom,
                            ...(form.preferences.includes(pref.id) ? styles.checkboxCustomChecked : {}),
                          }}
                        >
                          {form.preferences.includes(pref.id) && (
                            <span style={{
                              content: "''",
                              position: 'absolute',
                              top: '2px',
                              left: '6px',
                              width: '5px',
                              height: '10px',
                              border: 'solid white',
                              borderWidth: '0 2px 2px 0',
                              transform: 'rotate(45deg)',
                            }}></span>
                          )}
                        </span>
                        <span style={styles.checkboxText}>{pref.nom}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p style={styles.noPreferences}>Aucune préférence disponible.</p>
                )}
              </div>
            </div>
            
            <div style={styles.formSubmit}>
              <button 
                type="submit" 
                className="hover-button"
                style={{
                  ...styles.submitButton,
                  ...(isSubmitting ? styles.submitButtonSubmitting : {})
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 7px 14px rgba(37, 99, 235, 0.25)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = '';
                  e.target.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.2)';
                }}
                onMouseDown={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(1px)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
              >
                {isSubmitting ? (
                  <span style={styles.spinner}></span>
                ) : (
                  "Créer l'offre"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OffreCreate;