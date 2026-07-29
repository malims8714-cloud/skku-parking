import '../../styles/auth.css';

export default function AuthLoadingScreen() {
  return (
    <div className="auth-loading">
      <div className="auth-spinner" />
      <p className="auth-loading-text">로그인 정보를 확인하고 있습니다.</p>
    </div>
  );
}
