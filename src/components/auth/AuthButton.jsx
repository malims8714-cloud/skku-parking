import '../../styles/auth.css';

const VARIANT_CLASS = {
  primary: 'auth-btn auth-btn-primary',
  outline: 'auth-btn auth-btn-outline',
  ghost:   'auth-btn auth-btn-ghost',
};

export default function AuthButton({ variant = 'primary', loading, children, ...props }) {
  return (
    <button
      className={VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? '처리중...' : children}
    </button>
  );
}
