import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Profile } from '../types';
import { DEMO_PASSWORD, DEMO_PROFILES, getDemoProfile } from '../demoData';

type LocalSession = { user: { id: string; email?: string } };
interface AuthContextValue {
  session: LocalSession | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  demoMode: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = 'tercis_local_profile_id';
const PROFILE_PREFIX = 'tercis_local_profile_';

function sessionFor(profile: Profile): LocalSession { return { user: { id: profile.id, email: profile.email } }; }
function loadProfile(id: string) {
  const stored = localStorage.getItem(`${PROFILE_PREFIX}${id}`);
  return stored ? JSON.parse(stored) as Profile : DEMO_PROFILES.find((item) => item.id === id) ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem(SESSION_KEY);
    const storedProfile = id ? loadProfile(id) : null;
    if (storedProfile) { setProfile(storedProfile); setSession(sessionFor(storedProfile)); }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    if (password !== DEMO_PASSWORD) return `Credenciais inválidas. A senha demo é ${DEMO_PASSWORD}.`;
    const match = getDemoProfile(email, password) ?? Object.keys(localStorage)
      .filter((key) => key.startsWith(PROFILE_PREFIX))
      .map((key) => JSON.parse(localStorage.getItem(key) || 'null') as Profile)
      .find((item) => item?.email.toLowerCase() === email.toLowerCase());
    if (!match) return 'Não encontramos uma conta com este email.';
    localStorage.setItem(SESSION_KEY, match.id); setProfile(match); setSession(sessionFor(match)); return null;
  }

  async function signUp(email: string, password: string, fullName: string) {
    if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    const id = `local-admin-${Date.now()}`;
    const companyId = `local-company-${Date.now()}`;
    const newProfile: Profile = { id, email, full_name: fullName, role: 'admin', phone: '', avatar_url: '', company_id: companyId, active: true, created_at: new Date().toISOString() };
    localStorage.setItem(`${PROFILE_PREFIX}${id}`, JSON.stringify(newProfile));
    localStorage.setItem(SESSION_KEY, id); setProfile(newProfile); setSession(sessionFor(newProfile)); return null;
  }

  async function signOut() { localStorage.removeItem(SESSION_KEY); setProfile(null); setSession(null); }
  async function refreshProfile() { if (profile) setProfile(loadProfile(profile.id)); }

  return <AuthContext.Provider value={{ session, profile, loading, signIn, signUp, signOut, refreshProfile, demoMode: true }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
