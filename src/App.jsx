import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import AuthLoadingScreen from './components/auth/AuthLoadingScreen.jsx';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import ParkingApp from './pages/ParkingApp.jsx';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;

  return (
    <Routes>
      <Route path="/login"            element={<LoginPage />} />
      <Route path="/signup"           element={<SignupPage />} />
      <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
      <Route path="/reset-password"   element={<ResetPasswordPage />} />
      <Route
        path="/*"
        element={
          <AuthenticatedRoute>
            <ParkingApp />
          </AuthenticatedRoute>
        }
      />
    </Routes>
  );
}
