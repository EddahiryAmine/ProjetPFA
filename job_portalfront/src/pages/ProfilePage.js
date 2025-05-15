import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [showEntrepriseForm, setShowEntrepriseForm] = useState(false);
  const [entreprise, setEntreprise] = useState({ nom: '', description: '', adresse: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/employeur/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setEntreprise({ ...entreprise, [e.target.name]: e.target.value });
  };

  const handleAddEntreprise = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/entreprise', entreprise, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const nouvelleEntrepriseId = response.data.id;
      await axios.put('http://localhost:8000/api/employeur/assign-entreprise', {
        entreprise_id: nouvelleEntrepriseId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Entreprise ajoutée et assignée avec succès!');
      setShowEntrepriseForm(false);
      setEntreprise({ nom: '', description: '', adresse: '' });
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'ajout de l\'entreprise');
    }
  };

  if (!profile) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Profil Employeur</h1>
      <p>Nom: {profile.user.name}</p>
      <p>Email: {profile.user.email}</p>
      <p>Entreprise ID: {profile.employeur?.entreprise_id || 'Aucune entreprise associée'}</p>

      {!showEntrepriseForm ? (
        <button onClick={() => setShowEntrepriseForm(true)}>
          Ajouter une entreprise
        </button>
      ) : (
        <form onSubmit={handleAddEntreprise}>
          <h2>Ajouter une nouvelle entreprise</h2>
          <input type="text" name="nom" placeholder="Nom" value={entreprise.nom} onChange={handleChange} required />
          <input type="text" name="description" placeholder="Description" value={entreprise.description} onChange={handleChange} required />
          <input type="text" name="adresse" placeholder="Adresse" value={entreprise.adresse} onChange={handleChange} required />
          <button type="submit">Créer</button>
          <button type="button" onClick={() => setShowEntrepriseForm(false)}>Annuler</button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
