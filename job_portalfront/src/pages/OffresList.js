import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSun, FaMoon } from 'react-icons/fa';
import NavbarEmployeur from './NavbarEmployeur';

// Import des icônes (npm install react-icons)
import { FaBuilding, FaMapMarkerAlt, FaEdit, FaTrash, FaBriefcase, FaPlus, FaSearch } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';

const OffreList = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [offreToDelete, setOffreToDelete] = useState(null);
  const [animateList, setAnimateList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const offresParPage = 3;


  useEffect(() => {
    // Vérifier le mode sombre dans localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    const fetchOffres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/offres', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        });
        setOffres(response.data);
        // Déclencher l'animation après le chargement des données
        setTimeout(() => setAnimateList(true), 100);
      } catch (error) {
        console.error('Erreur lors du chargement des offres :', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffres();
  }, []);

  // Fonction pour basculer entre mode clair et sombre
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  // Filtrage des offres en fonction du terme de recherche
  const filteredOffres = offres.filter(offre => 
    offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offre.localisation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour confirmer la suppression
  const confirmDelete = (id) => {
    setOffreToDelete(id);
    setShowConfirmation(true);
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setOffreToDelete(null);
    setShowConfirmation(false);
  };

  // Fonction pour effectuer la suppression
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/offres/${offreToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Animation pour l'élément qui va être supprimé
      document.getElementById(`offre-${offreToDelete}`).style.animation = 'slideOut 0.5s forwards';
      
      // Attendre la fin de l'animation avant de mettre à jour l'état
      setTimeout(() => {
        setOffres(offres.filter(offre => offre.id !== offreToDelete));
        setShowConfirmation(false);
        setOffreToDelete(null);
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre :', error);
      alert('Erreur lors de la suppression de l\'offre');
      setShowConfirmation(false);
      setOffreToDelete(null);
    }
  };

  // Styles CSS intégrés
  const styles = {
    '@import': "url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap')",
    
    content: {
      flex: 1,
      padding: '10px',
      background: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
      transition: 'all 0.3s ease',
      overflow: 'auto',

    },
    container: {
      display: 'flex',
      height: '100vh',
      background: darkMode ? '#0f172a' : '#ffffff',
      transition: 'background 0.3s ease',
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
    
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#0077b5', // Couleur bleue LinkedIn
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    
    controls: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    
    searchContainer: {
      position: 'relative',
      width: '300px',
    },
    
    searchInput: {
      width: '100%',
      padding: '10px 15px 10px 40px',
      borderRadius: '8px',
      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
    },
    
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#0077b5',
      fontSize: '16px',
    },
    
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#0077b5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
    },
    
    addButtonHover: {
      backgroundColor: '#005fa3',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)',
    },
    
    darkModeToggle: {
      backgroundColor: 'transparent',
      border: 'none',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      backgroundColor: darkMode ? '#374151' : '#e5e7eb',
    },
    
    darkModeToggleHover: {
      transform: 'rotate(15deg)',
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
    },
    
    spinner: {
      animation: 'spin 1s linear infinite',
      fontSize: '2rem',
      color: '#0077b5',
      marginBottom: '16px',
    },
    
    noOffres: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      margin: '20px 0',
    },
    
    noOffresText: {
      fontSize: '1.1rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '16px',
    },
    
    offresList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    
    offreItem: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: animateList ? 'fadeInUp 0.5s forwards' : 'none',
    },
    
    offreItemHover: {
      boxShadow: '0 6px 16px rgba(0, 119, 181, 0.15)',
      transform: 'translateY(-3px)',
    },
    
    offreTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#0077b5',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    offreLocation: {
      fontSize: '0.95rem',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    offreDescription: {
      marginBottom: '16px',
      lineHeight: '1.6',
      color: darkMode ? '#d1d5db' : '#4b5563',
    },
    
    offrePreferences: {
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      fontSize: '0.9rem',
      marginBottom: '16px',
      color: darkMode ? '#9ca3af' : '#6b7280',
    },
    
    preferenceTag: {
      backgroundColor: darkMode ? '#334155' : '#f3f4f6',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      marginRight: '6px',
      color: darkMode ? '#e5e7eb' : '#4b5563',
    },
    
    offreFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px',
    },
    
    editButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
      color: darkMode ? '#dbeafe' : '#1e40af',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },
    
    editButtonHover: {
      backgroundColor: darkMode ? '#1e3a8a' : '#bfdbfe',
      transform: 'translateY(-2px)',
    },
    
    deleteButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
      color: darkMode ? '#fee2e2' : '#7f1d1d',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    deleteButtonHover: {
      backgroundColor: darkMode ? '#991b1b' : '#fecaca',
      transform: 'translateY(-2px)',
    },
    
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    
    modal: {
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      animation: 'fadeIn 0.3s ease',
    },
    
    modalTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#0077b5',
    },
    
    modalText: {
      marginBottom: '24px',
      lineHeight: '1.6',
      color: darkMode ? '#d1d5db' : '#4b5563',
    },
    
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
    },
    
    modalCancelButton: {
      padding: '8px 16px',
      backgroundColor: darkMode ? '#374151' : '#e5e7eb',
      color: darkMode ? '#f3f4f6' : '#1f2937',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    modalConfirmButton: {
      padding: '8px 16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    '@keyframes fadeInUp': {
      from: {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    
    '@keyframes fadeIn': {
      from: {
        opacity: 0,
        transform: 'scale(0.95)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    
    '@keyframes spin': {
      to: {
        transform: 'rotate(360deg)',
      },
    },
    
    '@keyframes slideOut': {
      to: {
        opacity: 0,
        transform: 'translateX(50px)',
        height: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      },
    },
  };

  if (loading) {
    return (
      <div style={styles.content}>
        <div style={styles.loadingContainer}>
          <BiLoaderAlt style={styles.spinner} />
          <p>Chargement des offres d'emploi...</p>
        </div>
      </div>
    );
  }
const indexOfLastOffre = currentPage * offresParPage;
const indexOfFirstOffre = indexOfLastOffre - offresParPage;
const currentOffres = filteredOffres.slice(indexOfFirstOffre, indexOfLastOffre);

const totalPages = Math.ceil(filteredOffres.length / offresParPage);

const goToPage = (pageNum) => {
  if (pageNum >= 1 && pageNum <= totalPages) {
    setCurrentPage(pageNum);
  }
};

  return (
    <div style={styles.container}>
      <NavbarEmployeur/>
      <div style={styles.content}>


      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes slideOut {
          to {
            opacity: 0;
            transform: translateX(50px);
            height: 0;
            padding: 0;
            margin: 0;
            overflow: hidden;
          }
        }
      `}} />
      
      <div style={styles.header}>
        <h2 style={styles.title}>
          <FaBriefcase />
          Mes Offres d'Emploi
        </h2>
        
        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <Link 
            to="/employeur/offres/create"
            style={styles.addButton}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.addButtonHover)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, {
              backgroundColor: '#0077b5',
              transform: 'none',
              boxShadow: 'none'
            })}
          >
            <FaPlus /> Ajouter une offre
          </Link>
          
          <button 
            style={styles.darkModeToggle}
            onClick={toggleDarkMode}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.darkModeToggleHover)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, {transform: 'none'})}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
      
      {filteredOffres.length === 0 ? (
        <div style={styles.noOffres}>
          <FaBriefcase style={{ fontSize: '3rem', color: '#0077b5', marginBottom: '16px' }} />
          <p style={styles.noOffresText}>
            {searchTerm ? 'Aucune offre ne correspond à votre recherche.' : 'Aucune offre disponible.'}
          </p>
          <Link 
            to="/employeur/offres/create"
            style={styles.addButton}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.addButtonHover)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, {
              backgroundColor: '#0077b5',
              transform: 'none',
              boxShadow: 'none'
            })}
          >
            <FaPlus /> Créer ma première offre
          </Link>
        </div>
      ) : (
        <ul style={styles.offresList}>
          {currentOffres.map((offre, index) => (
            <li 
              key={offre.id} 
              id={`offre-${offre.id}`}
              style={{
                ...styles.offreItem,
                animationDelay: `${index * 0.1}s`
              }}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.offreItemHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transform: 'none'
              })}
            >
              <h3 style={styles.offreTitle}>
                <FaBriefcase style={{ color: '#0077b5' }} />
                {offre.titre}
              </h3>
              
              <div style={styles.offreLocation}>
                <FaMapMarkerAlt />
                {offre.localisation}
              </div>
              
              <p style={styles.offreDescription}>
                {offre.description}
              </p>
              
              <div style={styles.offrePreferences}>
                <strong>Préférences :</strong>
                {offre.preferences && offre.preferences.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {offre.preferences.map(pref => (
                      <span key={pref.id} style={styles.preferenceTag}>
                        {pref.nom}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span>Aucune</span>
                )}
              </div>
              
              <div style={styles.offreFooter}>
                <Link 
                  to={`/offres/${offre.id}/edit`}
                  style={styles.editButton}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.editButtonHover)}
                  onMouseOut={(e) => Object.assign(e.currentTarget.style, {
                    backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
                    transform: 'none'
                  })}
                >
                  <FaEdit /> Modifier
                </Link>
                
                <button 
                  style={styles.deleteButton}
                  onClick={() => confirmDelete(offre.id)}
                  onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.deleteButtonHover)}
                  onMouseOut={(e) => Object.assign(e.currentTarget.style, {
                    backgroundColor: darkMode ? '#7f1d1d' : '#fee2e2',
                    transform: 'none'
                  })}
                >
                  <FaTrash /> Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
        
      )}
      {totalPages > 1 && (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '10px'
  }}>
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      style={{
        padding: '8px 12px',
        backgroundColor: '#e5e7eb',
        color: '#374151',
        border: 'none',
        borderRadius: '6px',
        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
      }}
    >
      ◀ Préc.
    </button>

    {[...Array(totalPages).keys()].map((n) => (
      <button
        key={n + 1}
        onClick={() => goToPage(n + 1)}
        style={{
          padding: '8px 12px',
          backgroundColor: currentPage === n + 1 ? '#0077b5' : '#f3f4f6',
          color: currentPage === n + 1 ? 'white' : '#374151',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        {n + 1}
      </button>
    ))}

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      style={{
        padding: '8px 12px',
        backgroundColor: '#e5e7eb',
        color: '#374151',
        border: 'none',
        borderRadius: '6px',
        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
      }}
    >
      Suiv. ▶
    </button>
  </div>
)}

      
      {showConfirmation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h4 style={styles.modalTitle}>Confirmer la suppression</h4>
            <p style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.
            </p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.modalCancelButton}
                onClick={cancelDelete}
              >
                Annuler
              </button>
              <button 
                style={styles.modalConfirmButton}
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default OffreList;