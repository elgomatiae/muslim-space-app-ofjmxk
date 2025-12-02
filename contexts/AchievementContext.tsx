
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { achievements, Achievement } from '@/data/achievements';
import { Challenge, generateDailyChallenges, generateWeeklyChallenges } from '@/data/challenges';
import { Alert } from 'react-native';

interface AchievementContextType {
  achievements: Achievement[];
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  totalPoints: number;
  checkAchievements: (trackerData: any, stats: any) => Promise<void>;
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>;
  loadAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const ACHIEVEMENTS_STORAGE_KEY = '@achievements';
const CHALLENGES_STORAGE_KEY = '@challenges';
const POINTS_STORAGE_KEY = '@total_points';

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState<Challenge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadAchievements();
    loadChallenges();
  }, [user]);

  const loadAchievements = async () => {
    try {
      const savedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      const savedPoints = await AsyncStorage.getItem(POINTS_STORAGE_KEY);
      
      if (savedAchievements) {
        setUserAchievements(JSON.parse(savedAchievements));
      }
      
      if (savedPoints) {
        setTotalPoints(parseInt(savedPoints));
      }

      if (user && isSupabaseConfigured()) {
        await syncAchievementsWithDatabase();
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      const savedChallenges = await AsyncStorage.getItem(CHALLENGES_STORAGE_KEY);
      const today = new Date().toDateString();
      
      if (savedChallenges) {
        const parsed = JSON.parse(savedChallenges);
        if (parsed.date === today) {
          setDailyChallenges(parsed.daily);
          setWeeklyChallenges(parsed.weekly);
          return;
        }
      }

      const newDaily = generateDailyChallenges();
      const newWeekly = generateWeeklyChallenges();
      
      setDailyChallenges(newDaily);
      setWeeklyChallenges(newWeekly);
      
      await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify({
        date: today,
        daily: newDaily,
        weekly: newWeekly,
      }));
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const syncAchievementsWithDatabase = async () => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error syncing achievements:', error);
        return;
      }

      if (data && data.length > 0) {
        const updatedAchievements = userAchievements.map(achievement => {
          const dbAchievement = data.find(a => a.achievement_id === achievement.id);
          if (dbAchievement) {
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: dbAchievement.unlocked_at,
            };
          }
          return achievement;
        });
        setUserAchievements(updatedAchievements);
        await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));
      }
    } catch (error) {
      console.error('Error syncing achievements:', error);
    }
  };

  const unlockAchievement = async (achievement: Achievement) => {
    const updatedAchievements = userAchievements.map(a => {
      if (a.id === achievement.id && !a.unlocked) {
        return {
          ...a,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setUserAchievements(updatedAchievements);
    await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));

    const points = achievement.rarity === 'legendary' ? 100 : 
                   achievement.rarity === 'epic' ? 75 : 
                   achievement.rarity === 'rare' ? 50 : 25;
    
    const newPoints = totalPoints + points;
    setTotalPoints(newPoints);
    await AsyncStorage.setItem(POINTS_STORAGE_KEY, newPoints.toString());

    Alert.alert(
      '🎉 Achievement Unlocked!',
      `${achievement.title}\n\n${achievement.description}\n\n+${points} points`,
      [{ text: 'Awesome!', style: 'default' }]
    );

    if (user && isSupabaseConfigured()) {
      await supabase.from('user_achievements').insert({
        user_id: user.id,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
      });
    }
  };

  const checkAchievements = async (trackerData: any, stats: any) => {
    for (const achievement of userAchievements) {
      if (achievement.unlocked) continue;

      let shouldUnlock = false;

      switch (achievement.requirement.metric) {
        case 'prayers':
          if (achievement.requirement.type === 'streak') {
            shouldUnlock = trackerData.prayers.streak >= achievement.requirement.value;
          }
          break;
        
        case 'dhikr':
          if (achievement.requirement.type === 'streak') {
            shouldUnlock = trackerData.dhikr.streak >= achievement.requirement.value;
          } else if (achievement.requirement.type === 'total') {
            shouldUnlock = (stats?.totalDhikr || 0) >= achievement.requirement.value;
          }
          break;
        
        case 'quran':
          if (achievement.requirement.type === 'streak') {
            shouldUnlock = trackerData.quran.streak >= achievement.requirement.value;
          }
          break;
        
        case 'quran-pages':
          if (achievement.requirement.type === 'total') {
            shouldUnlock = (stats?.totalQuranPages || 0) >= achievement.requirement.value;
          }
          break;
        
        case 'quran-verses':
          if (achievement.requirement.type === 'total') {
            shouldUnlock = (stats?.totalQuranVerses || 0) >= achievement.requirement.value;
          }
          break;
        
        case 'lectures':
          if (achievement.requirement.type === 'count') {
            shouldUnlock = (stats?.lecturesWatched || 0) >= achievement.requirement.value;
          }
          break;
        
        case 'workouts':
          if (achievement.requirement.type === 'count') {
            shouldUnlock = (stats?.workoutsCompleted || 0) >= achievement.requirement.value;
          }
          break;
      }

      if (shouldUnlock) {
        await unlockAchievement(achievement);
      }
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    const updateChallenges = (challenges: Challenge[]) => {
      return challenges.map(challenge => {
        if (challenge.id === challengeId) {
          const completed = progress >= challenge.requirement.value;
          if (completed && !challenge.completed) {
            const newPoints = totalPoints + challenge.reward.points;
            setTotalPoints(newPoints);
            AsyncStorage.setItem(POINTS_STORAGE_KEY, newPoints.toString());
            
            Alert.alert(
              '✅ Challenge Complete!',
              `${challenge.title}\n\n+${challenge.reward.points} points`,
              [{ text: 'Great!', style: 'default' }]
            );
          }
          return { ...challenge, progress, completed };
        }
        return challenge;
      });
    };

    const updatedDaily = updateChallenges(dailyChallenges);
    const updatedWeekly = updateChallenges(weeklyChallenges);
    
    setDailyChallenges(updatedDaily);
    setWeeklyChallenges(updatedWeekly);

    await AsyncStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify({
      date: new Date().toDateString(),
      daily: updatedDaily,
      weekly: updatedWeekly,
    }));
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements: userAchievements,
        dailyChallenges,
        weeklyChallenges,
        totalPoints,
        checkAchievements,
        updateChallengeProgress,
        loadAchievements,
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
