
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

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

    // Configure Google Sign-In
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID_FROM_GOOGLE_CONSOLE', // User needs to replace this
        iosClientId: 'YOUR_IOS_CLIENT_ID_FROM_GOOGLE_CONSOLE', // Optional, for iOS
      });
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
      if (Platform.OS === 'web') {
        // Web OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://natively.dev/auth/callback'
          }
        });
        
        if (error) {
          console.log('Google sign in error:', error);
          return { error, data: null };
        }
        
        return { error: null, data };
      } else {
        // Native Google Sign-In flow
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        
        if (userInfo.data?.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo.data.idToken,
          });
          
          if (error) {
            console.log('Google sign in error:', error);
            return { error, data: null };
          }
          
          console.log('Google sign in successful:', data.user?.email);
          return { error: null, data };
        } else {
          return { error: { message: 'No ID token present!' }, data: null };
        }
      }
    } catch (error: any) {
      console.log('Google sign in exception:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    if (!isConfigured || !supabase) {
      console.log('Supabase not configured, cannot sign out');
      return;
    }

    try {
      // Sign out from Google if signed in
      if (Platform.OS !== 'web') {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await GoogleSignin.signOut();
        }
      }
      
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
