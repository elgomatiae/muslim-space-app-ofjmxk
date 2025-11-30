
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Complete the auth session for web browser
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
      console.log('Starting Google sign in flow...');
      
      // Create the redirect URL for the app
      const redirectTo = Linking.createURL('google-auth');
      console.log('Redirect URL:', redirectTo);

      // Start the OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.log('Error initiating Google OAuth:', error);
        return { error, data: null };
      }

      const authUrl = data?.url;
      if (!authUrl) {
        console.log('No auth URL returned from Supabase');
        return { error: { message: 'No authentication URL received' }, data: null };
      }

      console.log('Opening browser for Google auth...');
      
      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectTo,
        {
          showInRecents: true,
        }
      );

      console.log('Browser result:', result);

      if (result.type === 'success') {
        // Extract the URL parameters
        const url = result.url;
        const params = extractParamsFromUrl(url);
        
        console.log('Extracted params:', params);

        if (params.access_token && params.refresh_token) {
          // Set the session with the tokens
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (sessionError) {
            console.log('Error setting session:', sessionError);
            return { error: sessionError, data: null };
          }

          console.log('Google sign in successful:', sessionData.user?.email);
          return { error: null, data: sessionData };
        } else {
          console.log('No tokens found in redirect URL');
          return { error: { message: 'Authentication failed - no tokens received' }, data: null };
        }
      } else if (result.type === 'cancel') {
        console.log('User cancelled Google sign in');
        return { error: { message: 'Sign in cancelled by user' }, data: null };
      } else {
        console.log('Google sign in failed:', result);
        return { error: { message: 'Sign in failed' }, data: null };
      }
    } catch (error: any) {
      console.log('Google sign in exception:', error);
      return { error: { message: error.message || 'An unexpected error occurred' }, data: null };
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

// Helper function to extract parameters from URL
function extractParamsFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hash = parsedUrl.hash.substring(1); // Remove the leading '#'
    const params = new URLSearchParams(hash);

    return {
      access_token: params.get('access_token'),
      expires_in: parseInt(params.get('expires_in') || '0'),
      refresh_token: params.get('refresh_token'),
      token_type: params.get('token_type'),
      provider_token: params.get('provider_token'),
    };
  } catch (error) {
    console.log('Error parsing URL:', error);
    return {
      access_token: null,
      expires_in: 0,
      refresh_token: null,
      token_type: null,
      provider_token: null,
    };
  }
}
