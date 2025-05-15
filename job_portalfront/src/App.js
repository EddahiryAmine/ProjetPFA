import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../job_portalfront/src/pages/Login";
import Register from "../../job_portalfront/src/pages/Register";
import EmailVerified from "../../job_portalfront/src/pages/EmailVerified";
import CandidatHome from "../../job_portalfront/src/pages/CandidatHome";
import EmployeurHome from "../../job_portalfront/src/pages/EmployeurHome";
import ProfileEmp from "../../job_portalfront/src/pages/ProfileEmp";
import ProfileCompletion from './pages/ProfileCompletion';
import { AuthProvider, useAuth } from "./pages/AuthContext";
import OffresList from './pages/OffresList';
import CreateOffre from './pages/CreateOffre';
import OffreForm from './pages/OffreForm';
import { ProfileStatusProvider } from './pages/ProfileStatusContext'; // Import du provider
import ListEntreprises from "./pages/ListEntreprises";
import MainLayout from "./pages/MainLayout";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import ModifierProfil from "./pages/ModifierProfil";
import ProfilEmployeur from './pages/ProfilEmployeur';
import OffreDetail from "./pages/OffreDetail";
import CandidaturesParOffre from './pages/CandidaturesParOffre';
import ProfilCandidat from './pages/ProfilCandidat';
import MesCandidatures from './pages/MesCandidatures';
import RoleProtectedRoute from './pages/RoleProtectedRoute';
import ConversationDetail from './pages/ConversationDetail';
import ConversationsList from './pages/ConversationsList';
import StatistiquesEmployeur from './pages/StatistiquesEmployeur';
import ListeConversationsCandidat from './pages/ListeConversationsCandidat';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>; 
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

function RoleBasedRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  return user.role === 'candidat' ? <Navigate to="/candidathome" /> : <Navigate to="/employeur" />;
}

function App() {
  return (
    <AuthProvider>
      <ProfileStatusProvider>  {/* Ajouter ProfileStatusProvider ici */}
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerified />} />
            <Route path="/redirect" element={<RoleBasedRedirect />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/employeur/:id" element={<ProfilEmployeur />} />
            <Route path="/employeur/candidatures" element={<CandidaturesParOffre />} />
            <Route path="/candidats/:id" element={<ProfilCandidat />} />
            <Route path="/mes-candidatures" element={<MesCandidatures />} />
            <Route path="/messagerie" element={<ConversationsList />} />
<Route path="/messagerie/:id" element={<ConversationDetail />} />
<Route path="/messages/candidat" element={<ListeConversationsCandidat />} />

<Route path="/employeur/statistiques" element={
  <ProtectedRoute>
    <StatistiquesEmployeur />
  </ProtectedRoute>
} />


            <Route element={<MainLayout />}>
            <Route path="/candidathome" element={
              <ProtectedRoute><CandidatHome /></ProtectedRoute>
            } />
            <Route path="/profilCandidat" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/modifier-profil" element={
              <ProtectedRoute><ModifierProfil /></ProtectedRoute>
            } />
            <Route path="/entreprises" element={
              <ProtectedRoute><ListEntreprises /></ProtectedRoute>
            } />
            </Route>

        
            <Route path="/employeur" element={
              <ProtectedRoute>
                <EmployeurHome />
              </ProtectedRoute>
            } />
        
            {/* Routes du profil */}
            <Route path="/profil" element={
              <ProtectedRoute>
                <ProfileEmp />
              </ProtectedRoute>
            } />
        
            {/* Route de la complétion du profil */}
            <Route path="/profil/completion" element={
              <ProtectedRoute>
                <ProfileCompletion />
              </ProtectedRoute>
            } />
            <Route path="/offre/:id" element={<OffreDetail />} />
            <Route path="/employeur/offres" element={<OffresList />} />
            <Route path="/employeur/offres/create" element={<CreateOffre />} />
            <Route path="/offres/:id/edit" element={<OffreForm />} />
          </Routes>
        </Router>
      </ProfileStatusProvider>  
    </AuthProvider>
  );
}



export default App;
