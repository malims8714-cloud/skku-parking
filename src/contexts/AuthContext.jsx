import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase.js';
import { setRememberMe } from '../lib/authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMember       = !!(user && !user.is_anonymous);
  const isGuest        = user?.is_anonymous === true;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async ({ email, password, rememberMe = false }) => {
    if (!supabase) return { error: { message: 'Supabase가 설정되지 않았습니다.' } };
    setRememberMe(rememberMe);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async ({ email, password }) => {
    if (!supabase) return { error: { message: 'Supabase가 설정되지 않았습니다.' } };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }, []);

  const signInAsGuest = useCallback(async () => {
    if (!supabase) return { error: { message: 'Supabase가 설정되지 않았습니다.' } };
    setRememberMe(false);
    const { error } = await supabase.auth.signInAnonymously();
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return { error: null };
    setRememberMe(false);
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!supabase) return { error: { message: 'Supabase가 설정되지 않았습니다.' } };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  }, []);

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      isMember, isGuest, isAuthenticated,
      signIn, signUp, signInAsGuest, signOut, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
