import React, { useState, useEffect } from "react";
import { useNavigate , Link } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import axios from "axios";
import { 
  Home, 
  User, 
  Menu, 
  X, 
  Briefcase, 
  LogOut, 
  Bell, 
  Search, 
  Zap, 
  ChevronDown ,
  FileText
} from "lucide-react";
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Simuler des notifications
  
  // Effet pour détecter le scroll et mettre à jour la barre de progression
  useEffect(() => {
    const handleScroll = () => {
      // Mettre à jour l'état scrolled
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Mettre à jour la barre de progression
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      const progressBar = document.querySelector('.scroll-progress-bar');
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
        
        // Ajouter un effet de pulsation lorsque la barre se remplit
        if (scrollPercent > 95) {
          progressBar.style.animation = 'pulse 2s infinite';
        } else {
          progressBar.style.animation = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const goHome = () => {
    if (user?.role === "candidat") navigate("/candidathome");
    else if (user?.role === "employeur") navigate("/employeur");
    setOpen(false);
    setActiveLink("home");
  };

  const goToProfile = () => {
    navigate("/profilCandidat");
    setOpen(false);
    setActiveLink("profile");
    setShowProfileMenu(false);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('/logout');
    } catch (err) {
      console.warn("Erreur de logout :", err);
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };
  
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("candidathome") || path.includes("employeur")) {
      setActiveLink("home");
    } else if (path.includes("profilCandidat")) {
      setActiveLink("profile");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && e.target.closest('.nav-container') === null) {
        setOpen(false);
      }
      
      if (showProfileMenu && !e.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, showProfileMenu]);

  return (
    <>
      <nav className={`nav-container ${scrolled ? 'scrolled' : ''} ${searchOpen ? 'search-active' : ''}`}>
        {/* SVG Gradient definitions */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
        
       <div className="nav-inner">
  <Link to="/candidathome" className="nav-left">
    <div className="nav-logo">
      <Briefcase className="logo-icon" />
      <span className="logo-text">Job<span className="accent">Portal</span></span>
    </div>
  </Link>

          <div className="nav-center">
            <div className={`search-bar ${searchOpen ? 'active' : ''}`}>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher des offres..." 
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
              {searchOpen && (
                <div className="search-suggestions">
                  <div className="suggestion-heading">Recherches populaires</div>
                  <div className="suggestion-item">
                    <Zap size={14} />
                    <span>Développeur React</span>
                  </div>
                  <div className="suggestion-item">
                    <Zap size={14} />
                    <span>Marketing Digital</span>
                  </div>
                  <div className="suggestion-item">
                    <Zap size={14} />
                    <span>UX/UI Designer</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`nav-links ${open ? "open" : ""}`}>
            <div className="nav-link-wrapper">
              <div className={`nav-links ${open ? "open" : ""}`}>
  <div className="nav-link-wrapper">
    <Link 
      to="/mes-candidatures" 
      className={`nav-link ${activeLink === "home" ? "active" : ""}`}
    >
      <div className="nav-link-content">
<FileText className="nav-icon" size={20} />        <span>Mes candidatures</span>
      </div>
      <div className="nav-link-underline"></div>
    </Link>
  </div>
</div>


              
            </div>
            
            <div className="nav-actions">
              <div className="nav-action-item notification-btn">
                <Link to="/messages/candidat" className="notification-link">
    <Bell className="nav-icon" size={22} />
  </Link>
              </div>

              <div className="nav-action-item profile-menu-container">
                <div 
                  className="profile-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                >
                  <div className="profile-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <ChevronDown size={16} className={`chevron-icon ${showProfileMenu ? 'rotate' : ''}`} />
                </div>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="profile-info">
                        <div className="profile-name">{user?.name || "Utilisateur"}</div>
                        <div className="profile-email">{user?.email || "utilisateur@example.com"}</div>
                      </div>
                    </div>
                    
                    <div className="profile-menu-items">
                      <div className="profile-menu-item" onClick={goToProfile}>
                        <User size={16} />
                        <span>Mon Profil</span>
                      </div>
                      
                      <div className="profile-menu-divider"></div>
                      
                      <div className="profile-menu-item logout-item" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`burger-icon ${open ? "active" : ""}`} onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}>
            {open ? <X size={24} /> : <Menu size={24} />}
            <div className="burger-backdrop"></div>
          </div>
        </div>
        
        {/* Indicateur de progression de scroll */}
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar"></div>
        </div>
      </nav>

      
    </>
  );
}

export default Navbar;