import '../../styles/auth.css';

export default function AuthInput({ error, ...props }) {
  return (
    <div className="auth-input-wrap">
      <input className={`auth-input${error ? ' error' : ''}`} {...props} />
      {error && <span className="auth-error-text">{error}</span>}
    </div>
  );
}
