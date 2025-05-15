import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavbarEmployeur from './NavbarEmployeur';
const CandidaturesParOffre = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState('dateSoumission');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/employeur/candidatures', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCandidatures(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des candidatures :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get('http://localhost:8000/api/employeur/candidatures', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCandidatures(response.data);
      setTimeout(() => setIsRefreshing(false), 600);
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures :', error);
      setIsRefreshing(false);
    }
  };

  const handleStatutChange = async (id, statut) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/candidatures/${id}/statut`,
        { statut },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updated = response.data.candidature;

      setCandidatures((prev) =>
        prev.map((cand) =>
          cand.id === id
            ? {
                ...cand,
                statut: updated.statut,
                conversation_id: updated.conversation_id ?? cand.conversation_id,
              }
            : cand
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort candidatures
  let filteredCandidatures = candidatures.filter(cand => 
    (cand.offre_emploi.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cand.candidat?.user?.name && cand.candidat.user.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Sort candidatures
  filteredCandidatures = [...filteredCandidatures].sort((a, b) => {
    let compareA, compareB;
    
    switch(sortField) {
      case 'titre':
        compareA = a.offre_emploi.titre.toLowerCase();
        compareB = b.offre_emploi.titre.toLowerCase();
        break;
      case 'candidat':
        compareA = a.candidat?.user?.name?.toLowerCase() || '';
        compareB = b.candidat?.user?.name?.toLowerCase() || '';
        break;
      case 'dateSoumission':
        compareA = new Date(a.dateSoumission);
        compareB = new Date(b.dateSoumission);
        break;
      case 'statut':
        compareA = a.statut;
        compareB = b.statut;
        break;
      default:
        compareA = new Date(a.dateSoumission);
        compareB = new Date(b.dateSoumission);
    }

    if (sortDirection === 'asc') {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCandidatures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCandidatures.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Custom Status Badge
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon, text;
    
    switch(status) {
      case 'approuve':
        bgColor = '#dcfce7';
        textColor = '#16a34a';
        icon = '✓';
        text = 'Approuvé';
        break;
      case 'rejete':
        bgColor = '#fee2e2';
        textColor = '#dc2626';
        icon = '✕';
        text = 'Rejeté';
        break;
      default:
        bgColor = '#fef9c3';
        textColor = '#ca8a04';
        icon = '⏱';
        text = 'En attente';
    }
    
    return (
      <span className="status-badge" style={{ backgroundColor: bgColor, color: textColor }}>
        <span className="status-icon">{icon}</span>
        {text}
      </span>
    );
  };
   
  return (
    <div className="page-wrapper">
    <NavbarEmployeur />
    <div className="candidatures-container">
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des candidatures...</p>
        </div>
      ) : (
        <>
          <div className="candidatures-header">
            <div className="candidatures-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2>Candidatures reçues</h2>
            </div>
            <div className="actions">
              <div className="search-container">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
  type="text"
  placeholder="Rechercher une offre ou un candidat..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }}
  className="candidatures-search-input"
/>
              </div>
              <button className={`candidatures-refresh-button ${isRefreshing ? 'refreshing' : ''}`}
  onClick={refreshData}
  disabled={isRefreshing}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="refresh-icon">
                  <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.51 9.00001C4.01717 7.56645 4.87913 6.2885 6.01547 5.27543C7.1518 4.26236 8.52547 3.54524 10.0083 3.1873C11.4911 2.82935 13.0348 2.84207 14.5091 3.22425C15.9834 3.60642 17.3421 4.34481 18.46 5.38L23 10M1 14L5.54 18.62C6.65792 19.6552 8.01657 20.3936 9.49087 20.7758C10.9652 21.1579 12.5089 21.1707 13.9917 20.8127C15.4745 20.4548 16.8482 19.7376 17.9845 18.7246C19.1209 17.7115 19.9828 16.4336 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </button>
            </div>
          </div>

          {candidatures.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Aucune candidature reçue.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                {filteredCandidatures.length === 0 && !loading && searchTerm && (
  <div className="no-results">
    <svg width="48" height="48" fill="none" stroke="#1e40af" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553 4.553M19.553 10L15 14.553M9 10l-4.553 4.553M4.447 10L9 14.553" />
    </svg>
    <h3>Aucun résultat</h3>
    <p>Aucune candidature ne correspond à votre recherche.</p>
  </div>
)}
                <table className="candidatures-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('titre')} className={sortField === 'titre' ? 'sorted' : ''}>
                        <div className="th-content">
                          <span>Offre</span>
                          {sortField === 'titre' && (
                            <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('candidat')} className={sortField === 'candidat' ? 'sorted' : ''}>
                        <div className="th-content">
                          <span>Candidat</span>
                          {sortField === 'candidat' && (
                            <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('dateSoumission')} className={sortField === 'dateSoumission' ? 'sorted' : ''}>
                        <div className="th-content">
                          <span>Date de soumission</span>
                          {sortField === 'dateSoumission' && (
                            <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('statut')} className={sortField === 'statut' ? 'sorted' : ''}>
                        <div className="th-content">
                          <span>Statut</span>
                          {sortField === 'statut' && (
                            <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((cand, index) => (
                      <tr key={cand.id} className="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td>{cand.offre_emploi.titre}</td>
                        <td>
                          <Link to={`/candidats/${cand.candidat.id}`} className="candidat-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="user-icon">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {cand.candidat?.user?.name}
                          </Link>
                        </td>
                        <td>{new Date(cand.dateSoumission).toLocaleDateString()}</td>
                        <td>
                          <StatusBadge status={cand.statut} />
                        </td>
                        <td>
                          {cand.statut === 'en_attente' && (
                            <div className="action-buttons">
                              <button onClick={() => handleStatutChange(cand.id, 'approuve')} className="approve-button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Approuver
                              </button>
                              <button onClick={() => handleStatutChange(cand.id, 'rejete')} className="reject-button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Rejeter
                              </button>
                            </div>
                          )}
                          {cand.statut === 'approuve' && (
                            <div className="status-actions">
                              <span className="status-approved">Approuvé</span>
                              {cand.conversation_id && (
                                <Link to={`/messagerie/${cand.conversation_id}`} className="message-button">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Messagerie
                                </Link>
                              )}
                            </div>
                          )}
                          {cand.statut === 'rejete' && (
                            <span className="status-rejected">Rejeté</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`page-button prev ${currentPage === 1 ? 'disabled' : ''}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => {
                    // Show first page, last page, current page, and one page before and after current
                    if (
                      i === 0 ||
                      i === totalPages - 1 ||
                      i === currentPage - 1 ||
                      i === currentPage - 2 ||
                      i === currentPage
                    ) {
                      return (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (
                      (i === 1 && currentPage > 3) ||
                      (i === totalPages - 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={i} className="page-ellipsis">...</span>;
                    }
                    return null;
                  })}
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`page-button next ${currentPage === totalPages ? 'disabled' : ''}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    

      <style jsx>{`

      .page-wrapper {
        display: flex;
        height: 100vh;
        overflow: hidden;
        background-color: #f9fafb;
      }

      .candidatures-container {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 62, 130, 0.1);
        animation: fadeIn 0.5s ease;
        max-width: 100%;
      }
        .candidatures-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 62, 130, 0.1);
          animation: fadeIn 0.5s ease;
          
        }
     

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .candidatures-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e9f4;
}

.candidatures-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.candidatures-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}

        .icon {
          color: #3b82f6;
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .search-container {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

       .candidatures-search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  font-size: 0.9rem;
  color: #1e293b;
  transition: all 0.2s ease;
}

.candidatures-search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background-color: #fff;
}

.candidatures-refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #dbeafe;
  color: #1e40af;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.candidatures-refresh-button:hover {
  background-color: #bfdbfe;
}

.candidatures-refresh-button.refreshing {
  pointer-events: none;
  opacity: 0.8;
}

        .refresh-button:active {
          transform: scale(0.95);
        }

        .refresh-button.refreshing {
          pointer-events: none;
          opacity: 0.8;
        }

        .refresh-icon {
          transition: transform 0.5s ease;
        }

        .refreshing .refresh-icon {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          background-color: #f8fafc;
          border-radius: 8px;
          color: #64748b;
        }

        .empty-state svg {
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .empty-state p {
          font-size: 1.1rem;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .candidatures-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 8px;
          overflow: hidden;
          font-size: 0.95rem;
        }

        .candidatures-table thead {
          background-color: #1e40af;
          color: white;
        }

        .candidatures-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .candidatures-table th:hover {
          background-color: #1e3a8a;
        }

        .candidatures-table th.sorted {
          background-color: #1e3a8a;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-indicator {
          font-size: 0.8rem;
        }

        .candidatures-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-row {
          background-color: #fff;
          transition: background-color 0.2s ease;
          animation: slideIn 0.3s ease forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .table-row:hover {
          background-color: #f0f7ff;
        }

        .candidat-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .candidat-link:hover {
          color: #1e40af;
          text-decoration: underline;
        }

        .user-icon {
          color: currentColor;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-icon {
          font-size: 0.9rem;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .approve-button, .reject-button, .message-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .approve-button {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .approve-button:hover {
          background-color: #bbf7d0;
        }

        .reject-button {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .reject-button:hover {
          background-color: #fecaca;
        }

        .message-button {
          background-color: #dbeafe;
          color: #2563eb;
          text-decoration: none;
        }
               .message-button:hover {
          background-color: #bfdbfe;
        }

        .status-approved, .status-rejected {
          font-size: 0.85rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 999px;
          display: inline-block;
        }

        .status-approved {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .status-rejected {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .page-button, .page-number {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #e2e8f0;
          color: #1e293b;
        }

        .page-button:hover, .page-number:hover {
          background-color: #cbd5e1;
        }

        .page-button.disabled, .page-number.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-number.active {
          background-color: #2563eb;
          color: white;
        }

        .page-ellipsis {
          padding: 6px 12px;
          font-size: 0.9rem;
          color: #9ca3af;
        }
.no-results {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f1f5f9;
  border-radius: 12px;
  margin-top: 2rem;
  animation: fadeIn 0.3s ease;
  color: #1e293b;
}

.no-results svg {
  margin-bottom: 1rem;
  color: #1e40af;
}

.no-results h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #64748b;
  font-size: 0.95rem;
}

        .loading-container {
           flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Plein écran */
  background-color: #f9fafb;
  text-align: center;
        }

        .loader {
          width: 3rem;
          height: 3rem;
          border: 4px solid #3b82f6;
          border-top-color: transparent;
          border-radius: 50%;
          margin: 0 auto 1rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default CandidaturesParOffre;