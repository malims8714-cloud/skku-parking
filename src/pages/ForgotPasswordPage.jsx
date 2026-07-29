import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getKoreanError } from '../utils/authErrors.js';
import AuthInput from '../components/auth/AuthInput.jsx';
import AuthButton from '../components/auth/AuthButton.jsx';
import '../styles/auth.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { setError('이메일을 입력해 주세요.'); return; }
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) { setError(getKoreanError(error)); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ justifyContent: 'center', alignItems: 'center', padding: '0 32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔑</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 10 }}>
              이메일을 확인해 주세요
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>
              비밀번호 재설정 링크를<br /><strong>{email}</strong> 으로 발송했습니다.
            </p>
            <AuthButton onClick={() => navigate('/login')}>로그인 화면으로</AuthButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-wordmark" style={{ paddingBottom: 24 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              position: 'absolute', left: 20, top: 60,
              background: 'none', border: 'none',
              fontSize: 22, color: '#6B7280', cursor: 'pointer',
              lineHeight: 1, padding: 4,
            }}
          >←</button>
          <div className="auth-wordmark-text">
            <span className="auth-wordmark-primary">비밀번호</span>
            <span className="auth-wordmark-secondary"> 찾기</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5 }}>
            이메일로 재설정 링크를 보내드립니다
          </div>
        </div>

        <form className="auth-form-area" onSubmit={handleSubmit}>
          <AuthInput
            type="email"
            placeholder="가입한 이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            error={error}
          />
          <AuthButton type="submit" loading={loading} style={{ marginTop: 8 }}>
            재설정 링크 보내기
          </AuthButton>
        </form>

        <div className="auth-links" style={{ marginTop: 16 }}>
          <button className="auth-link-btn" onClick={() => navigate('/login')}>
            ← 로그인으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
}
