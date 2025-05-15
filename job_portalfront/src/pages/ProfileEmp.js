import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Mail, Map, FileText, AlertCircle, Loader2, Edit2, Camera, Check, Calendar, Globe, Phone } from 'lucide-react';
import NavbarEmployeur from './NavbarEmployeur';
const ProfileEmp = () => {
  const [profile, setProfile] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const [uploadMessage, setUploadMessage] = useState('');
const [offres, setOffres] = useState([]);
const [candidatures, setCandidatures] = useState([]);

  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profil/employeur', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          }
        });
        setProfile({
            user: response.data.user,
            entreprise: response.data.employeur.entreprise,
          });
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    const checkProfileCompletion = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check-profile-completion', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          }
        });
        setProfileCompleted(response.data.profileCompleted);
      } catch (error) {
        console.error('Erreur lors de la vérification du profil:', error);
      }
    };
    const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/employeur/statistiques', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStats(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };




  const fetchOffres = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/offres', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setOffres(res.data);
  } catch (error) {
    console.error('Erreur lors du chargement des offres :', error);
  }
};

const fetchCandidatures = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/employeur/candidatures', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setCandidatures(res.data.slice(0, 2)); // les 2 derniers candidats
  } catch (error) {
    console.error('Erreur lors du chargement des candidatures :', error);
  }
};
    fetchOffres();
    fetchCandidatures();
    fetchStats();
    fetchProfile();
    checkProfileCompletion();
  }, []);
  const [stats, setStats] = useState(null);



  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // Si aucun fichier n'est sélectionné, on arrête.

    const formData = new FormData();
    formData.append('photo', file);

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/employeur/photo', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          photo_url: response.data.photo_url, 
        },
      });
      setUploadMessage('Photo téléchargée avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo:', error);
      setUploadMessage('Erreur lors du téléchargement de la photo.');
    } finally {
      setLoading(false);
    }
  };
   
  
  
  const handleEdit = () => {
    navigate('/profil/completion'); 
  };
  const styles = {
    content: {
      flex: 1,
      padding: '10px',
      background: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
      transition: 'all 0.3s ease',
            overflowY: 'auto',

    },
    container: {
      display: 'flex',
      height: '100vh',
      background: darkMode ? '#0f172a' : '#ffffff',
      transition: 'background 0.3s ease',
            overflow: 'hidden',

    },
    profilePhotoContainer: {
      position: 'relative',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
    },
    cameraIcon: {
      width: '40px',
      height: '40px',
      color: '#777',
    },
    editPhotoButton: {
      marginTop: '10px',
      backgroundColor: '#0052cc',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      cursor: 'pointer',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
    },
    editPhotoButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    uploadMessage: {
      marginTop: '10px',
      fontSize: '14px',
      color: 'green',
    },
    loadingText: {
      fontSize: '16px',
      color: '#f3c34c',
    },
  
  }

  if (profile === null) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du profile ...</p>
      </div>
    );
  }

  return (
    <div  style={styles.container}>
            <NavbarEmployeur />
            <div style={styles.content}>

      {showAlert && (
        <div className="success-alert">
          <Check className="alert-icon" />
          <span>Profil chargé avec succès!</span>
          <button 
            className="close-button" 
            onClick={() => setShowAlert(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="close-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="content-wrapper">
        <div className="header">
          <h1 className="title">Mon Profil Employeur</h1>
          <div className="title-underline"></div>
        </div>
        
        <div className="profile-grid">
          {/* Section Photo & Action Buttons */}
          <div className="sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-photo-container">
                <div className="profile-photo">
  <div className="profile-photo-inner">
    {profile?.photo_url ? (
      <img
        src={profile.photo_url}
        alt="Photo de profil"
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <Camera className="camera-icon" />
    )}
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="absolute inset-0 opacity-0 cursor-pointer"
      title="Changer la photo"
    />
  </div>
</div>
<button className="edit-photo-button" onClick={handleUploadPhoto} disabled={isUploading}>
  {isUploading ? 'Chargement...' : <Edit2 className="edit-icon" />}
</button>

{uploadMessage && <p className="upload-message">{uploadMessage}</p>}

                
                </div>
              </div>
              
              <div className="profile-details">
                <h2 className="profile-name">{profile?.user?.name}</h2>
                <p className="company-name">{profile?.entreprise?.nom}</p>
                
                <div className="profile-actions">
                  <button 
                    onClick={handleEdit}
                    className="edit-button"
                  >
                    <Edit2 className="button-icon" />
                    Modifier mon profil
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Offres publiées</p>
<p className="stat-value">{stats?.total_offres || 0}</p>                  </div>
                  <div className="stat-icon-container">
                    <FileText className="stat-icon" />
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Candidatures</p>
<p className="stat-value">{stats?.total_candidatures || 0}</p>                  </div>
                  <div className="stat-icon-container">
                    <User className="stat-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="main-content">
            {/* Tabs */}
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  className={`tab-button ${activeTab === 'profile' ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Informations
                </button>
                <button 
                  className={`tab-button ${activeTab === 'offres' ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab('offres')}
                >
                  Offres d'emploi
                </button>
                <button 
                  className={`tab-button ${activeTab === 'candidats' ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab('candidats')}
                >
                  Candidats
                </button>
              </div>
              
              {activeTab === 'profile' && (
                <div className="tab-content">
                  {profileCompleted && profile?.entreprise ? (
                    <div>                      
                      <div className="info-sections">
                        {/* Informations Personnelles */}
                        <div className="info-section">
                          <h3 className="section-title">
                            <User className="section-icon" />
                            Informations Personnelles
                          </h3>
                          
                          <div className="info-card">
                            <div className="info-grid">
                              <div className="info-item">
                                <User className="info-icon" />
                                <div>
                                  <p className="info-label">Nom</p>
                                  <p className="info-value">{profile.user.name}</p>
                                </div>
                              </div>
                              
                              <div className="info-item">
                                <Mail className="info-icon" />
                                <div>
                                  <p className="info-label">Email</p>
                                  <p className="info-value">{profile.user.email}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="info-section">
                          <h3 className="section-title">
                            <Building2 className="section-icon" />
                            Informations de l'entreprise
                          </h3>
                          
                          <div className="info-card">
                            <div className="company-header">
                              <h4 className="company-title">{profile.entreprise.nom}</h4>
                              <div className="company-description">
                                <p>{profile.entreprise.description}</p>
                              </div>
                            </div>
                            
                            <div className="company-details">
                              <div className="info-item">
                                <Map className="info-icon" />
                                <div>
                                  <p className="info-label">Adresse</p>
                                  <p className="info-value">{profile.entreprise.adresse}</p>
                                </div>
                              </div>
                              
                              <div className="info-item">
                                <Phone className="info-icon" />
                                <div>
                                  <p className="info-label">Téléphone</p>
                                  <p className="info-value">{profile.entreprise.telephone}</p>
                                </div>
                              </div>
                              
                              <div className="info-item">
                                <Globe className="info-icon" />
                                <div>
                                  <p className="info-label">Site Web</p>
                                  <p className="info-value">{profile.entreprise.siteWeb}</p>
                                </div>
                              </div>
                              
                              <div className="info-item">
                                <Calendar className="info-icon" />
                                <div>
                                  <p className="info-label">Année de fondation</p>
                                  <p className="info-value">{profile.entreprise.fondee}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="incomplete-profile">
                      <div className="alert-icon-container">
                        <div className="alert-circle">
                          <AlertCircle className="alert-icon" />
                        </div>
                        <div className="alert-badge">
                          !
                        </div>
                      </div>
                      
                      <h3 className="alert-title">Profil incomplet</h3>
                      <p className="alert-message">
                        Pour accéder à toutes les fonctionnalités de notre plateforme, veuillez compléter les informations de votre profil.
                      </p>
                      
                      <button 
                        onClick={handleEdit}
                        className="complete-profile-button"
                      >
                        <Edit2 className="button-icon" />
                        Compléter mon profil
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'offres' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h3 className="tab-title">Vos offres d'emploi</h3>
                    <button className="publish-button">
                      Publier une offre
                    </button>
                  </div>
                  
                  <div className="jobs-list">
                    {offres.slice(0, 2).map((offre) => (
    <div className="job-card" key={offre.id}>
      <h4 className="job-title">{offre.titre}</h4>
      <div className="job-meta">
        <p className="job-location">{offre.localisation} • {offre.typeContrat || 'CDI'}</p>
        <span className="job-status">Active</span>
      </div>
      <div className="job-footer">
        <span className="application-count">{offre.statistiques?.nombreCandidatures || 0} candidatures</span>
        <button className="view-details-button">Voir détails</button>
      </div>
    </div>
  ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'candidats' && (
                <div className="tab-content">
                  <h3 className="tab-title">Candidats récents</h3>
                  
                  <div className="candidates-list">
                    {candidatures.map((cand) => (
    <div className="candidate-card" key={cand.id}>
      <div className="candidate-info">
        <div className="candidate-avatar">
          {cand.candidat?.user?.name?.slice(0, 2).toUpperCase() || '??'}
        </div>
        <div className="candidate-details">
          <h4 className="candidate-name">{cand.candidat?.user?.name}</h4>
          <p className="candidate-position">{cand.offre_emploi?.titre}</p>
        </div>
        <div className="candidate-actions">
          <button className="view-cv-button">Voir CV</button>
        </div>
      </div>
    </div>
  ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>



 
  );
};
const style = document.createElement('style');
style.textContent = `
  /* Variables globales */
  :root {
    --primary-color: #3b82f6;
    --primary-dark: #2563eb;
    --primary-light: #dbeafe;
    --text-dark: #1f2937;
    --text-medium: #4b5563;
    --text-light: #6b7280;
    --bg-light: #f0f9ff;
    --white: #ffffff;
    --success: #10b981;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  }

  /* Base */
  .profile-container {
    min-height: 100vh;
    background-color: var(--bg-light);
    padding: 2rem 1rem;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header */
  .header {
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--primary-dark);
  }

  .title-underline {
    height: 4px;
    width: 6rem;
    background-color: var(--primary-color);
    margin-top: 0.5rem;
    border-radius: 9999px;
  }

  /* Layout */
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .profile-grid {
      grid-template-columns: 300px 1fr;
    }
  }

  /* Sidebar */
  .profile-card {
    background-color: var(--white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }

  .profile-header {
    background: linear-gradient(to bottom right, #60a5fa, #2563eb);
    padding: 1rem;
    display: flex;
    justify-content: center;
  }

  .profile-photo-container {
    position: relative;
    width: 8rem;
    height: 8rem;
    margin-bottom: -4rem;
  }

  .profile-photo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--white);
    padding: 4px;
  }

  .profile-photo-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .camera-icon {
    width: 3rem;
    height: 3rem;
    color: var(--primary-color);
  }

  .edit-photo-button {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: var(--primary-dark);
    border-radius: 50%;
    padding: 0.5rem;
    color: var(--white);
    box-shadow: var(--shadow-sm);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .edit-photo-button:hover {
    background-color: var(--primary-color);
  }

  .edit-icon {
    width: 1rem;
    height: 1rem;
  }

  .profile-details {
    padding: 5rem 1.5rem 1.5rem;
  }

  .profile-name {
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: var(--text-dark);
  }

  .company-name {
    color: var(--primary-color);
    text-align: center;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .profile-actions {
    margin-top: 2rem;
  }

  .edit-button {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-dark);
    color: var(--white);
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, transform 0.3s;
  }

  .edit-button:hover {
    background-color: var(--primary-color);
    transform: translateY(-1px);
  }

  .button-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }

  .edit-button:hover .button-icon {
    animation: pulse 1.5s infinite;
  }

  /* Stats */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .stat-card {
    background-color: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1rem;
    transition: box-shadow 0.3s;
  }

  .stat-card:hover {
    box-shadow: var(--shadow-md);
  }

  .stat-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-light);
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-dark);
  }

  .stat-icon-container {
    background-color: var(--primary-light);
    padding: 0.5rem;
    border-radius: var(--radius-md);
  }

  .stat-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--primary-color);
  }

  /* Main Content */
  .tabs-container {
    background-color: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .tabs-header {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
  }

  .tab-button {
    flex: 1;
    padding: 1rem;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-light);
    transition: color 0.3s;
  }

  .tab-button:hover {
    color: var(--primary-color);
  }

  .tab-button.active-tab {
    color: var(--primary-dark);
    border-bottom: 2px solid var(--primary-dark);
  }

  .tab-content {
    padding: 1.5rem;
  }

  /* Info Sections */
  .info-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .section-icon {
    margin-right: 0.5rem;
    color: var(--primary-dark);
    width: 1.25rem;
    height: 1.25rem;
  }

  .info-card {
    background-color: var(--primary-light);
    border-radius: var(--radius-lg);
    padding: 1rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .info-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .info-item {
    display: flex;
    align-items: flex-start;
  }

  .info-icon {
    color: var(--primary-color);
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }

  .info-label {
    font-size: 0.75rem;
    color: var(--text-light);
  }

  .info-value {
    font-weight: 500;
    color: var(--text-dark);
  }

  /* Company Details */
  .company-header {
    margin-bottom: 1.5rem;
  }

  .company-title {
    font-weight: 600;
    color: #1e40af;
    font-size: 1.125rem;
  }

  .company-description {
    margin-top: 0.5rem;
    color: var(--text-medium);
  }

  .company-details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .company-details {
      grid-template-columns: 1fr 1fr;
      column-gap: 2rem;
      row-gap: 1rem;
    }
  }

  /* Incomplete Profile */
  .incomplete-profile {
    padding: 3rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .alert-icon-container {
    position: relative;
  }

  .alert-circle {
    width: 6rem;
    height: 6rem;
    background-color: var(--primary-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .alert-icon {
    color: var(--primary-dark);
    width: 2.5rem;
    height: 2.5rem;
  }

  .alert-badge {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    width: 2rem;
    height: 2rem;
    background-color: #eab308;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-weight: 700;
    animation: pulse 2s infinite;
  }

  .alert-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-top: 1.5rem;
  }

  .alert-message {
    color: var(--text-medium);
    text-align: center;
    max-width: 28rem;
    margin-top: 0.5rem;
  }

  .complete-profile-button {
    margin-top: 1.5rem;
    padding: 0.75rem 2rem;
    background-color: var(--primary-dark);
    color: var(--white);
    border-radius: var(--radius-md);
    border: none;
    box-shadow: var(--shadow-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;
  }

  .complete-profile-button:hover {
    background-color: var(--primary-color);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  /* Offres tab */
  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .tab-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
  }

  .publish-button {
    padding: 0.5rem 1rem;
    background-color: var(--primary-dark);
    color: var(--white);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .publish-button:hover {
    background-color: var(--primary-color);
  }

  .jobs-list, .candidates-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .job-card {
    background-color: var(--primary-light);
    border-radius: var(--radius-lg);
    padding: 1rem;
    transition: box-shadow 0.3s;
  }

  .job-card:hover {
    box-shadow: var(--shadow-md);
  }

  .job-title {
    font-weight: 500;
    color: #1e40af;
  }

  .job-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .job-location {
    color: var(--text-medium);
    font-size: 0.875rem;
  }

  .job-status {
    color: var(--success);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .job-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .application-count {
    font-size: 0.875rem;
    color: var(--text-light);
  }

  .view-details-button {
    color: var(--primary-dark);
    background: none;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s;
  }

  .view-details-button:hover {
    color: var(--primary-color);
  }

  /* Candidats tab */
  .candidate-card {
    background-color: var(--primary-light);
    border-radius: var(--radius-lg);
    padding: 1rem;
    transition: box-shadow 0.3s;
  }

  .candidate-card:hover {
    box-shadow: var(--shadow-md);
  }

  .candidate-info {
    display: flex;
    align-items: center;
  }

  .candidate-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #bfdbfe;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-dark);
    font-weight: 700;
  }

  .candidate-details {
    margin-left: 1rem;
  }

  .candidate-name {
    font-weight: 500;
    color: #1e40af;
  }

  .candidate-position {
    color: var(--text-medium);
    font-size: 0.875rem;
  }

  .candidate-actions {
    margin-left: auto;
  }

  .view-cv-button {
    padding: 0.25rem 0.75rem;
    background-color: #dbeafe;
    color: var(--primary-dark);
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .view-cv-button:hover {
    background-color: #bfdbfe;
  }

  /* Alert */
  .success-alert {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background-color: var(--success);
    color: var(--white);
    padding: 1rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    max-width: 20rem;
    animation: slideIn 0.5s ease-out forwards;
  }

  .alert-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }

  .close-button {
    margin-left: 0.5rem;
    background: none;
    border: none;
    color: var(--white);
    cursor: pointer;
  }

  .close-button:hover {
    color: #f0fdf4;
  }

  .close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Animations */
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--gray-light);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
`;
document.head.appendChild(style);

export default ProfileEmp;
