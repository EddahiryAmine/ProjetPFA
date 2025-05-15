import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axios';

const OffreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [offre, setOffre] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offreRes, profileRes] = await Promise.all([
          axios.get(`/api/offres/${id}`),
          axios.get('/api/me')
        ]);
        
        setOffre(offreRes.data);
        setProfileCompleted(profileRes.data.profile_completed);
      } catch (err) {
        console.error(err);
        showAlert('error', "Une erreur est survenue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const showAlert = (type, message) => {
    setAlertInfo({ show: true, type, message });
    
    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      setAlertInfo({ show: false, type: '', message: '' });
    }, 5000);
  };
  
  const postuler = async () => {
    if (!profileCompleted) {
      showAlert('warning', "Veuillez d'abord compléter votre profil avant de postuler.");
      return;
    }
    
    try {
      const response = await axios.post(
        '/api/candidatures',
        { offre_emploi_id: offre.id },
        { withCredentials: true }
      );
      showAlert('success', "Candidature envoyée avec succès !");
    } catch (error) {
      if (error.response?.status === 409) {
        showAlert('warning', error.response.data.message);
      } else {
        console.error(error);
        showAlert('error', "Erreur lors de la soumission de votre candidature.");
      }
    }
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Chargement en cours...</p>
      </div>
    );
  }
  
  if (!offre) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>❌</div>
        <p style={styles.errorText}>Offre non trouvée.</p>
        <button 
          style={styles.backButton} 
          onClick={() => navigate(-1)}
        >
          Retour
        </button>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      {alertInfo.show && (
        <div style={{...styles.alert, ...styles[alertInfo.type]}}>
          <span style={styles.alertIcon}>
            {alertInfo.type === 'success' && '✅'}
            {alertInfo.type === 'error' && '❌'}
            {alertInfo.type === 'warning' && '⚠️'}
          </span>
          <span style={styles.alertMessage}>{alertInfo.message}</span>
          <button 
            style={styles.alertCloseButton}
            onClick={() => setAlertInfo({ show: false, type: '', message: '' })}
          >
            &times;
          </button>
        </div>
      )}
      
      <div style={styles.card}>
        <h1 style={styles.title}>{offre.titre}</h1>
        
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Lieu :</span>
            <span style={styles.infoValue}>{offre.lieu || 'Non spécifié'}</span>
          </div>
          
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Date de publication :</span>
            <span style={styles.infoValue}>
              {new Date(offre.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Type de contrat :</span>
            <span style={styles.infoValue}>{offre.type_contrat || 'Non précisé'}</span>
          </div>
        </div>
        
        <div style={styles.description}>
          <h2 style={styles.subtitleDescription}>Description du poste</h2>
          <p style={styles.descriptionText}>{offre.description}</p>
        </div>
        
        <div style={styles.actions}>
          <button 
            style={{
              ...styles.actionButton,
              ...styles.primaryButton,
              ...(profileCompleted ? {} : styles.disabledButton)
            }}
            onClick={postuler}
            disabled={!profileCompleted}
          >
            {profileCompleted ? 'Postuler maintenant' : 'Profil incomplet'}
          </button>
          
          <button 
            style={{...styles.actionButton, ...styles.secondaryButton}}
            onClick={() => navigate(-1)}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

// Integrated styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginTop: '16px',
  },
  title: {
    color: '#1e3a8a',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 24px 0',
    padding: '0 0 12px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  infoSection: {
    marginBottom: '24px',
  },
  infoItem: {
    display: 'flex',
    marginBottom: '8px',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#4b5563',
    width: '160px',
    flexShrink: 0,
  },
  infoValue: {
    color: '#1f2937',
  },
  description: {
    marginBottom: '32px',
  },
  subtitleDescription: {
    color: '#1e3a8a',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  descriptionText: {
    color: '#374151',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  actionButton: {
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    '&:hover': {
      backgroundColor: '#e5e7eb',
    },
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
    position: 'relative',
    animation: 'slideIn 0.3s ease-out',
  },
  success: {
    backgroundColor: '#dcfce7',
    borderLeft: '4px solid #22c55e',
    color: '#166534',
  },
  error: {
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #ef4444',
    color: '#991b1b',
  },
  warning: {
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #f59e0b',
    color: '#92400e',
  },
  alertIcon: {
    marginRight: '12px',
    fontSize: '18px',
  },
  alertMessage: {
    flex: 1,
  },
  alertCloseButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    opacity: 0.7,
    padding: '0 4px',
    color: 'inherit',
    '&:hover': {
      opacity: 1,
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '12px',
    color: '#4b5563',
    fontSize: '16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorText: {
    fontSize: '18px',
    color: '#4b5563',
    marginBottom: '24px',
  },
  backButton: {
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: 'white',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  '@keyframes slideIn': {
    '0%': { transform: 'translateY(-20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
};

export default OffreDetail;