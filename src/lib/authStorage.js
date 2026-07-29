const REMEMBER_KEY = 'skku_auth_remember';

export function getRememberMe() {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
}

export function setRememberMe(value) {
  if (value) {
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

// Supabase custom storage: localStorage when rememberMe=true, sessionStorage otherwise.
// Passwords are never stored — only session tokens.
export const authStorageAdapter = {
  getItem(key) {
    return getRememberMe()
      ? (localStorage.getItem(key) ?? sessionStorage.getItem(key))
      : (sessionStorage.getItem(key) ?? localStorage.getItem(key));
  },
  setItem(key, value) {
    if (getRememberMe()) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  },
  removeItem(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};
