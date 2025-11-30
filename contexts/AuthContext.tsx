
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

// Complete the WebBrowser session on web platform
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
      console.log('Supabase not configured, skipping auth initialization');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.log('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
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
        console.log('Sign up error:', error);
        return { error, data: null };
      }

      console.log('Sign up successful:', data.user?.email);
      return { error: null, data };
    } catch (error) {
      console.log('Sign up exception:', error);
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
        console.log('Sign in error:', error);
        return { error, data: null };
      }

      console.log('Sign in successful:', data.user?.email);
      return { error: null, data };
    } catch (error) {
      console.log('Sign in exception:', error);
      return { error, data: null };
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured || !supabase) {
      return { error: { message: 'Supabase is not configured. Please enable Supabase to use authentication.' } };
    }

    try {
      console.log('Starting browser-based Google Sign-In flow...');

      // Create a redirect URL for the current platform
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'muslimspace',
        path: 'auth/callback',
      });
      console.log('Redirect URL:', redirectUrl);

      // Generate a random state value for security
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );

      // Start the OAuth flow with Supabase
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
        console.log('OAuth initiation error:', error);
        return { error, data: null };
      }

      if (!data.url) {
        console.log('No OAuth URL returned');
        return { 
          error: { message: 'Failed to get authentication URL' }, 
          data: null 
        };
      }

      console.log('Opening browser for authentication...');

      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      console.log('Browser result:', result.type);

      if (result.type === 'success') {
        // Extract the URL from the result
        const url = result.url;
        console.log('Success URL:', url);

        // The session will be automatically set by the onAuthStateChange listener
        // We just need to wait a moment for it to process
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
      console.log('Google sign-in exception:', error);
      return { 
        error: { message: error.message || 'An unexpected error occurred during Google sign in' }, 
        data: null 
      };
    }
  };

  const signOut = async () => {
    if (!isConfigured || !supabase) {
      console.log('Supabase not configured, cannot sign out');
      return;
    }

    try {
      await supabase.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.log('Sign out error:', error);
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
