import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getKoreanError } from '../utils/authErrors.js';
import { SUPABASE_CONFIGURED } from '../lib/supabase.js';
import AuthInput from '../components/auth/AuthInput.jsx';
import AuthButton from '../components/auth/AuthButton.jsx';
import myeongnyundangUrl from '../assets/myeongnyundang-placeholder.svg?url';
import skkuLogoUrl from '../assets/skku-logo-placeholder.svg?url';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInAsGuest } = useAuth();

  const from = location.state?.from?.pathname ?? '/';

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError('이메일과 비밀번호를 입력해 주세요.'); return; }
    setError('');
    setLoading(true);
    const { error } = await signIn({ email, password, rememberMe });
    setLoading(false);
    if (error) { setError(getKoreanError(error)); return; }
    navigate(from, { replace: true });
  }

  async function handleGuest() {
    setError('');
    setGuestLoading(true);
    const { error } = await signInAsGuest();
    setGuestLoading(false);
    if (error) { setError(getKoreanError(error)); return; }
    navigate('/', { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── 워드마크 ── */}
        <div className="auth-wordmark">
          <div className="auth-wordmark-text">
            <span className="auth-wordmark-primary">SKKU-</span>
            <span className="auth-wordmark-secondary">P</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5, letterSpacing: 1.5, fontWeight: 500 }}>
            SMART PARKING
          </div>
        </div>

        {/* ── Supabase 미설정 안내 ── */}
        {!SUPABASE_CONFIGURED && (
          <div style={{
            margin: '0 28px 16px',
            background: '#FEF3C7', borderRadius: 12,
            padding: '12px 16px', fontSize: 13, color: '#92400E', lineHeight: 1.5,
          }}>
            ⚙️ <strong>Supabase 설정 필요</strong><br />
            <code>.env</code> 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정하세요.<br />
            자세한 내용은 <code>docs/AUTH_SETUP.md</code>를 참고하세요.
          </div>
        )}

        {/* ── 폼 ── */}
        <form className="auth-form-area" onSubmit={handleLogin}>
          <AuthInput
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
          <AuthInput
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p style={{ fontSize: 13, color: '#FF3B30', paddingLeft: 4, margin: 0 }}>{error}</p>
          )}

          <div className="auth-row">
            <input
              id="remember-me"
              type="checkbox"
              className="auth-checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="auth-checkbox-label">
              자동 로그인
            </label>
          </div>

          <AuthButton type="submit" loading={loading} style={{ marginTop: 8 }}>
            로그인
          </AuthButton>
        </form>

        {/* ── 비회원 버튼 ── */}
        <div style={{ padding: '12px 28px 0' }}>
          <AuthButton variant="outline" onClick={handleGuest} loading={guestLoading}>
            비회원으로 둘러보기
          </AuthButton>
        </div>

        {/* ── 링크 ── */}
        <div className="auth-links" style={{ marginTop: 12 }}>
          <button className="auth-link-btn" onClick={() => navigate('/signup')}>
            회원가입
          </button>
          <div className="auth-divider" />
          <button className="auth-link-btn" onClick={() => navigate('/forgot-password')}>
            비밀번호 찾기
          </button>
        </div>

        {/* ── 명륜당 선화 ── */}
        <div className="auth-illustration">
          <img src={myeongnyundangUrl} alt="명륜당" />
        </div>

        {/* ── 성균관대 로고 ── */}
        <div className="auth-logo">
          <img src={skkuLogoUrl} alt="성균관대학교" />
        </div>

      </div>
    </div>
  );
}
