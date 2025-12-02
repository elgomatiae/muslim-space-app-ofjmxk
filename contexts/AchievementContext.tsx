
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { achievements, Achievement } from '@/data/achievements';
import { generateWeeklyChallenges, Challenge } from '@/data/challenges';

interface AchievementContextType {
  achievements: Achievement[];
  weeklyChallenges: Challenge[];
  totalPoints: number;
  checkAchievements: (trackerData: any, lifetimeStats: any) => Promise<void>;
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>;
  incrementLectureCount: () => Promise<void>;
  incrementWorkoutDay: () => Promise<void>;
  loadWeeklyChallenges: () => Promise<void>;
  syncWeeklyChallengesWithStats: (prayers: number, quranPages: number, dhikrCount: number) => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const ACHIEVEMENTS_STORAGE_KEY = '@achievements';
const WEEKLY_CHALLENGES_STORAGE_KEY = '@weekly_challenges';
const WEEKLY_CHALLENGES_DATE_KEY = '@weekly_challenges_date';
const POINTS_STORAGE_KEY = '@total_points';
const LECTURES_WATCHED_KEY = '@lectures_watched_week';
const LECTURES_WATCHED_DATE_KEY = '@lectures_watched_week_date';

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [weeklyChallenges, setWeeklyChallenges] = useState<Challenge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadAchievements();
    loadWeeklyChallenges();
    loadPoints();
  }, [user]);

  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  };

  const loadWeeklyChallenges = async () => {
    try {
      const weekStart = getWeekStartDate();
      const savedWeekStart = await AsyncStorage.getItem(WEEKLY_CHALLENGES_DATE_KEY);

      if (savedWeekStart !== weekStart) {
        console.log('New week detected, resetting weekly challenges');
        const newChallenges = generateWeeklyChallenges();
        setWeeklyChallenges(newChallenges);
        await AsyncStorage.setItem(WEEKLY_CHALLENGES_DATE_KEY, weekStart);
        await AsyncStorage.setItem(WEEKLY_CHALLENGES_STORAGE_KEY, JSON.stringify(newChallenges));
        
        // Reset lecture count for new week
        await AsyncStorage.setItem(LECTURES_WATCHED_KEY, '0');
        await AsyncStorage.setItem(LECTURES_WATCHED_DATE_KEY, weekStart);
        
        if (user && isSupabaseConfigured()) {
          await supabase
            .from('user_challenges')
            .delete()
            .eq('user_id', user.id)
            .lt('week_start_date', weekStart);
        }
        return;
      }

      if (user && isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start_date', weekStart);

        if (data && data.length > 0) {
          const challengesMap = new Map(data.map(c => [c.challenge_id, c]));
          const updatedChallenges = generateWeeklyChallenges().map(challenge => {
            const userChallenge = challengesMap.get(challenge.id);
            if (userChallenge) {
              return {
                ...challenge,
                progress: userChallenge.progress || 0,
                completed: userChallenge.completed || false,
              };
            }
            return challenge;
          });
          setWeeklyChallenges(updatedChallenges);
          await AsyncStorage.setItem(WEEKLY_CHALLENGES_STORAGE_KEY, JSON.stringify(updatedChallenges));
          return;
        }
      }

      const savedChallenges = await AsyncStorage.getItem(WEEKLY_CHALLENGES_STORAGE_KEY);
      if (savedChallenges) {
        setWeeklyChallenges(JSON.parse(savedChallenges));
      } else {
        const newChallenges = generateWeeklyChallenges();
        setWeeklyChallenges(newChallenges);
        await AsyncStorage.setItem(WEEKLY_CHALLENGES_STORAGE_KEY, JSON.stringify(newChallenges));
      }
    } catch (error) {
      console.error('Error loading weekly challenges:', error);
    }
  };

  const syncWeeklyChallengesWithStats = async (prayerDays: number, quranPages: number, dhikrCount: number) => {
    try {
      console.log('Syncing weekly challenges with stats:', { prayerDays, quranPages, dhikrCount });
      
      // Update prayer challenge
      await updateChallengeProgress('weekly-prayer-streak', prayerDays);
      
      // Update Quran challenge
      await updateChallengeProgress('weekly-quran-35-pages', quranPages);
      
      // Update dhikr challenge
      await updateChallengeProgress('weekly-dhikr-2000', dhikrCount);
    } catch (error) {
      console.error('Error syncing weekly challenges:', error);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    try {
      const updatedChallenges = weeklyChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          const newProgress = Math.min(progress, challenge.requirement.value);
          const isCompleted = newProgress >= challenge.requirement.value;
          
          if (isCompleted && !challenge.completed) {
            addPoints(challenge.reward.points);
          }
          
          return {
            ...challenge,
            progress: newProgress,
            completed: isCompleted,
          };
        }
        return challenge;
      });

      setWeeklyChallenges(updatedChallenges);
      await AsyncStorage.setItem(WEEKLY_CHALLENGES_STORAGE_KEY, JSON.stringify(updatedChallenges));

      if (user && isSupabaseConfigured()) {
        const weekStart = getWeekStartDate();
        const challenge = updatedChallenges.find(c => c.id === challengeId);
        if (challenge) {
          await supabase
            .from('user_challenges')
            .upsert({
              user_id: user.id,
              challenge_id: challengeId,
              progress: challenge.progress,
              completed: challenge.completed,
              completed_at: challenge.completed ? new Date().toISOString() : null,
              week_start_date: weekStart,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,challenge_id,week_start_date'
            });
        }
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };

  const incrementLectureCount = async () => {
    try {
      const weekStart = getWeekStartDate();
      const savedWeekStart = await AsyncStorage.getItem(LECTURES_WATCHED_DATE_KEY);
      
      let currentCount = 0;
      if (savedWeekStart === weekStart) {
        const savedCount = await AsyncStorage.getItem(LECTURES_WATCHED_KEY);
        currentCount = savedCount ? parseInt(savedCount) : 0;
      }
      
      const newCount = currentCount + 1;
      await AsyncStorage.setItem(LECTURES_WATCHED_KEY, newCount.toString());
      await AsyncStorage.setItem(LECTURES_WATCHED_DATE_KEY, weekStart);
      
      console.log('Incremented lecture count to:', newCount);
      
      if (user && isSupabaseConfigured()) {
        await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            lectures_watched: newCount,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });
      }

      await updateChallengeProgress('weekly-lectures-5', newCount);
    } catch (error) {
      console.error('Error incrementing lecture count:', error);
    }
  };

  const incrementWorkoutDay = async () => {
    try {
      const weekStart = getWeekStartDate();
      const storageKey = `@workout_days_${weekStart}`;
      
      const savedDays = await AsyncStorage.getItem(storageKey);
      const workoutDays = savedDays ? JSON.parse(savedDays) : [];
      
      const today = new Date().toISOString().split('T')[0];
      if (!workoutDays.includes(today)) {
        workoutDays.push(today);
        await AsyncStorage.setItem(storageKey, JSON.stringify(workoutDays));
        console.log('Incremented workout days to:', workoutDays.length);
        await updateChallengeProgress('weekly-wellness', workoutDays.length);
      }
    } catch (error) {
      console.error('Error incrementing workout day:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      if (user && isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', user.id);

        if (data) {
          const unlockedIds = new Set(data.map(a => a.achievement_id));
          const updatedAchievements = achievements.map(achievement => ({
            ...achievement,
            unlocked: unlockedIds.has(achievement.id),
          }));
          setUserAchievements(updatedAchievements);
          await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));
          return;
        }
      }

      const savedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (savedAchievements) {
        setUserAchievements(JSON.parse(savedAchievements));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadPoints = async () => {
    try {
      if (user && isSupabaseConfigured()) {
        const { data } = await supabase
          .from('user_stats')
          .select('total_points')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setTotalPoints(data.total_points || 0);
          await AsyncStorage.setItem(POINTS_STORAGE_KEY, data.total_points.toString());
          return;
        }
      }

      const savedPoints = await AsyncStorage.getItem(POINTS_STORAGE_KEY);
      if (savedPoints) {
        setTotalPoints(parseInt(savedPoints));
      }
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };

  const addPoints = async (points: number) => {
    try {
      const newTotal = totalPoints + points;
      setTotalPoints(newTotal);
      await AsyncStorage.setItem(POINTS_STORAGE_KEY, newTotal.toString());

      if (user && isSupabaseConfigured()) {
        await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            total_points: newTotal,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });
      }
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const checkAchievements = async (currentTrackerData: any, lifetimeStats: any) => {
    try {
      const updatedAchievements = [...userAchievements];
      let hasNewAchievement = false;

      for (let i = 0; i < updatedAchievements.length; i++) {
        const achievement = updatedAchievements[i];
        if (achievement.unlocked) continue;

        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first-prayer':
            shouldUnlock = currentTrackerData.prayers.completed >= 1;
            break;
          case 'prayer-streak-7':
            shouldUnlock = currentTrackerData.prayers.streak >= 7;
            break;
          case 'prayer-streak-30':
            shouldUnlock = currentTrackerData.prayers.streak >= 30;
            break;
          case 'prayer-streak-100':
            shouldUnlock = currentTrackerData.prayers.streak >= 100;
            break;
          case 'dhikr-1000':
            shouldUnlock = lifetimeStats.totalDhikr >= 1000;
            break;
          case 'dhikr-10000':
            shouldUnlock = lifetimeStats.totalDhikr >= 10000;
            break;
          case 'dhikr-streak-30':
            shouldUnlock = currentTrackerData.dhikr.streak >= 30;
            break;
          case 'quran-juz':
            shouldUnlock = lifetimeStats.totalQuranPages >= 20;
            break;
          case 'quran-complete':
            shouldUnlock = lifetimeStats.totalQuranPages >= 604;
            break;
          case 'quran-memorize-50':
            shouldUnlock = lifetimeStats.totalQuranVerses >= 50;
            break;
          case 'quran-streak-7':
            shouldUnlock = currentTrackerData.quran.streak >= 7;
            break;
          case 'learning-10-lectures':
            shouldUnlock = lifetimeStats.lecturesWatched >= 10;
            break;
          case 'learning-50-lectures':
            shouldUnlock = lifetimeStats.lecturesWatched >= 50;
            break;
          case 'wellness-workout-30':
            shouldUnlock = lifetimeStats.workoutsCompleted >= 30;
            break;
          case 'wellness-streak-7':
            shouldUnlock = lifetimeStats.wellnessStreak >= 7;
            break;
        }

        if (shouldUnlock) {
          updatedAchievements[i] = { ...achievement, unlocked: true };
          hasNewAchievement = true;
          await addPoints(achievement.points || 100);

          if (user && isSupabaseConfigured()) {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: achievement.id,
                unlocked_at: new Date().toISOString(),
              });
          }
        }
      }

      if (hasNewAchievement) {
        setUserAchievements(updatedAchievements);
        await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements: userAchievements,
        weeklyChallenges,
        totalPoints,
        checkAchievements,
        updateChallengeProgress,
        incrementLectureCount,
        incrementWorkoutDay,
        loadWeeklyChallenges,
        syncWeeklyChallengesWithStats,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
