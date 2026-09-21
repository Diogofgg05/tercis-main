import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { DEMO_PASSWORD, DEMO_PROFILES, getDemoProfile } from '../demoData';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  demoMode: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const DEMO_SESSION_KEY = 'tercis_demo_profile_id';

function demoSessionFor(profile: Profile): Session {
  return {
    access_token: `demo-token-${profile.id}`,
    refresh_token: `demo-refresh-${profile.id}`,
    expires_in: 60 * 60 * 24 * 365,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    token_type: 'bearer',
    user: {
      id: profile.id,
      app_metadata: {},
      user_metadata: { full_name: profile.full_name },
      aud: 'authenticated',
      created_at: profile.created_at,
      email: profile.email,
    },
  } as Session;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data ?? null);
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const profileId = localStorage.getItem(DEMO_SESSION_KEY);
      const demoProfile = DEMO_PROFILES.find((item) => item.id === profileId) ?? null;
      if (demoProfile) {
        setProfile(demoProfile);
        setSession(demoSessionFor(demoProfile));
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        (async () => {
          await fetchProfile(session.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!isSupabaseConfigured) {
      const demoProfile = getDemoProfile(email, password);
      if (!demoProfile) return `Credenciais demo inválidas. Use o Super admin, Colaborador ou Admin da empresa com a senha ${DEMO_PASSWORD}.`;
      localStorage.setItem(DEMO_SESSION_KEY, demoProfile.id);
      setProfile(demoProfile);
      setSession(demoSessionFor(demoProfile));
      return null;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async function signUp(email: string, password: string, fullName: string): Promise<string | null> {
    if (!isSupabaseConfigured) {
      const profile: Profile = {
        id: `demo-custom-${Date.now()}`,
        email,
        full_name: fullName,
        role: 'admin',
        phone: '',
        avatar_url: '',
        company_id: null,
        active: true,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_SESSION_KEY, profile.id);
      localStorage.setItem(`tercis_demo_profile_${profile.id}`, JSON.stringify(profile));
      setProfile(profile);
      setSession(demoSessionFor(profile));
      return null;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return error?.message ?? null;
  }

  async function signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_SESSION_KEY);
      setProfile(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session) await fetchProfile(session.user.id);
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signUp, signOut, refreshProfile, demoMode: !isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
