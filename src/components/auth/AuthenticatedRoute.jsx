import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { SUPABASE_CONFIGURED } from '../../lib/supabase.js';
import AuthLoadingScreen from './AuthLoadingScreen.jsx';

export default function AuthenticatedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  // Supabase 미설정 시 인증 없이 바로 통과 (로컬 개발/데모 모드)
  if (!SUPABASE_CONFIGURED) return children;
  if (loading) return <AuthLoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
