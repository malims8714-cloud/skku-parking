import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

export default function GuestBanner() {
  const navigate = useNavigate();
  return (
    <div className="guest-banner">
      <span>비회원으로 이용 중입니다</span>
      <button className="guest-banner-btn" onClick={() => navigate('/login')}>
        로그인
      </button>
    </div>
  );
}
