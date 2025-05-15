import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';

const EmployeurProfile = () => {
  const { id } = useParams();
  const [employeur, setEmployeur] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/employeurs/${id}`)
      .then(res => setEmployeur(res.data))
      .catch(err => {
        console.error(err);
        setError("❌ Impossible de charger le profil de l'employeur.");
      });
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!employeur) return <div>Chargement...</div>;

  const { user, entreprise } = employeur;

  return (
    <div className="container mt-4">
      <h2 className="text-primary fw-bold">👤 Profil de l'employeur</h2>
      <p><strong>Nom :</strong> {user?.name || 'N/A'}</p>
      <p><strong>Email :</strong> {user?.email || 'N/A'}</p>

      {entreprise && (
        <>
          <h4 className="mt-3">🏢 Informations sur l'entreprise</h4>
          <p><strong>Nom :</strong> {entreprise.nom}</p>
          <p><strong>Description :</strong> {entreprise.description}</p>
          <p><strong>Adresse :</strong> {entreprise.adresse}</p>
        </>
      )}
    </div>
  );
};

export default EmployeurProfile;
