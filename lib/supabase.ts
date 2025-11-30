
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration - hardcoded values from your project
const supabaseUrl = 'https://teemloiwfnwrogwnoxsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZW1sb2l3Zm53cm9nd25veHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTYzODMsImV4cCI6MjA4MDAzMjM4M30.CXCl1-nnRT0GB6Qg89daWxT8kWxx91gEDaUWk9jX4CQ';

// Create a custom storage implementation for React Native
const customStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log('Error getting item from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Error setting item in AsyncStorage:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error removing item from AsyncStorage:', error);
    }
  },
};

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const isConfigured = supabaseUrl !== '' && supabaseAnonKey !== '' && 
                       supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                       supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';
  console.log('Supabase configuration check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isConfigured
  });
  return isConfigured;
};

// Create the Supabase client
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: customStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    console.log('✅ Supabase client initialized successfully');
    console.log('Supabase URL:', supabaseUrl);
  } catch (error) {
    console.error('❌ Error initializing Supabase client:', error);
  }
} else {
  console.log('⚠️ Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

// Export the supabase instance
export const supabase = supabaseInstance as SupabaseClient;
