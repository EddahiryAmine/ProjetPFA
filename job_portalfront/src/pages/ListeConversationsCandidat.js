import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ListeConversationsCandidat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animation, setAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/conversations/candidat', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setConversations(res.data);
        setTimeout(() => setAnimation(true), 100);
      })
      .catch(err => {
        console.error('Erreur chargement:', err);
        setError("Impossible de charger vos conversations. Veuillez réessayer plus tard.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Format de la date relative (aujourd'hui, hier, etc.)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  // Fonction pour obtenir un statut fictif pour la démonstration
  const getRandomStatus = (id) => {
    const statuses = [
      { text: "Non lu", className: "status-unread" },
      { text: "En attente", className: "status-pending" },
      { text: "Répondu", className: "status-replied" }
    ];
    // Utiliser l'ID pour déterminer un statut fixe (pour la démo)
    return statuses[id % statuses.length];
  };

  // Fonction pour extraire les initiales du nom
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Chargement de vos conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>❌</div>
        <p style={styles.errorText}>{error}</p>
        <button 
          style={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar/>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.messageIcon}>💬</span>
          Mes échanges avec les employeurs
        </h1>
        <div style={styles.counter}>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</div>
      </div>

      {conversations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📩</div>
          <h3 style={styles.emptyTitle}>Aucune conversation</h3>
          <p style={styles.emptyText}>
            Vous n'avez pas encore d'échanges avec des employeurs.
            <br />Postulez à des offres pour démarrer une conversation.
          </p>
        </div>
      ) : (
        <ul style={styles.conversationList}>
          {conversations.map((conv, index) => {
            const status = getRandomStatus(conv.id);
            const employerName = conv.employeur?.user?.name || 'Employeur inconnu';
            const delay = `${index * 0.08}s`;
            const companyName = conv.employeur?.company_name || 'Entreprise';
            const lastMessage = "Bonjour, nous avons bien reçu votre candidature et...";
            const date = conv.updated_at ? formatDate(conv.updated_at) : "Récemment";

            return (
              <li 
                key={conv.id} 
                style={{
                  ...styles.conversationItem,
                  animationDelay: delay,
                  opacity: animation ? 1 : 0,
                  transform: animation ? 'translateY(0)' : 'translateY(20px)'
                }}
                onClick={() => navigate(`/messagerie/${conv.id}`)}
              >
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    {getInitials(employerName)}
                  </div>
                  <div style={{
                    ...styles.statusIndicator,
                    backgroundColor: status.text === "Non lu" ? "#2563eb" : 
                                    status.text === "En attente" ? "#f59e0b" : "#10b981"
                  }} title={status.text}></div>
                </div>
                
                <div style={styles.conversationContent}>
                  <div style={styles.conversationHeader}>
                    <h3 style={styles.employerName}>{employerName}</h3>
                    <span style={styles.dateLabel}>{date}</span>
                  </div>
                  
                  <div style={styles.companyName}>{companyName}</div>
                  
                  <p style={styles.messagePreview}>
                    {lastMessage.length > 60 ? lastMessage.substring(0, 60) + '...' : lastMessage}
                  </p>
                  
                  <div style={styles.conversationFooter}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: status.text === "Non lu" ? "#dbeafe" : 
                                      status.text === "En attente" ? "#fef3c7" : "#d1fae5",
                      color: status.text === "Non lu" ? "#1e40af" : 
                             status.text === "En attente" ? "#92400e" : "#065f46"
                    }}>
                      {status.text === "Non lu" && "●"} {status.text}
                    </span>
                    <div style={styles.arrowIcon}>→</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Styles intégrés
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '96px',
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    color: '#1e3a8a',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
  },
  messageIcon: {
    marginRight: '12px',
    fontSize: '28px',
  },
  counter: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '14px',
    fontWeight: '500',
  },
  conversationList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  conversationItem: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    animation: 'fadeIn 0.5s ease forwards',
    opacity: 0,
    transform: 'translateY(20px)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #f3f4f6',
    
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)',
      borderLeft: '3px solid #2563eb',
    },
    
    ':active': {
      transform: 'translateY(0)',
      boxShadow: '0 5px 15px rgba(37, 99, 235, 0.07)',
    },
    
    ':before': {
      content: '""',
      position: 'absolute',
      left: '0',
      top: '0',
      height: '100%',
      width: '3px',
      backgroundColor: '#2563eb',
      transform: 'scaleY(0)',
      transition: 'transform 0.25s ease',
    },
    
    ':hover:before': {
      transform: 'scaleY(1)',
    }
  },
  avatarContainer: {
    position: 'relative',
    marginRight: '16px',
    flexShrink: 0,
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#bfdbfe',
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '18px',
    border: '2px solid #e0e7ff',
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    border: '2px solid white',
  },
  conversationContent: {
    flex: '1',
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  employerName: {
    margin: '0',
    fontSize: '17px',
    fontWeight: '600',
    color: '#1f2937',
  },
  dateLabel: {
    color: '#6b7280',
    fontSize: '13px',
  },
  companyName: {
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  messagePreview: {
    margin: '0',
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  conversationFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  arrowIcon: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: '18px',
    opacity: '0.7',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    transform: 'translateX(0)',
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
    color: '#ef4444',
  },
  errorText: {
    fontSize: '18px',
    color: '#4b5563',
    marginBottom: '24px',
  },
  retryButton: {
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: 'white',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px dashed #d1d5db',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    color: '#1f2937',
    margin: '0 0 12px 0',
  },
  emptyText: {
    color: '#6b7280',
    lineHeight: '1.6',
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
};

export default ListeConversationsCandidat;