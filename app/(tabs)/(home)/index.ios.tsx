
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import ProfileButton from '@/components/ProfileButton';
import * as Location from 'expo-location';
import { calculatePrayerTimes, getNextPrayer, PrayerTime } from '@/utils/prayerTimes';
import { getDailyContent, DailyHadith, DailyVerse } from '@/data/dailyContent';
import ProgressRings from '@/components/ProgressRings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTracker } from '@/contexts/TrackerContext';
import { router } from 'expo-router';
import { useAchievements } from '@/contexts/AchievementContext';

interface Prayer extends PrayerTime {
  completed: boolean;
}

const PRAYER_STORAGE_KEY = '@prayer_completion';
const PRAYER_DATE_KEY = '@prayer_date';

export default function HomeScreen() {
  const { trackerData, updatePrayers, getWeeklyStats } = useTracker();
  const { weeklyChallenges, updateChallengeProgress } = useAchievements();
  
  const [prayers, setPrayers] = useState<Prayer[]>([
    { name: 'Fajr', time: '05:30', completed: false },
    { name: 'Dhuhr', time: '12:45', completed: false },
    { name: 'Asr', time: '16:15', completed: false },
    { name: 'Maghrib', time: '18:45', completed: false },
    { name: 'Isha', time: '20:15', completed: false },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState(false);

  const [dailyHadith, setDailyHadith] = useState<DailyHadith | null>(null);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [loadingDailyContent, setLoadingDailyContent] = useState(true);
  const [dailyContentError, setDailyContentError] = useState(false);

  const syncWeeklyChallenges = useCallback(async () => {
    try {
      const weeklyStats = await getWeeklyStats();
      
      await updateChallengeProgress('weekly-dhikr-2000', weeklyStats.dhikrCount);
      await updateChallengeProgress('weekly-quran-35-pages', weeklyStats.quranPages);
      await updateChallengeProgress('weekly-prayer-streak', weeklyStats.prayerDays);
    } catch (error) {
      console.error('Error syncing weekly challenges:', error);
    }
  }, [getWeeklyStats, updateChallengeProgress]);

  useEffect(() => {
    loadDailyContent();
    syncWeeklyChallenges();
  }, [syncWeeklyChallenges]);

  const loadDailyContent = async () => {
    try {
      console.log('Starting to load daily content...');
      setLoadingDailyContent(true);
      setDailyContentError(false);
      
      const content = await getDailyContent();
      console.log('Daily content received:', content);
      
      if (content && content.verse && content.hadith) {
        setDailyVerse(content.verse);
        setDailyHadith(content.hadith);
        console.log('Daily content loaded successfully');
      } else {
        console.error('Invalid daily content structure:', content);
        setDailyContentError(true);
      }
    } catch (error) {
      console.error('Error loading daily content:', error);
      setDailyContentError(true);
    } finally {
      setLoadingDailyContent(false);
    }
  };

  const loadPrayerStatus = useCallback(async () => {
    try {
      const savedDate = await AsyncStorage.getItem(PRAYER_DATE_KEY);
      const todayDate = getTodayDateString();

      if (savedDate !== todayDate) {
        console.log('New day detected, resetting prayer status');
        await AsyncStorage.setItem(PRAYER_DATE_KEY, todayDate);
        await AsyncStorage.removeItem(PRAYER_STORAGE_KEY);
        return;
      }

      const savedStatus = await AsyncStorage.getItem(PRAYER_STORAGE_KEY);
      if (savedStatus) {
        const completionStatus = JSON.parse(savedStatus);
        console.log('Loaded prayer status:', completionStatus);
        setPrayers(prevPrayers =>
          prevPrayers.map((prayer, index) => ({
            ...prayer,
            completed: completionStatus[index] || false
          }))
        );
      }
    } catch (error) {
      console.log('Error loading prayer status:', error);
    }
  }, []);

  useEffect(() => {
    loadPrayerStatus();
  }, [loadPrayerStatus]);

  useEffect(() => {
    requestLocationPermission();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location && currentTime) {
      const prayerTimes = calculatePrayerTimes(location, currentTime);
      setPrayers(prevPrayers => {
        return prayerTimes.map((pt, index) => ({
          ...pt,
          completed: prevPrayers[index]?.completed || false
        }));
      });
    }
  }, [location, currentTime]);

  useEffect(() => {
    const result = getNextPrayer(prayers, currentTime);
    if (result) {
      setNextPrayer(result.prayer);
      setTimeUntilNext(result.timeUntil);
    }
  }, [currentTime, prayers]);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const savePrayerStatus = async (updatedPrayers: Prayer[]) => {
    try {
      const completionStatus = updatedPrayers.map(p => p.completed);
      await AsyncStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(completionStatus));
      await AsyncStorage.setItem(PRAYER_DATE_KEY, getTodayDateString());
      console.log('Saved prayer status:', completionStatus);
      
      const completedCount = updatedPrayers.filter(p => p.completed).length;
      await updatePrayers(completedCount, updatedPrayers.length);
      
      await syncWeeklyChallenges();
    } catch (error) {
      console.log('Error saving prayer status:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        Alert.alert(
          'Location Permission',
          'Please enable location services to get accurate prayer times for your area.',
          [{ text: 'OK' }]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLocationError(false);
    } catch (error) {
      console.log('Error getting location:', error);
      setLocationError(true);
    }
  };

  const togglePrayer = (index: number) => {
    const newPrayers = [...prayers];
    newPrayers[index].completed = !newPrayers[index].completed;
    setPrayers(newPrayers);
    savePrayerStatus(newPrayers);
  };

  const completedCount = prayers.filter(p => p.completed).length;

  console.log('Daily verse:', dailyVerse);
  console.log('Daily hadith:', dailyHadith);
  console.log('Loading daily content:', loadingDailyContent);

  return (
    <View style={styles.container}>
      <View style={styles.profileButtonContainer}>
        <ProfileButton />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>As-salamu alaykum</Text>
          <Text style={styles.date}>{currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>

        <View style={styles.nextPrayerCard}>
          <View style={styles.nextPrayerHeader}>
            <View style={styles.nextPrayerHeaderLeft}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={20}
                color={colors.card}
              />
              <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
            </View>
            {locationError && (
              <TouchableOpacity onPress={requestLocationPermission}>
                <IconSymbol
                  ios_icon_name="location.slash"
                  android_material_icon_name="location-off"
                  size={20}
                  color={colors.warning}
                />
              </TouchableOpacity>
            )}
          </View>
          {nextPrayer && (
            <View style={styles.nextPrayerContent}>
              <View>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                <Text style={styles.countdown}>in {timeUntilNext}</Text>
              </View>
              <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.challengesCard}
          onPress={() => router.push('/(tabs)/tracker')}
          activeOpacity={0.8}
        >
          <View style={styles.challengesHeader}>
            <View style={styles.challengesIcon}>
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji-events"
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.challengesText}>
              <Text style={styles.challengesLabel}>Weekly Challenges</Text>
              <Text style={styles.challengesTitle}>
                {weeklyChallenges.filter(c => c.completed).length}/{weeklyChallenges.length} Completed
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={colors.card}
            />
          </View>
        </TouchableOpacity>

        {loadingDailyContent ? (
          <View style={styles.dailyContentLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading daily content...</Text>
          </View>
        ) : dailyContentError ? (
          <View style={styles.dailyContentError}>
            <IconSymbol
              ios_icon_name="exclamationmark.triangle"
              android_material_icon_name="error"
              size={32}
              color={colors.warning}
            />
            <Text style={styles.errorText}>Unable to load daily content</Text>
            <TouchableOpacity onPress={loadDailyContent} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : dailyVerse && dailyHadith ? (
          <View style={styles.dailyContentRow}>
            <View style={styles.dailyCardVertical}>
              <View style={styles.dailyCardHeader}>
                <View style={styles.dailyIconCircle}>
                  <IconSymbol
                    ios_icon_name="book.fill"
                    android_material_icon_name="menu-book"
                    size={22}
                    color={colors.card}
                  />
                </View>
                <Text style={styles.dailyCardTitle}>Daily Verse</Text>
              </View>
              <Text style={styles.dailyArabic}>{dailyVerse.arabic}</Text>
              <Text style={styles.dailyTranslation}>{dailyVerse.translation}</Text>
              <Text style={styles.dailyReference}>{dailyVerse.reference}</Text>
            </View>

            <View style={styles.dailyCardVertical}>
              <View style={styles.dailyCardHeader}>
                <View style={[styles.dailyIconCircle, { backgroundColor: colors.secondary }]}>
                  <IconSymbol
                    ios_icon_name="text.quote"
                    android_material_icon_name="format-quote"
                    size={22}
                    color={colors.card}
                  />
                </View>
                <Text style={styles.dailyCardTitle}>Daily Hadith</Text>
              </View>
              <Text style={styles.dailyArabic}>{dailyHadith.arabic}</Text>
              <Text style={styles.dailyTranslation}>{dailyHadith.translation}</Text>
              <Text style={styles.dailyReference}>{dailyHadith.reference}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.trackerCard}>
          <ProgressRings
            prayers={trackerData.prayers}
            dhikr={trackerData.dhikr}
            quran={{ pages: trackerData.quran.pages, goal: trackerData.quran.goal, streak: trackerData.quran.streak, versesMemorized: trackerData.quran.versesMemorized, versesGoal: trackerData.quran.versesGoal }}
          />
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Prayer Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completedCount / prayers.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{completedCount} of {prayers.length} prayers completed</Text>
        </View>

        <View style={styles.prayersSection}>
          <Text style={styles.sectionTitle}>Prayer Times</Text>
          {prayers.map((prayer, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.prayerCard, prayer.completed && styles.prayerCardCompleted]}
              onPress={() => togglePrayer(index)}
              activeOpacity={0.7}
            >
              <View style={styles.prayerInfo}>
                <Text style={[styles.prayerName, prayer.completed && styles.prayerNameCompleted]}>
                  {prayer.name}
                </Text>
                <Text style={[styles.prayerTime, prayer.completed && styles.prayerTimeCompleted]}>
                  {prayer.time}
                </Text>
              </View>
              <View style={[styles.checkbox, prayer.completed && styles.checkboxCompleted]}>
                {prayer.completed && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={18}
                    color={colors.card}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 70,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nextPrayerCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3F51B5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nextPrayerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPrayerLabel: {
    fontSize: 13,
    color: colors.card,
    marginLeft: 6,
    fontWeight: '600',
    opacity: 0.9,
  },
  nextPrayerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPrayerName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 4,
  },
  nextPrayerTime: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.card,
  },
  countdown: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.85,
  },
  challengesCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#03A9F4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  challengesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  challengesIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengesText: {
    flex: 1,
  },
  challengesLabel: {
    fontSize: 12,
    color: colors.card,
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  dailyContentLoading: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  dailyContentError: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  dailyContentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dailyCardVertical: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 300,
  },
  dailyCardHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#3F51B5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  dailyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  dailyArabic: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 30,
  },
  dailyTranslation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'left',
  },
  dailyReference: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 'auto',
    textAlign: 'center',
  },
  trackerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  prayersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  prayerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  prayerCardCompleted: {
    backgroundColor: colors.success,
    opacity: 0.8,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  prayerNameCompleted: {
    color: colors.card,
  },
  prayerTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  prayerTimeCompleted: {
    color: colors.card,
    opacity: 0.9,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.card,
    borderColor: colors.card,
  },
});
