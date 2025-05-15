import React, { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Briefcase, Users, CheckCircle, XCircle, Eye, TrendingUp, Calendar, Award } from 'lucide-react';
import NavbarEmployeur from './NavbarEmployeur';
const StatistiquesEmployeur = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apercu');
  
  useEffect(() => {
    const fetchStatistiques = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Statistiques globales
        const resStats = await fetch('http://localhost:8000/api/employeur/statistiques', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await resStats.json();
        setGlobalStats(statsData);
        
        // Détail par offre
        const resOffres = await fetch('http://localhost:8000/api/offres', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const offresData = await resOffres.json();
        setOffres(offresData);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistiques();
  }, []);

  // Données pour les graphiques
  const candidatureData = globalStats ? [
    { name: 'Approuvées', value: globalStats.total_approuvees, color: '#4CAF50' },
    { name: 'Rejetées', value: globalStats.total_rejetees, color: '#F44336' },
    { name: 'En attente', value: globalStats.total_candidatures - globalStats.total_approuvees - globalStats.total_rejetees, color: '#FFC107' }
  ] : [];

  const offresVuesData = offres.length > 0 ? offres.map(offre => ({
    name: offre.titre.length > 15 ? offre.titre.substring(0, 15) + '...' : offre.titre,
    vues: offre.statistiques?.nombreVues ?? 0,
    candidatures: offre.statistiques?.nombreCandidatures ?? 0
  })) : [];
  
  // Données pour le graphique d'évolution (simulées)
  const evolutionData = [
    { mois: 'Jan', candidatures: 4, vues: 20 },
    { mois: 'Fév', candidatures: 7, vues: 38 },
    { mois: 'Mar', candidatures: 5, vues: 29 },
    { mois: 'Avr', candidatures: 12, vues: 55 },
    { mois: 'Mai', candidatures: 10, vues: 62 }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
          <NavbarEmployeur />
    <div className="Stat-container">

      <div className="dashboard-header">
        <h1>Tableau de Bord Recruteur</h1>
        <p className="subheading">Statistiques et performance de vos offres d'emploi</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'apercu' ? 'active' : ''}`}
          onClick={() => setActiveTab('apercu')}>
          <TrendingUp size={16} />
          <span>Aperçu Général</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'offres' ? 'active' : ''}`}
          onClick={() => setActiveTab('offres')}>
          <Briefcase size={16} />
          <span>Par Offre</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
          onClick={() => setActiveTab('evolution')}>
          <Calendar size={16} />
          <span>Évolution</span>
        </button>
      </div>

      {activeTab === 'apercu' && (
        <div className="dashboard-content">
          <div className="stats-cards">
            <div className="stats-card">
              <div className="card-icon blue">
                <Briefcase size={24} />
              </div>
              <div className="card-content">
                <h3>Offres Publiées</h3>
                <p className="card-value">{globalStats?.total_offres || 0}</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="card-icon green">
                <Users size={24} />
              </div>
              <div className="card-content">
                <h3>Candidatures Totales</h3>
                <p className="card-value">{globalStats?.total_candidatures || 0}</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="card-icon purple">
                <Eye size={24} />
              </div>
              <div className="card-content">
                <h3>Variation des Vues</h3>
                <p className={`card-value ${globalStats && globalStats.variation_vues >= 0 ? 'positive' : 'negative'}`}>
                  {globalStats ? (globalStats.variation_vues >= 0 ? '+' : '') + globalStats.variation_vues + '%' : '0%'}
                </p>
              </div>
            </div>

            <div className="stats-card">
              <div className="card-icon orange">
                <Award size={24} />
              </div>
              <div className="card-content">
                <h3>Taux de Conversion</h3>
                <p className="card-value">
                  {globalStats && globalStats.total_offres > 0 
                    ? ((globalStats.total_candidatures / globalStats.total_offres).toFixed(1)) 
                    : 0}
                </p>
                <p className="card-subtitle">candidatures/offre</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Répartition des Candidatures</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={candidatureData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {candidatureData.map((entry, index) => (
                        <Tooltip key={`tooltip-${index}`} />
                      ))}
                      {candidatureData.map((entry, index) => (
                        <Legend key={`legend-${index}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3>Vues et Candidatures par Offre</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={offresVuesData.slice(0, 5)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="vues" fill="#1E88E5" name="Vues" />
                    <Bar dataKey="candidatures" fill="#42A5F5" name="Candidatures" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offres' && (
        <div className="dashboard-content">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre de l'offre</th>
                  <th>Vues</th>
                  <th>Candidatures</th>
                  <th>Taux de conversion</th>
                  <th>Date d'expiration</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {offres.map((offre) => {
                  const vues = offre.statistiques?.nombreVues ?? 0;
                  const candidatures = offre.statistiques?.nombreCandidatures ?? 0;
                  const tauxConversion = vues > 0 ? ((candidatures / vues) * 100).toFixed(1) + '%' : '0%';
                  
                  // Vérifier si la date d'expiration est passée
                  const estExpiree = new Date(offre.dateExpiration) < new Date();
                  
                  return (
                    <tr key={offre.id}>
                      <td className="offre-titre">{offre.titre}</td>
                      <td><Eye size={14} className="icon-inline" /> {vues}</td>
                      <td><Users size={14} className="icon-inline" /> {candidatures}</td>
                      <td>{tauxConversion}</td>
                      <td>{new Date(offre.dateExpiration).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${estExpiree ? 'expired' : 'active'}`}>
                          {estExpiree ? 'Expirée' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'evolution' && (
        <div className="dashboard-content">
          <div className="chart-card full-width">
            <h3>Évolution des vues et candidatures (5 derniers mois)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={evolutionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="candidatures" stroke="#1E88E5" name="Candidatures" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="vues" stroke="#42A5F5" name="Vues" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="stats-summary">
            <div className="summary-card">
              <h3>Résumé de performance</h3>
              <ul className="summary-list">
                <li>
                  <TrendingUp size={16} className="icon-inline" />
                  <span>Croissance mensuelle moyenne des vues: <strong>+28%</strong></span>
                </li>
                <li>
                  <Users size={16} className="icon-inline" />
                  <span>Croissance des candidatures: <strong>+15%</strong></span>
                </li>
                <li>
                  <Award size={16} className="icon-inline" />
                  <span>Meilleur mois: <strong>Avril</strong> avec 12 candidatures</span>
                </li>
                <li>
                  <CheckCircle size={16} className="icon-inline" />
                  <span>Taux d'approbation: <strong>{globalStats && globalStats.total_candidatures > 0 
                    ? ((globalStats.total_approuvees / globalStats.total_candidatures) * 100).toFixed(0) + '%'
                    : '0%'}</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Variables CSS */
        :root {
          --primary-color: #0A66C2;
          --primary-light: #42A5F5;
          --primary-dark: #0D47A1;
          --success-color: #4CAF50;
          --warning-color: #FFC107;
          --danger-color: #F44336;
          --gray-light: #F5F5F5;
          --gray-medium: #E0E0E0;
          --gray-dark: #757575;
          --purple-color: #673AB7;
          --orange-color: #FF9800;
          --border-radius: 8px;
          --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }

        /* Reset et styles de base */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f9fafb;
          color: #333;
          line-height: 1.5;
        }

        /* Conteneur principal */
        .dashboard-container {
          display: flex;
        height: 100vh;
        overflow: hidden;
        background-color: #f9fafb;
        }
        .Stat-container{
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 62, 130, 0.1);
        animation: fadeIn 0.5s ease;
        max-width: 100%;
        }

        /* En-tête du tableau de bord */
        .dashboard-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--gray-medium);
        }

        .dashboard-header h1 {
          color: var(--primary-dark);
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .subheading {
          color: var(--gray-dark);
          font-size: 1rem;
        }

        /* Onglets */
        .dashboard-tabs {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--gray-medium);
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: var(--gray-dark);
          transition: var(--transition);
        }

        .tab-button:hover {
          color: var(--primary-color);
        }

        .tab-button.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }

        /* Contenu du tableau de bord */
        .dashboard-content {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Cartes de statistiques */
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stats-card {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 1rem;
          color: white;
        }

        .card-icon.blue { background-color: var(--primary-color); }
        .card-icon.green { background-color: var(--success-color); }
        .card-icon.purple { background-color: var(--purple-color); }
        .card-icon.orange { background-color: var(--orange-color); }

        .card-content h3 {
          font-size: 0.875rem;
          color: var(--gray-dark);
          margin-bottom: 0.25rem;
        }

        .card-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .card-value.positive { color: var(--success-color); }
        .card-value.negative { color: var(--danger-color); }

        .card-subtitle {
          font-size: 0.75rem;
          color: var(--gray-dark);
        }

        /* Graphiques */
        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          padding: 1.5rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .chart-card h3 {
          margin-bottom: 1rem;
          color: var(--primary-dark);
          font-size: 1.125rem;
        }

        .chart-wrapper {
          height: 250px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        /* Tableau */
        .table-container {
          overflow-x: auto;
          margin-bottom: 2rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }

        .data-table th,
        .data-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--gray-medium);
        }

        .data-table th {
          background-color: var(--gray-light);
          font-weight: 600;
          color: var(--primary-dark);
        }

        .data-table tr:hover {
          background-color: var(--gray-light);
        }

        .offre-titre {
          font-weight: 500;
          color: var(--primary-color);
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.active {
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success-color);
        }

        .status-badge.expired {
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--danger-color);
        }

        /* Résumé de performance */
        .stats-summary {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .summary-card {
          padding: 1.5rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .summary-card h3 {
          margin-bottom: 1rem;
          color: var(--primary-dark);
          font-size: 1.125rem;
        }

        .summary-list {
          list-style: none;
        }

        .summary-list li {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: var(--gray-dark);
        }

        .icon-inline {
          margin-right: 0.5rem;
          color: var(--primary-color);
        }

        .summary-list strong {
          color: #333;
        }

        /* État de chargement */
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
      `}</style>
      </div>
    </div>
  );
};

export default StatistiquesEmployeur;