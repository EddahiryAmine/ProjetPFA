import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaGraduationCap, 
  FaGlobe, 
  FaListUl, 
  FaDownload, 
  FaFile,
  FaUser,
  FaArrowLeft,
  FaPencilAlt,
  FaBriefcase,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './profile.css';

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/candidat/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le profil.");
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (error) return (
    <div className="error-container">
      <div className="error-message">
        <FaUser className="error-icon" />
        <p>{error}</p>
        <button onClick={() => navigate('/candidathome')} className="return-btn">
          <FaArrowLeft /> Retour à l'accueil
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="loader-container">
      <div className="profile-loader">
        <div className="loader-circle"></div>
        <p>Chargement du profil...</p>
      </div>
    </div>
  );

  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="profile-page">
      

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-headerrr">
            <div className="profile-coverrr"></div>
            <div className="profile-avatarrr">
              {initials}
            </div>
            <h1 className="profile-name">
              {profile.name}
            </h1>
            <p className="profile-title">{profile.titre_diplome || 'Candidat'}</p>
            
            <div className="profile-quick-info">
              <div className="info-badge">
                <FaBriefcase />
                <span>{profile.titre_diplome || 'Non spécifié'}</span>
              </div>
              <div className="info-badge">
                <FaMapMarkerAlt />
                <span>{profile.location || 'France'}</span>
              </div>
            </div>
          </div>

          <div className="profile-body">
            <div className="profile-section">
              <h2>
                <FaUser className="section-icon" />
                Informations personnelles
              </h2>
              <div className="info-card">
                <div className="info-item">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p>{profile.email}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FaGraduationCap />
                  </div>
                  <div>
                    <h3>Diplôme</h3>
                    <p>{profile.titre_diplome || 'Non renseigné'}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FaGlobe />
                  </div>
                  <div>
                    <h3>Portfolio</h3>
                    {profile.portfolio_link ? (
                      <a href={profile.portfolio_link} target="_blank" rel="noreferrer" className="portfolio-link">
                        Voir le portfolio <span>→</span>
                      </a>
                    ) : (
                      <p>Non renseigné</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>
                <FaListUl className="section-icon" />
                Préférences
              </h2>
              <div className="info-card">
                <div className="preferences-container">
                  {Array.isArray(profile.preferences) && profile.preferences.length > 0 ? (
                    profile.preferences.map((pref, i) => (
                      <div key={i} className="preference-tag">
                        {pref}
                      </div>
                    ))
                  ) : (
                    <p className="no-preferences">Aucune préférence renseignée</p>
                  )}
                </div>
              </div>
            </div>

            {profile.cv_url && (
              <div className="profile-section cv-section">
                <h2>
                  <FaFile className="section-icon" />
                  Curriculum Vitae
                </h2>
                <div className="cv-preview">
                  <div className="cv-document">
                    <div className="cv-header">
                      <FaFile className="cv-icon" />
                      <div className="cv-title">CV - {profile.name}</div>
                    </div>
                    <div className="cv-content">
                      <div className="cv-line"></div>
                      <div className="cv-line short"></div>
                      <div className="cv-line medium"></div>
                      <div className="cv-line"></div>
                      <div className="cv-line short"></div>
                    </div>
                  </div>
                  <a href={profile.cv_url} download className="download-cv-btn">
                    <FaDownload /> Télécharger
                  </a>
                </div>
              </div>
            )}

            <div className="profile-actions">
              <button className="btn edit-btn" onClick={() => navigate('/modifier-profil')}>
                <FaPencilAlt /> Modifier le profil
              </button>
              <button className="btn back-btn" onClick={() => navigate('/candidathome')}>
                <FaArrowLeft /> Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;