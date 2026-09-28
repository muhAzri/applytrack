"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface AuthResult {
  error: string | null;
}

interface SignUpResult extends AuthResult {
  needsEmailConfirmation: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = useMemo(() => isSupabaseConfigured(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, [isConfigured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured,
      async signIn(email, password) {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return { error: "Supabase belum dikonfigurasi." };
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error: error?.message ?? null };
      },
      async signUp(email, password) {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          return { error: "Supabase belum dikonfigurasi.", needsEmailConfirmation: false };
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        return {
          error: error?.message ?? null,
          needsEmailConfirmation: !error && !data.session,
        };
      },
      async signOut() {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [user, loading, isConfigured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
