import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getKoreanError } from '../utils/authErrors.js';
import AuthInput from '../components/auth/AuthInput.jsx';
import AuthButton from '../components/auth/AuthButton.jsx';
import '../styles/auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);
  const [success, setSuccess]               = useState(false);

  function validate() {
    const e = {};
    if (!email) e.email = '이메일을 입력해 주세요.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = '유효한 이메일 형식이 아닙니다.';
    if (!password) e.password = '비밀번호를 입력해 주세요.';
    else if (password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.';
    if (password !== confirmPassword) e.confirm = '비밀번호가 일치하지 않습니다.';
    return e;
  }

  async function handleSignup(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const { error } = await signUp({ email, password });
    setLoading(false);
    if (error) { setErrors({ form: getKoreanError(error) }); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ justifyContent: 'center', alignItems: 'center', padding: '0 32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 10 }}>
              이메일을 확인해 주세요
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>
              <strong>{email}</strong> 으로<br />인증 링크를 발송했습니다.
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
            <span className="auth-wordmark-primary">회원</span>
            <span className="auth-wordmark-secondary">가입</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5 }}>
            SKKU Smart Parking
          </div>
        </div>

        <form className="auth-form-area" onSubmit={handleSignup}>
          <AuthInput
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            error={errors.email}
          />
          <AuthInput
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            error={errors.password}
          />
          <AuthInput
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            error={errors.confirm}
          />

          {errors.form && (
            <p style={{ fontSize: 13, color: '#FF3B30', paddingLeft: 4, margin: 0 }}>{errors.form}</p>
          )}

          <p style={{ fontSize: 12, color: '#9CA3AF', paddingLeft: 4, marginTop: -2 }}>
            ※ 등록된 이메일만 가입이 허용됩니다.
          </p>

          <AuthButton type="submit" loading={loading} style={{ marginTop: 8 }}>
            가입하기
          </AuthButton>
        </form>

        <div className="auth-links" style={{ marginTop: 16 }}>
          <button className="auth-link-btn" onClick={() => navigate('/login')}>
            이미 계정이 있으신가요? 로그인
          </button>
        </div>

      </div>
    </div>
  );
}
