import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (!user) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/redirect" />;
  }

  return children;
};

export default RoleProtectedRoute;
