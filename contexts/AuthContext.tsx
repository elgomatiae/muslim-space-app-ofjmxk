
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signInWithGoogle: () => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  isConfigured: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signUp = async (email: string, password: string) => {
    if (!isConfigured || !supabase) {
      return { error: { message: 'Supabase is not configured. Please enable Supabase to use authentication.' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      return { error, data: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured || !supabase) {
      return { error: { message: 'Supabase is not configured. Please enable Supabase to use authentication.' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      return { error, data: null };
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured || !supabase) {
      return { error: { message: 'Supabase is not configured. Please enable Supabase to use authentication.' } };
    }

    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'muslimspace',
        path: 'auth/callback',
      });

      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { error, data: null };
      }

      if (!data.url) {
        return { 
          error: { message: 'Failed to get authentication URL' }, 
          data: null 
        };
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === 'success') {
        const url = result.url;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { error: null, data: { url } };
      } else if (result.type === 'cancel') {
        return { 
          error: { message: 'Sign in was cancelled' }, 
          data: null 
        };
      } else {
        return { 
          error: { message: 'Authentication failed' }, 
          data: null 
        };
      }

    } catch (error: any) {
      return { 
        error: { message: error.message || 'An unexpected error occurred during Google sign in' }, 
        data: null 
      };
    }
  };

  const signOut = async () => {
    if (!isConfigured || !supabase) {
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
