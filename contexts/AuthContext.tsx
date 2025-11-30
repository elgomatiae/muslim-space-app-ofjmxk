
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

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
    // Configure Google Sign-In for iOS
    if (Platform.OS === 'ios') {
      GoogleSignin.configure({
        iosClientId: 'YOUR_IOS_CLIENT_ID_HERE', // Replace with your iOS Client ID from Google Cloud Console
        scopes: ['openid', 'profile', 'email'],
      });
      console.log('Google Sign-In configured for iOS');
    }
  }, []);

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
      console.log('Starting native Google Sign-In flow...');

      // Check if Google Play Services are available (iOS always returns true)
      await GoogleSignin.hasPlayServices();
      console.log('Play services available');

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      console.log('Google sign-in successful, user:', userInfo.data?.user?.email);

      // Get the ID token
      const idToken = userInfo.data?.idToken;
      
      if (!idToken) {
        console.log('No ID token received from Google');
        return { 
          error: { message: 'Failed to get authentication token from Google' }, 
          data: null 
        };
      }

      console.log('Got ID token, signing in to Supabase...');

      // Sign in to Supabase with the ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        console.log('Supabase sign-in error:', error);
        return { error, data: null };
      }

      console.log('Successfully signed in to Supabase with Google:', data.user?.email);
      return { error: null, data };

    } catch (error: any) {
      console.log('Google sign-in exception:', error);

      // Handle specific error codes
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { 
          error: { message: 'Sign in was cancelled' }, 
          data: null 
        };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return { 
          error: { message: 'Sign in is already in progress' }, 
          data: null 
        };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return { 
          error: { message: 'Google Play Services not available' }, 
          data: null 
        };
      } else {
        return { 
          error: { message: error.message || 'An unexpected error occurred during Google sign in' }, 
          data: null 
        };
      }
    }
  };

  const signOut = async () => {
    if (!isConfigured || !supabase) {
      console.log('Supabase not configured, cannot sign out');
      return;
    }

    try {
      // Sign out from Google if signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
        console.log('Signed out from Google');
      }

      // Sign out from Supabase
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
