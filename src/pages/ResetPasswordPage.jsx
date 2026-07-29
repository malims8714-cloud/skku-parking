import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { getKoreanError } from '../utils/authErrors.js';
import AuthInput from '../components/auth/AuthInput.jsx';
import AuthButton from '../components/auth/AuthButton.jsx';
import '../styles/auth.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [done, setDone]                     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6)         { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (password !== confirmPassword) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (!supabase)                    { setError('Supabase가 설정되지 않았습니다.'); return; }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(getKoreanError(error)); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ justifyContent: 'center', alignItems: 'center', padding: '0 32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', marginBottom: 10 }}>
              비밀번호가 변경되었습니다
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>
              새 비밀번호로 로그인해 주세요.
            </p>
            <AuthButton onClick={() => navigate('/login')}>로그인하러 가기</AuthButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-wordmark" style={{ paddingBottom: 24 }}>
          <div className="auth-wordmark-text">
            <span className="auth-wordmark-primary">새</span>
            <span className="auth-wordmark-secondary"> 비밀번호</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 5 }}>
            새로운 비밀번호를 입력해 주세요
          </div>
        </div>

        <form className="auth-form-area" onSubmit={handleSubmit}>
          <AuthInput
            type="password"
            placeholder="새 비밀번호 (6자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <AuthInput
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            error={error}
          />
          <AuthButton type="submit" loading={loading} style={{ marginTop: 8 }}>
            비밀번호 변경
          </AuthButton>
        </form>

      </div>
    </div>
  );
}
