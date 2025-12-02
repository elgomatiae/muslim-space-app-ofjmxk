
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TrackerData {
  prayers: { completed: number; total: number; streak: number };
  dhikr: { count: number; goal: number; streak: number };
  quran: { pages: number; goal: number; streak: number; versesMemorized: number; versesGoal: number };
}

interface TrackerContextType {
  trackerData: TrackerData;
  updatePrayers: (completed: number, total: number) => Promise<void>;
  updateDhikr: (count: number, goal: number) => Promise<void>;
  updateQuran: (pages: number, goal: number, versesMemorized: number, versesGoal: number) => Promise<void>;
  loadTrackerData: () => Promise<void>;
  syncWithDatabase: () => Promise<void>;
  getLifetimeStats: () => Promise<any>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const TRACKER_STORAGE_KEY = '@tracker_data';
const TRACKER_DATE_KEY = '@tracker_date';
const LIFETIME_STATS_KEY = '@lifetime_stats';

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [trackerData, setTrackerData] = useState<TrackerData>({
    prayers: { completed: 0, total: 5, streak: 0 },
    dhikr: { count: 0, goal: 300, streak: 0 },
    quran: { pages: 0, goal: 5, streak: 0, versesMemorized: 0, versesGoal: 3 },
  });

  useEffect(() => {
    loadTrackerData();
  }, [user]);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const loadTrackerData = async () => {
    try {
      const savedDate = await AsyncStorage.getItem(TRACKER_DATE_KEY);
      const todayDate = getTodayDateString();

      if (savedDate !== todayDate) {
        console.log('New day detected, resetting tracker data');
        await AsyncStorage.setItem(TRACKER_DATE_KEY, todayDate);
        await AsyncStorage.removeItem(TRACKER_STORAGE_KEY);
        
        if (user && isSupabaseConfigured()) {
          await syncWithDatabase();
        }
        return;
      }

      const savedData = await AsyncStorage.getItem(TRACKER_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setTrackerData(parsed);
        console.log('Loaded tracker data from local storage:', parsed);
      }

      if (user && isSupabaseConfigured()) {
        await syncWithDatabase();
      }
    } catch (error) {
      console.log('Error loading tracker data:', error);
    }
  };

  const syncWithDatabase = async () => {
    if (!user || !isSupabaseConfigured()) {
      console.log('Cannot sync: user not logged in or Supabase not configured');
      return;
    }

    try {
      const todayDate = getTodayDateString();
      
      const { data, error } = await supabase
        .from('iman_tracker')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayDate)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching tracker data:', error);
        return;
      }

      if (data) {
        const dbData: TrackerData = {
          prayers: {
            completed: data.prayers_completed || 0,
            total: data.prayers_total || 5,
            streak: data.prayers_streak || 0,
          },
          dhikr: {
            count: data.dhikr_count || 0,
            goal: data.dhikr_goal || 300,
            streak: data.dhikr_streak || 0,
          },
          quran: {
            pages: data.quran_pages || 0,
            goal: data.quran_goal || 5,
            streak: data.quran_streak || 0,
            versesMemorized: data.quran_verses_memorized || 0,
            versesGoal: data.quran_verses_goal || 3,
          },
        };
        setTrackerData(dbData);
        await AsyncStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(dbData));
        console.log('Synced tracker data from database:', dbData);
      }
    } catch (error) {
      console.error('Error syncing with database:', error);
    }
  };

  const saveToDatabase = async (data: TrackerData) => {
    if (!user || !isSupabaseConfigured()) {
      console.log('Cannot save to database: user not logged in or Supabase not configured');
      return;
    }

    try {
      const todayDate = getTodayDateString();
      
      const { error } = await supabase
        .from('iman_tracker')
        .upsert({
          user_id: user.id,
          date: todayDate,
          prayers_completed: data.prayers.completed,
          prayers_total: data.prayers.total,
          prayers_streak: data.prayers.streak,
          dhikr_count: data.dhikr.count,
          dhikr_goal: data.dhikr.goal,
          dhikr_streak: data.dhikr.streak,
          quran_pages: data.quran.pages,
          quran_goal: data.quran.goal,
          quran_streak: data.quran.streak,
          quran_verses_memorized: data.quran.versesMemorized,
          quran_verses_goal: data.quran.versesGoal,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error('Error saving to database:', error);
      } else {
        console.log('Saved tracker data to database');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  const updateLifetimeStats = async (data: TrackerData) => {
    try {
      const savedStats = await AsyncStorage.getItem(LIFETIME_STATS_KEY);
      const stats = savedStats ? JSON.parse(savedStats) : {
        totalDhikr: 0,
        totalQuranPages: 0,
        totalQuranVerses: 0,
        lecturesWatched: 0,
        workoutsCompleted: 0,
      };

      stats.totalDhikr = (stats.totalDhikr || 0) + data.dhikr.count;
      stats.totalQuranPages = (stats.totalQuranPages || 0) + data.quran.pages;
      stats.totalQuranVerses = (stats.totalQuranVerses || 0) + data.quran.versesMemorized;

      await AsyncStorage.setItem(LIFETIME_STATS_KEY, JSON.stringify(stats));
      console.log('Updated lifetime stats:', stats);
    } catch (error) {
      console.error('Error updating lifetime stats:', error);
    }
  };

  const getLifetimeStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem(LIFETIME_STATS_KEY);
      return savedStats ? JSON.parse(savedStats) : {
        totalDhikr: 0,
        totalQuranPages: 0,
        totalQuranVerses: 0,
        lecturesWatched: 0,
        workoutsCompleted: 0,
      };
    } catch (error) {
      console.error('Error getting lifetime stats:', error);
      return {
        totalDhikr: 0,
        totalQuranPages: 0,
        totalQuranVerses: 0,
        lecturesWatched: 0,
        workoutsCompleted: 0,
      };
    }
  };

  const updatePrayers = async (completed: number, total: number) => {
    const newData = {
      ...trackerData,
      prayers: { ...trackerData.prayers, completed, total },
    };
    setTrackerData(newData);
    await AsyncStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(newData));
    await saveToDatabase(newData);
    await updateLifetimeStats(newData);
  };

  const updateDhikr = async (count: number, goal: number) => {
    const newData = {
      ...trackerData,
      dhikr: { ...trackerData.dhikr, count, goal },
    };
    setTrackerData(newData);
    await AsyncStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(newData));
    await saveToDatabase(newData);
    await updateLifetimeStats(newData);
  };

  const updateQuran = async (pages: number, goal: number, versesMemorized: number, versesGoal: number) => {
    const newData = {
      ...trackerData,
      quran: { ...trackerData.quran, pages, goal, versesMemorized, versesGoal },
    };
    setTrackerData(newData);
    await AsyncStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(newData));
    await saveToDatabase(newData);
    await updateLifetimeStats(newData);
  };

  return (
    <TrackerContext.Provider
      value={{
        trackerData,
        updatePrayers,
        updateDhikr,
        updateQuran,
        loadTrackerData,
        syncWithDatabase,
        getLifetimeStats,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (context === undefined) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
}
