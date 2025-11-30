
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Required for expo-web-browser to work properly
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
      console.log('Starting Google OAuth sign in flow...');
      
      // Get the redirect URL for the current platform
      const redirectUrl = Linking.createURL('/');
      console.log('Redirect URL:', redirectUrl);

      // Start the OAuth flow with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.log('Error starting OAuth flow:', error);
        return { error, data: null };
      }

      if (!data?.url) {
        console.log('No OAuth URL received from Supabase');
        return { 
          error: { message: 'Failed to get Google sign-in URL. Please try again.' }, 
          data: null 
        };
      }

      console.log('Opening Google sign-in browser with URL:', data.url);

      // Open the OAuth URL in a browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      console.log('Browser result:', result);

      if (result.type === 'success') {
        // Extract the URL from the result
        const url = result.url;
        console.log('OAuth success, got URL:', url);

        // Parse the URL to get the session
        const parsedUrl = Linking.parse(url);
        console.log('Parsed URL:', parsedUrl);

        // The session will be automatically set by Supabase's onAuthStateChange listener
        // We just need to wait a moment for it to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        return { error: null, data: { url } };
      } else if (result.type === 'cancel') {
        console.log('User cancelled Google sign in');
        return { 
          error: { message: 'Sign in was cancelled' }, 
          data: null 
        };
      } else {
        console.log('Google sign in failed:', result);
        return { 
          error: { message: 'Failed to complete Google sign in' }, 
          data: null 
        };
      }

    } catch (error: any) {
      console.log('Google sign in exception:', error);
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
