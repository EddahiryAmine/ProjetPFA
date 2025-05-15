import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, LogOut, Bell, Settings, Moon, Sun , } from 'lucide-react';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext"; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaEdit, FaTrash, FaBriefcase, FaPlus, FaSearch, FaPaperPlane, FaChartBar } from 'react-icons/fa';

function NavbarEmployeur() {
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
const activeLink = location.pathname;


  
  
  
  const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    logout(); 
    navigate('/');
  } catch (error) {
    console.error("Erreur de déconnexion :", error);
  }
};


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleHover = (link) => {
    setHoveredLink(link);
  };

  const handleLeave = () => {
    setHoveredLink(null);
  };

  
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('activeLink', activeLink);
  }, [activeLink]);

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      background: darkMode ? '#0f172a' : '#ffffff',
      transition: 'background 0.3s ease',
    },
    navbar: {
      width: '280px',
      height: '100%',
      background: darkMode ? '#1e293b' : '#f8fafc',
      borderRight: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    logoSection: {
      padding: '0 24px 24px 24px',
      borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
    },
    logoIcon: {
      padding: '10px',
      background: darkMode ? '#3b82f6' : '#dbeafe',
      borderRadius: '12px',
      color: darkMode ? '#ffffff' : '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(37, 99, 235, 0.15)',
      transition: 'all 0.3s ease',
    },
    navSection: {
      flex: 1,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    navLink: (isActive, isHovered) => ({
      padding: '12px 16px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: isActive 
        ? darkMode ? '#3b82f6' : '#dbeafe' 
        : isHovered 
          ? darkMode ? '#334155' : '#f1f5f9' 
          : 'transparent',
      color: isActive 
        ? darkMode ? '#ffffff' : '#2563eb' 
        : darkMode ? '#cbd5e1' : '#64748b',
      fontWeight: isActive ? '600' : '500',
      boxShadow: isActive 
        ? darkMode ? '0 4px 8px rgba(59, 130, 246, 0.3)' : '0 4px 8px rgba(37, 99, 235, 0.1)' 
        : 'none',
      transition: 'all 0.3s ease',
    }),
    linkText: {
      fontSize: '16px',
      transition: 'all 0.3s ease',
    },
    linkIcon: (isActive) => ({
      padding: '8px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive 
        ? darkMode ? '#60a5fa' : '#bfdbfe' 
        : 'transparent',
      color: isActive 
        ? darkMode ? '#ffffff' : '#2563eb' 
        : darkMode ? '#cbd5e1' : '#64748b',
      transition: 'all 0.3s ease',
    }),
    hoverEffect: (isHovered) => ({
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '4px',
      backgroundColor: darkMode ? '#3b82f6' : '#60a5fa',
      transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.3s ease',
    }),
    rippleEffect: (isActive) => ({
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: isActive ? '300px' : '0',
      height: isActive ? '300px' : '0',
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(37, 99, 235, 0.08)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.6s ease-out',
      opacity: isActive ? 0 : 1,
    }),
    badge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#ef4444',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: 'bold',
      marginLeft: 'auto',
    },
    indicator: (isActive) => ({
      position: 'absolute',
      left: '0',
      width: '4px',
      height: isActive ? '50%' : '0%',
      backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
      borderRadius: '0 4px 4px 0',
      transform: 'translateY(-50%)',
      top: '50%',
      transition: 'height 0.3s ease',
    }),
    logoutSection: {
      padding: '16px 24px',
      borderTop: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    logoutButton: (isHovered) => ({
      padding: '12px 16px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      background: isHovered 
        ? darkMode ? '#b91c1c' : '#fee2e2' 
        : darkMode ? '#7f1d1d' : '#fef2f2',
      color: darkMode ? '#ffffff' : '#b91c1c',
      fontWeight: '500',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }),
    logoutIcon: {
      padding: '8px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode ? '#b91c1c' : '#fecaca',
      color: darkMode ? '#ffffff' : '#b91c1c',
      transition: 'all 0.3s ease',
    },
    themeToggle: {
      padding: '8px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#cbd5e1' : '#64748b',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    content: {
      flex: 1,
      padding: '24px',
      background: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#0f172a',
      transition: 'all 0.3s ease',
    },
    entranceAnimation: {
      opacity: isAnimating ? 0 : 1,
      transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
      transition: 'all 0.5s ease',
    },
  };

  return (
    <div >
      <nav style={{...styles.navbar, ...styles.entranceAnimation}}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Briefcase size={24} />
            </div>
            <span>JobPortal</span>
          </div>
          <button 
            style={styles.themeToggle}
            onClick={toggleDarkMode}
            aria-label="Changer de thème"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div style={styles.navSection}>
      <Link 
        to="/employeur"
        style={styles.navLink(activeLink === '/employeur', hoveredLink === '/employeur')}
        onMouseEnter={() => handleHover('/employeur')}
        onMouseLeave={handleLeave}
      >
        <div style={styles.indicator(activeLink === '/employeur')} />
        <div style={styles.rippleEffect(isAnimating && activeLink === '/employeur')} />
        <div style={styles.linkIcon(activeLink === '/employeur')}>
          <Home size={22} />
        </div>
        <span style={styles.linkText}>Accueil</span>
        <div style={styles.hoverEffect(hoveredLink === '/employeur')} />
      </Link>

      <Link 
        to="/profil"
        style={styles.navLink(activeLink === '/profil', hoveredLink === '/profil')}
        onMouseEnter={() => handleHover('/profil')}
        onMouseLeave={handleLeave}
      >
        <div style={styles.indicator(activeLink === '/profil')} />
        <div style={styles.rippleEffect(isAnimating && activeLink === '/profil')} />
        <div style={styles.linkIcon(activeLink === '/profil')}>
          <User size={22} />
        </div>
        <span style={styles.linkText}>Mon Profil</span>
        <div style={styles.hoverEffect(hoveredLink === '/profil')} />
      </Link>

      <Link 
        to="/employeur/offres"
        style={styles.navLink(activeLink === '/employeur/offres', hoveredLink === '/employeur/offres')}
        onMouseEnter={() => handleHover('/employeur/offres')}
        onMouseLeave={handleLeave}
      >
        <div style={styles.indicator(activeLink === '/employeur/offres')} />
        <div style={styles.rippleEffect(isAnimating && activeLink === '/employeur/offres')} />
        <div style={styles.linkIcon(activeLink === '/employeur/offres')}>
          <FaBriefcase size={22} />
        </div>
        <span style={styles.linkText}>Mes offres d'emplois </span>
        <div style={styles.hoverEffect(hoveredLink === '/employeur/offres')} />
      </Link>


      <Link 
        to="/employeur/candidatures"
        style={styles.navLink(activeLink === '/employeur/candidatures', hoveredLink === '/employeur/candidatures')}
        onMouseEnter={() => handleHover('/employeur/candidatures')}
        onMouseLeave={handleLeave}
      >
        <div style={styles.indicator(activeLink === '/employeur/candidatures')} />
        <div style={styles.rippleEffect(isAnimating && activeLink === '/employeur/candidatures')} />
        <div style={styles.linkIcon(activeLink === '/employeur/candidatures')}>
          <FaPaperPlane size={22} />
        </div>
        <span style={styles.linkText}>Candidatures </span>
        <div style={styles.hoverEffect(hoveredLink === '/employeur/candidatures')} />
      </Link>



      <Link 
        to="/employeur/statistiques"
        style={styles.navLink(activeLink === '/employeur/statistiques', hoveredLink === '/employeur/statistiques')}
        onMouseEnter={() => handleHover('/employeur/statistiques')}
        onMouseLeave={handleLeave}
      >
        <div style={styles.indicator(activeLink === '/employeur/statistiques')} />
        <div style={styles.rippleEffect(isAnimating && activeLink === '/employeur/statistiques')} />
        <div style={styles.linkIcon(activeLink === '/employeur/statistiques')}>
          <FaChartBar size={22} />
        </div>
        <span style={styles.linkText}>Statistiques </span>
        <div style={styles.hoverEffect(hoveredLink === '/employeur/statistiques')} />
      </Link>
    </div>

       <div style={styles.logoutSection}>
       <button
  onClick={handleLogout}
  onMouseEnter={() => setHoveredLink('logout')}
  onMouseLeave={handleLeave}
  style={styles.logoutButton(hoveredLink === 'logout')}
>
  <div style={styles.logoutIcon}><LogOut size={20} /></div>
  Déconnexion
</button>
</div>
</nav>

      
    </div>
  );
}

export default NavbarEmployeur;
