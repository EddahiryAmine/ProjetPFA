import React, { useEffect, useState, useRef } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const CandidatHome = () => {
  const [offres, setOffres] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState({});
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Animation states
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    // Déclencher l'animation du header immédiatement
    setAnimateHeader(true);
    
    const fetchOffres = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/offres/candidat');
        setOffres(res.data);
        
        // Déclencher l'animation des cartes une fois les données chargées
        setTimeout(() => setAnimationComplete(true), 300);
      } catch (err) {
        console.error('Erreur lors du chargement des offres :', err);
        setError("❌ Impossible de récupérer les offres.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();

    // Focus sur la barre de recherche après chargement de la page
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 1000);
  }, []);

  const filteredOffres = offres.filter(offre =>
    offre.titre?.toLowerCase().includes(search.toLowerCase()) ||
    offre.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardHover = (id, isHovering) => {
    setHoverStates(prev => ({
      ...prev,
      [id]: isHovering
    }));
  };

  // Définition des couleurs principales
  const colors = {
    primary: '#1565c0',
    primaryLight: '#1e88e5',
    primaryDark: '#0d47a1',
    primaryGradient: 'linear-gradient(135deg, #1976d2, #0d47a1)',
    background: '#f6f9fc',
    card: '#ffffff',
    textPrimary: '#263238',
    textSecondary: '#546e7a',
    error: '#d32f2f',
    border: '#e0e0e0',
    hoverHighlight: 'rgba(21, 101, 192, 0.08)'
  };

  // Styles avec animations avancées
  const styles = {
    pageContainer: {
      background: colors.background,
      minHeight: '100vh',
      padding: '30px 0',
      fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      paddingTop:'98px'

    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    header: {
      background: colors.primaryGradient,
      borderRadius: '16px',
      padding: '35px 30px',
      marginBottom: '40px',
      color: 'white',
      boxShadow: '0 10px 30px rgba(13, 71, 161, 0.25)',
      position: 'relative',
      overflow: 'hidden',
      opacity: animateHeader ? 1 : 0,
      transform: animateHeader ? 'translateY(0)' : 'translateY(-30px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    },
    headerDecoration: {
      position: 'absolute',
      top: 0,
      right: 0,
      borderRadius: '0 0 0 100%',
      width: '200px',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.1)',
      zIndex: 1,
    },
    headerContent: {
      position: 'relative',
      zIndex: 2,
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    titleIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    },
    searchContainer: {
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '18px 30px 18px 60px',
      borderRadius: '50px',
      border: 'none',
      fontSize: '17px',
      fontWeight: '500',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: searchFocused ? 'white' : 'rgba(255, 255, 255, 0.95)',
      transform: searchFocused ? 'scale(1.02)' : 'scale(1)',
      color: colors.textPrimary,
    },
    searchIconContainer: {
      position: 'absolute',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.primary,
      transition: 'all 0.3s ease',
    },
    offresContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '30px',
      perspective: '1000px',
    },
    offreCard: (index, isHovered) => ({
      background: colors.card,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: isHovered 
        ? '0 15px 30px rgba(21, 101, 192, 0.25), 0 0 0 2px rgba(21, 101, 192, 0.1)' 
        : '0 8px 20px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid',
      borderColor: isHovered ? 'rgba(21, 101, 192, 0.2)' : colors.border,
      opacity: animationComplete ? 1 : 0,
      transform: animationComplete 
        ? isHovered ? 'translateY(-8px) rotateX(2deg)' : 'translateY(0) rotateX(0)' 
        : 'translateY(40px)',
      transitionDelay: `${index * 0.08}s`,
    }),
    offreHeader: {
      padding: '20px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      backgroundColor: 'white',
      position: 'relative',
      '&:hover': {
        backgroundColor: colors.hoverHighlight,
      }
    },
    employeurPhotoContainer: {
      position: 'relative',
      width: '60px',
      height: '60px',
    },
    employeurPhoto: {
      width: '60px',
      height: '60px',
      borderRadius: '15px',
      objectFit: 'cover',
      border: '3px solid white',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s ease',
      zIndex: '2',
      position: 'relative',
    },
    photoShadow: {
      position: 'absolute',
      width: '58px',
      height: '18px',
      bottom: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
      zIndex: '1',
      borderRadius: '50%',
    },
    employeurPlaceholder: {
      width: '60px',
      height: '60px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #e0e0e0, #f5f5f5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#9e9e9e',
      border: '3px solid white',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    employeurInfo: {
      flex: 1,
    },
    employeurNom: {
      fontWeight: '600',
      fontSize: '16px',
      color: colors.textPrimary,
    },
    offreBody: {
      padding: '25px 20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    offreTitre: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '15px',
      color: colors.textPrimary,
      lineHeight: '1.3',
    },
    offreDescription: {
      color: colors.textSecondary,
      marginBottom: '20px',
      lineHeight: '1.6',
      flex: 1,
      fontSize: '15px',
    },
    offreFooter: {
      padding: '15px 20px',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(246, 249, 252, 0.5)',
    },
    localisation: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.textSecondary,
      fontSize: '14px',
      fontWeight: '500',
    },
    locationIcon: {
      color: colors.primary,
      display: 'flex',
    },
    voirPlusBtn: isHovered => ({
      background: isHovered ? colors.primaryDark : colors.primary,
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '30px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: isHovered 
        ? '0 8px 15px rgba(13, 71, 161, 0.25)' 
        : '0 4px 10px rgba(21, 101, 192, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    }),
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      flexDirection: 'column',
    },
    loader: {
      position: 'relative',
      width: '80px',
      height: '80px',
    },
    loaderCircle: (index) => ({
      position: 'absolute',
      width: '60px',
      height: '60px',
      border: '4px solid transparent',
      borderTopColor: index === 0 ? colors.primary : '#00b0ff',
      borderRadius: '50%',
      animation: `spin${index + 1} 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite`,
      top: '10px',
      left: '10px',
    }),
    loaderText: {
      marginTop: '20px',
      color: colors.textSecondary,
      fontWeight: '500',
      fontSize: '16px',
    },
    errorMessage: {
      background: 'rgba(211, 47, 47, 0.1)',
      color: colors.error,
      padding: '18px 20px',
      borderRadius: '12px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      border: '1px solid rgba(211, 47, 47, 0.2)',
      boxShadow: '0 5px 15px rgba(211, 47, 47, 0.1)',
    },
    errorIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(211, 47, 47, 0.15)',
      borderRadius: '50%',
      padding: '8px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px',
      gridColumn: '1 / -1',
      color: colors.textSecondary,
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
    },
    emptyStateIcon: {
      margin: '0 auto 25px',
      display: 'block',
      color: '#bdbdbd',
      opacity: 0.8,
    },
    offreTags: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '15px',
    },
    offreTag: {
      padding: '5px 10px',
      background: 'rgba(21, 101, 192, 0.08)',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      color: colors.primaryDark,
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerDecoration}></div>
          
          <div style={styles.headerContent}>
            <h1 style={styles.title}>
              <span style={styles.titleIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </span>
              Offres d'emploi 
            </h1>
            
            <div style={styles.searchContainer}>
              <span style={styles.searchIconContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Rechercher des offres par titre ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </span>
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loaderContainer}>
            <div style={styles.loader}>
              <div style={styles.loaderCircle(0)}></div>
              <div style={styles.loaderCircle(1)}></div>
            </div>
            <div style={styles.loaderText}>Chargement des offres...</div>
          </div>
        ) : (
          <div style={styles.offresContainer}>
            {filteredOffres.length > 0 ? filteredOffres.map((offre, index) => {
              const isHovered = hoverStates[offre.id] || false;
              const btnHovered = hoverStates[`btn-${offre.id}`] || false;
              
              return (
                <div
                  key={offre.id}
                  style={styles.offreCard(index, isHovered)}
                  onMouseEnter={() => handleCardHover(offre.id, true)}
                  onMouseLeave={() => handleCardHover(offre.id, false)}
                >
                  <div 
                    style={styles.offreHeader}
                    onClick={() => navigate(`/employeur/${offre.employeur?.id}`)}
                  >
                    <div style={styles.employeurPhotoContainer}>
                      {offre.employeur?.photo ? (
                        <>
                          <img
                            src={offre.employeur.photo}
                            alt={offre.employeur.nom}
                            style={styles.employeurPhoto}
                          />
                          <div style={styles.photoShadow}></div>
                        </>
                      ) : (
                        <>
                          <div style={styles.employeurPlaceholder}>
                            ❔
                          </div>
                          <div style={styles.photoShadow}></div>
                        </>
                      )}
                    </div>
                    <div style={styles.employeurInfo}>
                      <div style={styles.employeurNom}>
                        {offre.employeur?.nom || ''}
                      </div>
                    </div>
                  </div>

                  <div style={styles.offreBody}>
                    <h3 style={styles.offreTitre}>{offre.titre}</h3>



                    {offre.preferences?.length > 0 && (
    <div style={styles.offreTags}>
      {offre.preferences?.map((tag, idx) => (
  <span key={tag.id || idx} style={styles.offreTag}>
    {tag.nom ?? 'Préférence'}
  </span>
))}
    </div>
  )}
                    <p style={styles.offreDescription}>
                      {offre.description?.slice(0, 150)}{offre.description?.length > 150 ? '...' : ''}
                    </p>




                  </div>
                  

                  <div style={styles.offreFooter}>
                    <div style={styles.localisation}>
                      <span style={styles.locationIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                      📍 {offre.localisation || 'Lieu non spécifié'}
                    </div>
                    <button
                      style={styles.voirPlusBtn(btnHovered)}
                      onMouseEnter={() => setHoverStates(prev => ({...prev, [`btn-${offre.id}`]: true}))}
                      onMouseLeave={() => setHoverStates(prev => ({...prev, [`btn-${offre.id}`]: false}))}
                      onClick={() => navigate(`/offre/${offre.id}`)}
                    >
                      Voir plus
                      <span style={{
                        display: 'flex',
                        transition: 'transform 0.3s ease',
                        transform: btnHovered ? 'translateX(3px)' : 'translateX(0)'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div style={styles.emptyState}>
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={styles.emptyStateIcon}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 15h8"></path>
                  <circle cx="9" cy="9" r="1"></circle>
                  <circle cx="15" cy="9" r="1"></circle>
                </svg>
                <h3>Aucune offre ne correspond à vos préférences ou à la recherche.</h3>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin1 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin2 {
          0% { transform: rotate(30deg); }
          100% { transform: rotate(390deg); }
        }
      `}</style>
    </div>
  );
};

export default CandidatHome;