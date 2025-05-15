import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
// Pour les icônes
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Calendar, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const MesCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Animation pour faire apparaître les cartes progressivement
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/candidat/candidatures', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCandidatures(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des candidatures :', error);
      } finally {
        setLoading(false);
        // Déclencher l'animation après le chargement
        setTimeout(() => setVisible(true), 300);
      }
    };
    
    fetchCandidatures();
  }, []);

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'en_attente': return '#3498db'; // Bleu
      case 'approuve': return '#2ecc71';   // Vert
      case 'rejete': return '#e74c3c';     // Rouge
      default: return '#95a5a6';           // Gris
    }
  };

  // Fonction pour obtenir l'icône en fonction du statut
  const getStatusIcon = (status) => {
    switch(status) {
      case 'en_attente': return <Clock size={22} />;
      case 'approuve': return <CheckCircle size={22} />;
      case 'rejete': return <XCircle size={22} />;
      default: return <AlertCircle size={22} />;
    }
  };

  // Texte du statut formaté
  const getStatusText = (status) => {
    switch(status) {
      case 'en_attente': return 'En attente';
      case 'approuve': return 'Approuvée';
      case 'rejete': return 'Refusée';
      default: return status;
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid rgba(0, 123, 255, 0.1)',
        borderTop: '5px solid #0077ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <p style={{
        marginTop: '20px',
        color: '#0077ff',
        fontWeight: '600',
        fontSize: '18px'
      }}>Chargement des candidatures...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Styles CSS pour l'animation des cartes
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      fontFamily: '"Poppins", sans-serif',

    },
    header: {
      position: 'relative',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '96px 0',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
      overflow: 'hidden',
    },
    headerInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative',
      zIndex: '2',
    },
    headerTitle: {
      color: 'white',
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '10px',
      position: 'relative',
      display: 'inline-block',
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '16px',
      marginBottom: '0',
    },
    pulse: {
      position: 'absolute',
      top: '50%',
      right: '30px',
      transform: 'translateY(-50%)',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'pulse 2s infinite',
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px 0',
      color: '#6c757d',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      margin: '30px 0',
      transition: 'transform 0.3s ease',
    },
    emptyStateText: {
      fontSize: '18px',
      fontWeight: '500',
      marginTop: '20px',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '25px',
    },
    card: (index) => ({
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      padding: '25px',
      transition: 'all 0.3s ease-in-out',
      transform: `translateY(${visible ? '0' : '20px'})`,
      opacity: visible ? 1 : 0,
      transitionDelay: `${index * 0.1}s`,
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #e6e6e6',
      cursor: 'pointer',
    }),
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0, 123, 255, 0.15)',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    cardInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '25px',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    infoLabel: {
      color: '#6c757d',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
    },
    infoValue: {
      color: '#2c3e50',
      fontWeight: '500',
      fontSize: '15px',
    },
    statusBadge: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: `${getStatusColor(status)}20`,
      color: getStatusColor(status),
      border: `1px solid ${getStatusColor(status)}40`,
    }),
    cardFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e6e6e6',
    },
    button: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '8px',
      fontWeight: '500',
      backgroundColor: status === 'rejete' ? '#f8f9fa' : getStatusColor(status),
      color: status === 'rejete' ? '#6c757d' : 'white',
      border: 'none',
      cursor: status === 'rejete' ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      fontSize: '14px',
      boxShadow: status === 'rejete' ? 'none' : '0 4px 10px rgba(0, 123, 255, 0.2)',
    }),
    buttonHover: (status) => ({
      backgroundColor: status === 'rejete' ? '#f8f9fa' : 
                       status === 'en_attente' ? '#2980b9' : '#27ae60',
      boxShadow: status === 'rejete' ? 'none' : '0 6px 15px rgba(0, 123, 255, 0.3)',
    }),
    decorationDot: {
      position: 'absolute',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      bottom: '-50px',
      right: '-50px',
    },
  };

  // CSS animations
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: translateY(-50%) scale(0.95); opacity: 0.7; }
      50% { transform: translateY(-50%) scale(1.05); opacity: 0.3; }
      100% { transform: translateY(-50%) scale(0.95); opacity: 0.7; }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <Navbar />
      
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.headerTitle}>
            Mes candidatures
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              left: '0',
              width: '40%',
              height: '3px',
              background: '#4dabf7',
              borderRadius: '2px',
            }}></span>
          </h1>
          <p style={styles.headerSubtitle}>Suivez l'évolution de vos candidatures en temps réel</p>
        </div>
        <div style={styles.pulse}></div>
      </div>
      
      <div style={styles.container}>
        {candidatures.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto',
              position: 'relative',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <FileText size={100} color="#b8c2cc" />
            </div>
            <p style={styles.emptyStateText}>Vous n'avez pas encore postulé à une offre.</p>
            <Link to="/CandidatHome" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(to right, #1e3c72, #2a5298)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              marginTop: '20px',
              boxShadow: '0 4px 15px rgba(42, 82, 152, 0.3)',
              transition: 'all 0.3s ease',
            }}>
              Découvrir les offres <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {candidatures.map((cand, index) => (
              <div
                key={index}
                style={{
                  ...styles.card(index),
                  ...(selectedCard === index ? styles.cardHover : {})
                }}
                onMouseEnter={() => setSelectedCard(index)}
                onMouseLeave={() => setSelectedCard(null)}
              >
                <div style={styles.decorationDot}></div>
                
                <h3 style={styles.cardTitle}>
                  <Briefcase size={22} color="#1e3c72" />
                  {cand.offre_emploi?.titre || "Offre sans titre"}
                </h3>
                
                <div style={styles.cardInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>
                      <Calendar size={16} color="#6c757d" /> Date de soumission
                    </span>
                    <span style={styles.infoValue}>
                      {new Date(cand.dateSoumission).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Statut</span>
                    <span style={styles.statusBadge(cand.statut)}>
                      {getStatusIcon(cand.statut)}
                      {getStatusText(cand.statut)}
                    </span>
                  </div>
                </div>
                
                <div style={styles.cardFooter}>
                  {cand.statut === 'en_attente' && (
                    <div
                      style={{
                        ...styles.button(cand.statut),
                        ...(selectedCard === index ? styles.buttonHover(cand.statut) : {})
                      }}
                    >
                      <Clock size={18} />
                      En attente
                    </div>
                  )}
                  
                  {cand.statut === 'approuve' && (
                    <Link
                      to={`/messagerie/${cand.id}`}
                      style={{
                        ...styles.button(cand.statut),
                        ...(selectedCard === index ? styles.buttonHover(cand.statut) : {})
                      }}
                    >
                      <MessageSquare size={18} />
                      Accéder à la messagerie
                    </Link>
                  )}
                  
                  {cand.statut === 'rejete' && (
                    <div
                      style={{
                        ...styles.button(cand.statut),
                        ...(selectedCard === index ? styles.buttonHover(cand.statut) : {})
                      }}
                    >
                      <XCircle size={18} />
                      Refusée
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MesCandidatures;