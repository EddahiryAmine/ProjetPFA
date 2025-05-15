import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext"; 
import NavbarEmployeur from './NavbarEmployeur';
import { Loader2, UserCheck, AlertCircle, User, Bell, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Animation keyframes
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes ripple {
    0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
    100% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
`;

function EmployeurHome() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [latestCandidatures, setLatestCandidatures] = useState([]);
  const [loadingCandidatures, setLoadingCandidatures] = useState(true);
  const [hoverItem, setHoverItem] = useState(null);

  const { user, loading, logout } = useAuth();
  const [isHovering, setIsHovering] = useState(null); 
  const [profileCompleted, setProfileCompleted] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check-profile-completion', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfileCompleted(response.data.profileCompleted);
      } catch (error) {
        console.error('Erreur lors de la vérification du profil:', error);
      }
    };

    const fetchLatestCandidatures = async () => {
      setLoadingCandidatures(true);
      try {
        const response = await axios.get('http://localhost:8000/api/employeur/candidatures', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const sorted = response.data
          .sort((a, b) => new Date(b.dateSoumission) - new Date(a.dateSoumission))
          .slice(0, 4);

        setLatestCandidatures(sorted);
      } catch (error) {
        console.error('Erreur lors de la récupération des candidatures :', error);
      } finally {
        setLoadingCandidatures(false);
      }
    };

    checkProfileCompletion();
    fetchLatestCandidatures();
  }, []);

  const handleCompleteProfile = () => {
    navigate('/profil/completion');
  };
  
  const handleProfileClick = () => {
    navigate('/profil');  
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (data.message === 'Déconnexion réussie.') {
        logout();
        navigate('/'); 
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getCandidatureStatusColor = (status) => {
    switch(status) {
      case 'En attente': return '#f59e0b';
      case 'Acceptée': return '#10b981';
      case 'Refusée': return '#ef4444';
      case 'En cours de traitement': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'En attente': return styles.statusPending;
      case 'Acceptée': return styles.statusAccepted;
      case 'Refusée': return styles.statusRejected;
      case 'En cours de traitement': return styles.statusProcessing;
      default: return styles.statusDefault;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const styles = {
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
    contentInner: {
      maxWidth: '1280px',
      margin: '0 auto',
      animation: 'fadeIn 0.6s ease-out forwards',
    },
    loader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    },
    loadingSpinner: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '4px solid rgba(79, 70, 229, 0.1)',
      borderTopColor: '#4f46e5',
      animation: 'spin 1s linear infinite',
    },
    welcomeHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
      paddingBottom: '24px',
      position: 'relative',
      animation: 'slideIn 0.5s ease-out forwards',
    },
    welcomeLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    welcomeIcon: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      color: 'white',
      width: '60px',
      height: '60px',
      borderRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      marginRight: '20px',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
      animation: 'pulse 2s infinite ease-in-out',
    },
    welcomeRight: {
      display: 'flex',
      gap: '12px',
    },
    navButton: {
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      color: '#4f46e5',
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      position: 'relative',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    navButtonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      color: 'white',
    },
    messageButton: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
    },
    messageButtonHover: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
      color: 'white',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: darkMode ? '#f3f4f6' : '#1e293b', 
      margin: '0',
      transition: 'color 0.3s ease',
    },
    subtitle: {
      fontSize: '16px',
      color: darkMode ? '#9ca3af' : '#6b7280',
      margin: '4px 0 0 0',
      transition: 'color 0.3s ease',
    },
    tooltip: {
      position: 'absolute',
      bottom: '-30px',
      backgroundColor: darkMode ? '#1e293b' : '#1e293b',
      color: 'white',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      opacity: '0',
      transition: 'all 0.2s ease',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      fontWeight: '500',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
    },
    tooltipVisible: {
      opacity: '1',
      transform: 'translateY(-5px)',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '32px',
      animation: 'fadeIn 0.8s ease-out forwards',
      animationDelay: '0.3s',
      opacity: 0,
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '600',
      marginBottom: '24px',
      color: darkMode ? '#f3f4f6' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      transition: 'color 0.3s ease',
      animation: 'fadeIn 0.7s ease-out forwards',
      animationDelay: '0.1s',
      opacity: 0,
    },
    sectionIcon: {
      marginRight: '12px',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      color: '#4f46e5',
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    candidatureCard: {
      backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    candidatureCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    candidatureName: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      color: darkMode ? '#f3f4f6' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      transition: 'color 0.3s ease',
    },
    candidatureTitle: {
      fontSize: '15px',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '16px',
      transition: 'color 0.3s ease',
    },
    candidatureDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: '16px',
      borderTop: `1px solid ${darkMode ? 'rgba(156, 163, 175, 0.1)' : 'rgba(229, 231, 235, 0.8)'}`,
      transition: 'border-color 0.3s ease',
    },
    candidatureDate: {
      fontSize: '14px',
      color: darkMode ? '#9ca3af' : '#6b7280',
      transition: 'color 0.3s ease',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: '9999px',
      fontSize: '13px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
    },
    statusAccepted: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
    },
    statusPending: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
    },
    statusRejected: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    statusProcessing: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
    },
    statusDefault: {
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
      color: '#6b7280',
    },
    cardDecoration: {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '120px',
      height: '120px',
      background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.15), transparent 70%)',
      borderTopRightRadius: '12px',
      pointerEvents: 'none',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 20px',
      color: '#9ca3af',
    },
    emptyText: {
      fontSize: '16px',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '20px',
    },
    viewAllLink: {
      display: 'inline-flex',
      alignItems: 'center',
      marginTop: '24px',
      padding: '12px 24px',
      backgroundColor: '#4f46e5',
      color: 'white',
      borderRadius: '12px',
      fontWeight: '500',
      textDecoration: 'none',
      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
      transition: 'all 0.3s ease',
    },
    viewAllLinkHover: {
      backgroundColor: '#4338ca',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
    },
    viewAllContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '32px',
      animation: 'fadeIn 0.9s ease-out forwards',
      animationDelay: '0.5s',
      opacity: 0,
    },
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-out forwards',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      width: '90%',
      maxWidth: '500px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      animation: 'fadeIn 0.4s ease-out forwards',
      overflow: 'hidden',
    },
    modalCloseButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#cc0000',
      marginBottom: '16px',
      position: 'relative',
      display: 'inline-block',
    },
    modalTitleIcon: {
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      color: 'rgba(239, 68, 68, 0.2)',
      fontSize: '64px',
    },
    modalText: {
      fontSize: '16px',
      color: '#4b5563',
      marginBottom: '24px',
    },
    modalButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '12px 28px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '500',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
    },
    modalDecoration: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle at bottom left, rgba(239, 68, 68, 0.1), transparent 70%)',
      pointerEvents: 'none',
    },
    shimmerEffect: {
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.1) 40%)',
      backgroundSize: '1000px 100%',
      animation: 'shimmer 2s infinite linear',
      borderRadius: '12px',
      height: '24px',
      marginBottom: '8px',
    },
    chevronRight: {
      marginLeft: '8px',
      transition: 'transform 0.3s ease',
    },
    chevronRightHover: {
      transform: 'translateX(4px)',
    },
    nameIcon: {
      marginRight: '8px',
      width: '24px',
      height: '24px',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4f46e5',
    },
    loadingCard: {
      backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      height: '100%',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#4f46e5',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '16px',
      marginRight: '12px',
    },
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loader}>
        <style>{keyframes}</style>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '400px',
          width: '90%',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
            Accès restreint
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
            Vous devez être connecté pour accéder à cette page.
          </p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '500',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#4338ca';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#4f46e5';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2)';
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (profileCompleted === null) {
    return (
      <div style={styles.loader}>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  const renderLoadingCandidatures = () => {
    return Array(4).fill().map((_, index) => (
      <div key={index} style={styles.loadingCard}>
        <div style={{ ...styles.shimmerEffect, width: '60%' }}></div>
        <div style={{ ...styles.shimmerEffect, width: '80%' }}></div>
        <div style={{ ...styles.shimmerEffect, width: '40%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <div style={{ ...styles.shimmerEffect, width: '30%' }}></div>
          <div style={{ ...styles.shimmerEffect, width: '20%', borderRadius: '9999px' }}></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="employeur-home" style={styles.container}>
      <style>{keyframes}</style>
      <NavbarEmployeur />
      <div style={styles.content}>
        <div style={styles.contentInner}>
          <div style={styles.welcomeHeader}>
            <div style={styles.welcomeLeft}>
              <div style={styles.welcomeIcon}>👋</div>
              <div>
                <h1 style={styles.title}>Bienvenue {user.name} !</h1>
                <p style={styles.subtitle}>Voici un aperçu de votre espace employeur</p>
              </div>
            </div>
            <div style={styles.welcomeRight}>
              <Link
                to="/messagerie"
                style={{
                  ...styles.navButton,
                  ...styles.messageButton,
                  ...(isHovering === 'notif' ? { ...styles.navButtonHover, ...styles.messageButtonHover } : {}),
                }}
                onMouseEnter={() => setIsHovering('notif')}
                onMouseLeave={() => setIsHovering(null)}
              >
                <Bell size={22} />
                <div style={{
                  ...styles.tooltip,
                  ...(isHovering === 'notif' ? styles.tooltipVisible : {}),
                  left: '50%',
                  transform: isHovering === 'notif' ? 'translateX(-50%) translateY(-5px)' : 'translateX(-50%) translateY(0)',
                }}>
                  Voir la messagerie
                </div>
              </Link>

              <Link
                to="/profil"
                style={{
                  ...styles.navButton,
                  ...(isHovering === 'profil' ? styles.navButtonHover : {}),
                }}
                onMouseEnter={() => setIsHovering('profil')}
                onMouseLeave={() => setIsHovering(null)}
              >
                <User size={22} />
                <div style={{
                  ...styles.tooltip,
                  ...(isHovering === 'profil' ? styles.tooltipVisible : {}),
                  left: '50%',
                  transform: isHovering === 'profil' ? 'translateX(-50%) translateY(-5px)' : 'translateX(-50%) translateY(0)',
                }}>
                  Accéder au profil
                </div>
              </Link>
            </div>
          </div>

          <div style={styles.sectionTitle}>
            <div style={styles.sectionIcon}>
              <UserCheck size={20} />
            </div>
            Dernières candidatures reçues
          </div>

          {loadingCandidatures ? (
            <div style={styles.cardContainer}>
              {renderLoadingCandidatures()}
            </div>
          ) : latestCandidatures.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <p style={styles.emptyText}>Aucune candidature pour l'instant.</p>
            </div>
          ) : (
            <div style={styles.cardContainer}>
              {latestCandidatures.map((cand, index) => (
                <div 
                  key={cand.id}
                  style={{
                    ...styles.candidatureCard,
                    ...(hoverItem === `cand-${cand.id}` ? styles.candidatureCardHover : {}),
                    animationDelay: `${0.1 + (index * 0.1)}s`
                  }}
                  onMouseEnter={() => setHoverItem(`cand-${cand.id}`)}
                  onMouseLeave={() => setHoverItem(null)}
                >
                  <div style={styles.cardDecoration}></div>
                  <div style={styles.candidatureName}>
                    <div style={styles.avatar}>
                      {cand.candidat?.user?.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    {cand.candidat?.user?.name || 'Candidat'}
                  </div>
                  <div style={styles.candidatureTitle}>
                    A postulé pour : <strong>{cand.offre_emploi?.titre || 'Offre d\'emploi'}</strong>
                  </div>
                  <div style={styles.candidatureDetails}>
                    <div style={styles.candidatureDate}>
                      {formatDate(cand.dateSoumission)}
                    </div>
                    <div style={{
                      ...styles.statusBadge,
                      ...getStatusClass(cand.statut)
                    }}>
                      {cand.statut}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={styles.viewAllContainer}>
            <Link 
              to="/employeur/candidatures"
              style={styles.viewAllLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338ca';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
                e.currentTarget.querySelector('.chevron-icon').style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2)';
                e.currentTarget.querySelector('.chevron-icon').style.transform = 'translateX(0)';
              }}
            >
              Voir toutes les candidatures
              <ChevronRight className="chevron-icon" size={18} style={styles.chevronRight} />
            </Link>
          </div>
        </div>
      </div>

      {!profileCompleted && isAlertVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              onClick={() => setIsAlertVisible(false)} 
              style={styles.modalCloseButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
            <div style={styles.modalDecoration}></div>
            
            <h2 style={styles.modalTitle}>
              Votre profil est incomplet
              <AlertCircle size={24} style={{ marginLeft: '8px', color: '#cc0000' }} />
            </h2>
            
            <p style={styles.modalText}>
              Pour accéder à toutes les fonctionnalités et optimiser votre visibilité, 
              veuillez compléter votre profil professionnel.
            </p>
            
            <button
              onClick={() => navigate("/profil/completion")}
              style={styles.modalButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4338ca';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
                e.target.style.animation = 'pulse 2s infinite';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4f46e5';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2)';
                e.target.style.animation = 'none';
              }}
            >
              Compléter mon profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeurHome;