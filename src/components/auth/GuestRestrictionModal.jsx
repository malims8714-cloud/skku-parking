import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

export default function GuestRestrictionModal({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-icon">🔒</div>
        <p className="auth-modal-title">회원 전용 기능</p>
        <p className="auth-modal-desc">
          이 기능은 회원 로그인 후 사용할 수 있습니다.<br />
          로그인하시겠습니까?
        </p>
        <div className="auth-modal-actions">
          <button
            className="auth-btn auth-btn-primary"
            onClick={() => navigate('/login')}
          >
            로그인하러 가기
          </button>
          <button className="auth-btn auth-btn-ghost" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
