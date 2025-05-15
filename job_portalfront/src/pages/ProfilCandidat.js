import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Styles CSS
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    color: '#333',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  loadingText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3498db',
    padding: '20px 40px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    animation: 'pulse 1.5s infinite'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e74c3c',
    padding: '20px 40px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  },
  header: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    animation: 'fadeIn 0.8s ease-out'
  },
  headerBg: {
    height: '180px',
    background: 'linear-gradient(45deg, #1a73e8, #6c5ce7)',
    position: 'relative'
  },
  profileTitle: {
    color: 'white',
    position: 'absolute',
    left: '30px',
    bottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    margin: 0
  },
  profileCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    animation: 'slideUp 0.5s ease-out'
  },
  profileCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: '20px',
    position: 'relative',
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  sectionTitleUnderline: {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50px',
    height: '4px',
    background: 'linear-gradient(45deg, #1a73e8, #6c5ce7)',
    borderRadius: '2px'
  },
  fieldName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    display: 'inline-block',
    position: 'relative',
    zIndex: 1
  },
  fieldValue: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
    padding: '10px 15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    borderLeft: '4px solid #1a73e8',
    transition: 'all 0.3s ease'
  },
  fieldValueHover: {
    background: '#EBF5FF',
    transform: 'translateX(5px)'
  },
  link: {
    color: '#1a73e8',
    textDecoration: 'none',
    position: 'relative',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  linkHover: {
    color: '#6c5ce7'
  },
  linkAfter: {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '0',
    height: '2px',
    background: 'linear-gradient(45deg, #1a73e8, #6c5ce7)',
    transition: 'width 0.3s ease'
  },
  linkHoverAfter: {
    width: '100%'
  },
  button: {
    background: 'linear-gradient(45deg, #1a73e8, #6c5ce7)',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(26, 115, 232, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 25px rgba(26, 115, 232, 0.4)'
  },
  buttonIcon: {
    marginRight: '10px'
  },
  preferencesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    listStyle: 'none',
    padding: 0
  },
  preferenceItem: {
    background: 'linear-gradient(45deg, #1a73e8, #6c5ce7)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 5px 15px rgba(26, 115, 232, 0.3)',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.5s ease-out'
  },
  preferenceItemHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(26, 115, 232, 0.4)'
  },
  preferenceTag: {
    content: '"#"',
    marginRight: '5px',
    fontSize: '14px'
  },
  noPreferenceItem: {
    padding: '12px 20px',
    borderRadius: '8px',
    background: '#f8f9fa',
    color: '#666',
    fontStyle: 'italic'
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.05)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  },
  '@keyframes slideUp': {
    '0%': {
      transform: 'translateY(20px)',
      opacity: 0
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1
    }
  }
};

// Icônes SVG
const icons = {
  user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  email: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  diploma: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5"></path><path d="M5.5 5.1L12 12l6.5-6.9"></path><path d="M16 12v6l2 2 2-2v-6"></path></svg>,
  portfolio: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  cv: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  preferences: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
  download: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  loading: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px', animation: 'spin 1s linear infinite'}}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
};

// Insertion du keyframes CSS pour les animations
const cssAnimation = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProfilCandidat = () => {
  // Insérer les styles CSS dans le document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssAnimation;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const { id } = useParams();
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState({
    card: false,
    field1: false,
    field2: false,
    field3: false,
    field4: false,
    field5: false,
    link1: false,
    link2: false,
    button: false,
    pref1: false,
    pref2: false,
    pref3: false
  });

  useEffect(() => {
    const fetchCandidat = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/candidats/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCandidat(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil candidat :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidat();
  }, [id]);

  const handleHover = (key, value) => {
    setHoverStates(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>
          {icons.loading} Chargement du profil...
        </div>
      </div>
    );
  }

  if (!candidat) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>
          Candidat introuvable.
        </div>
      </div>
    );
  }

  const { user, titre_diplome, portfolio_link, cv, preferences } = candidat;

  // Créer des délais d'animation pour chaque section
  const animationDelayStyle = (delay) => ({
    animation: `slideUp 0.5s ease-out ${delay}s both`
  });

  return (
    <div style={styles.container}>
      {/* Header avec background et titre */}
      <div style={styles.header}>
        <div style={styles.headerBg}>
          <h2 style={styles.profileTitle}>Profil du candidat</h2>
        </div>
      </div>

      {/* Carte de profil */}
      <div 
        style={{
          ...styles.profileCard,
          ...(hoverStates.card ? styles.profileCardHover : {}),
          ...animationDelayStyle(0.1)
        }}
        onMouseEnter={() => handleHover('card', true)}
        onMouseLeave={() => handleHover('card', false)}
      >
        <h3 style={styles.sectionTitle}>
          {icons.user} Informations personnelles
          <div style={styles.sectionTitleUnderline}></div>
        </h3>
        
        <div style={{marginBottom: '20px'}}>
          <span style={styles.fieldName}>{icons.user} Nom :</span>
          <div 
            style={{
              ...styles.fieldValue,
              ...(hoverStates.field1 ? styles.fieldValueHover : {})
            }}
            onMouseEnter={() => handleHover('field1', true)}
            onMouseLeave={() => handleHover('field1', false)}
          >
            {user?.name}
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <span style={styles.fieldName}>{icons.email} Email :</span>
          <div 
            style={{
              ...styles.fieldValue,
              ...(hoverStates.field2 ? styles.fieldValueHover : {})
            }}
            onMouseEnter={() => handleHover('field2', true)}
            onMouseLeave={() => handleHover('field2', false)}
          >
            {user?.email}
          </div>
        </div>
      </div>

      {/* Carte d'éducation */}
      <div 
        style={{
          ...styles.profileCard,
          ...animationDelayStyle(0.2)
        }}
      >
        <h3 style={styles.sectionTitle}>
          {icons.diploma} Éducation
          <div style={styles.sectionTitleUnderline}></div>
        </h3>
        
        <div style={{marginBottom: '20px'}}>
          <span style={styles.fieldName}>{icons.diploma} Titre du diplôme :</span>
          <div 
            style={{
              ...styles.fieldValue,
              ...(hoverStates.field3 ? styles.fieldValueHover : {})
            }}
            onMouseEnter={() => handleHover('field3', true)}
            onMouseLeave={() => handleHover('field3', false)}
          >
            {titre_diplome}
          </div>
        </div>
      </div>

      {/* Carte de liens */}
      <div 
        style={{
          ...styles.profileCard,
          ...animationDelayStyle(0.3)
        }}
      >
        <h3 style={styles.sectionTitle}>
          {icons.portfolio} Liens & Documents
          <div style={styles.sectionTitleUnderline}></div>
        </h3>
        
        <div style={{marginBottom: '20px'}}>
          <span style={styles.fieldName}>{icons.portfolio} Portfolio :</span>
          <div 
            style={{
              ...styles.fieldValue,
              ...(hoverStates.field4 ? styles.fieldValueHover : {})
            }}
            onMouseEnter={() => handleHover('field4', true)}
            onMouseLeave={() => handleHover('field4', false)}
          >
            <a 
              href={portfolio_link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                ...styles.link,
                ...(hoverStates.link1 ? styles.linkHover : {})
              }}
              onMouseEnter={() => handleHover('link1', true)}
              onMouseLeave={() => handleHover('link1', false)}
            >
              {portfolio_link}
              <span style={{
                ...styles.linkAfter,
                ...(hoverStates.link1 ? styles.linkHoverAfter : {})
              }}></span>
            </a>
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <span style={styles.fieldName}>{icons.cv} CV :</span>
          <div 
            style={{
              ...styles.fieldValue,
              ...(hoverStates.field5 ? styles.fieldValueHover : {})
            }}
            onMouseEnter={() => handleHover('field5', true)}
            onMouseLeave={() => handleHover('field5', false)}
          >
            {cv ? (
              <a 
                href={`http://localhost:8000/api/cv/${cv.id}/telecharger`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  ...styles.button,
                  ...(hoverStates.button ? styles.buttonHover : {})
                }}
                onMouseEnter={() => handleHover('button', true)}
                onMouseLeave={() => handleHover('button', false)}
              >
                {icons.download} Télécharger le CV
              </a>
            ) : (
              'Non fourni'
            )}
          </div>
        </div>
      </div>

      {/* Carte de préférences */}
      <div 
        style={{
          ...styles.profileCard,
          ...animationDelayStyle(0.4)
        }}
      >
        <h3 style={styles.sectionTitle}>
          {icons.preferences} Préférences
          <div style={styles.sectionTitleUnderline}></div>
        </h3>
        
        <div style={{marginBottom: '20px'}}>
          <ul style={styles.preferencesList}>
            {preferences && preferences.length > 0 ? (
              preferences.map((pref, index) => (
                <li 
                  key={pref.id} 
                  style={{
                    ...styles.preferenceItem,
                    ...(hoverStates[`pref${index}`] ? styles.preferenceItemHover : {}),
                    animationDelay: `${0.1 * index}s`
                  }}
                  onMouseEnter={() => handleHover(`pref${index}`, true)}
                  onMouseLeave={() => handleHover(`pref${index}`, false)}
                >
                  <span style={styles.preferenceTag}>#</span> {pref.nom}
                </li>
              ))
            ) : (
              <li style={styles.noPreferenceItem}>
                Aucune préférence renseignée
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilCandidat;