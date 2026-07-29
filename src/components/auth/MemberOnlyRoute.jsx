import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AuthLoadingScreen from './AuthLoadingScreen.jsx';

export default function MemberOnlyRoute({ children }) {
  const { isMember, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoadingScreen />;
  if (!isMember) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
