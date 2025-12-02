
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Dimensions, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Location from 'expo-location';
import { calculatePrayerTimes, getNextPrayer, PrayerTime } from '@/utils/prayerTimes';
import { getDailyContent, DailyHadith, DailyVerse } from '@/data/dailyContent';
import ProgressRings from '@/components/ProgressRings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTracker } from '@/contexts/TrackerContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { miracleCategories, Miracle } from '@/data/miracles';
import { router } from 'expo-router';
import { useAchievements } from '@/contexts/AchievementContext';

interface Prayer extends PrayerTime {
  completed: boolean;
}

const { width } = Dimensions.get('window');

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

  const [weeklyMiracle, setWeeklyMiracle] = useState<Miracle | null>(null);
  const [showMiracleModal, setShowMiracleModal] = useState(false);

  useEffect(() => {
    loadDailyContent();
    loadWeeklyMiracle();
    syncWeeklyChallenges();
  }, []);

  const syncWeeklyChallenges = async () => {
    try {
      console.log('Syncing weekly challenges from home screen...');
      const weeklyStats = await getWeeklyStats();
      console.log('Weekly stats:', weeklyStats);
      
      await updateChallengeProgress('weekly-dhikr-2000', weeklyStats.dhikrCount);
      await updateChallengeProgress('weekly-quran-35-pages', weeklyStats.quranPages);
      await updateChallengeProgress('weekly-prayer-streak', weeklyStats.prayerDays);
    } catch (error) {
      console.error('Error syncing weekly challenges:', error);
    }
  };

  const loadDailyContent = async () => {
    try {
      console.log('Loading daily content...');
      const content = await getDailyContent();
      setDailyVerse(content.verse);
      setDailyHadith(content.hadith);
      console.log('Daily content loaded successfully');
    } catch (error) {
      console.error('Error loading daily content:', error);
    } finally {
      setLoadingDailyContent(false);
    }
  };

  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  };

  const loadWeeklyMiracle = async () => {
    try {
      const weekStart = getWeekStartDate();
      console.log('Loading weekly miracle for week starting:', weekStart);
      
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('weekly_lectures')
          .select('miracle_id')
          .eq('week_start_date', weekStart)
          .single();

        if (data && !error) {
          console.log('Found weekly miracle in database:', data.miracle_id);
          const miracle = findMiracleById(data.miracle_id);
          if (miracle) {
            setWeeklyMiracle(miracle);
            return;
          }
        } else {
          console.log('No weekly miracle found in database, selecting new one');
        }
      }

      const allMiracles: Miracle[] = [];
      miracleCategories.forEach(category => {
        allMiracles.push(...category.miracles);
      });

      if (allMiracles.length > 0) {
        const randomIndex = Math.floor(Math.random() * allMiracles.length);
        const selectedMiracle = allMiracles[randomIndex];
        console.log('Selected new weekly miracle:', selectedMiracle.id);
        setWeeklyMiracle(selectedMiracle);

        if (isSupabaseConfigured()) {
          const { error: insertError } = await supabase
            .from('weekly_lectures')
            .upsert({
              week_start_date: weekStart,
              miracle_id: selectedMiracle.id,
            }, {
              onConflict: 'week_start_date'
            });
          
          if (insertError) {
            console.error('Error saving weekly miracle:', insertError);
          } else {
            console.log('Weekly miracle saved to database');
          }
        }
      }
    } catch (error) {
      console.error('Error loading weekly miracle:', error);
    }
  };

  const findMiracleById = (id: string): Miracle | null => {
    for (const category of miracleCategories) {
      const miracle = category.miracles.find(m => m.id === id);
      if (miracle) return miracle;
    }
    return null;
  };

  useEffect(() => {
    loadPrayerStatus();
  }, []);

  useEffect(() => {
    requestLocationPermission();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location) {
      const prayerTimes = calculatePrayerTimes(location, currentTime);
      setPrayers(prevPrayers => {
        return prayerTimes.map((pt, index) => ({
          ...pt,
          completed: prevPrayers[index]?.completed || false
        }));
      });
    }
  }, [location]);

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

  const loadPrayerStatus = async () => {
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

  const handleProfilePress = () => {
    console.log('=== PROFILE BUTTON PRESSED ===');
    router.push('/(tabs)/profile');
  };

  console.log('Home screen rendering with challenges:', weeklyChallenges.length);

  return (
    <View style={styles.container}>
      <View style={styles.headerButtonsContainer} pointerEvents="box-none">
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="person.circle.fill"
            android_material_icon_name="account-circle"
            size={32}
            color={colors.primary}
          />
        </TouchableOpacity>
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
            <React.Fragment>
              <View style={styles.nextPrayerContent}>
                <View>
                  <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                  <Text style={styles.countdown}>in {timeUntilNext}</Text>
                </View>
                <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
              </View>
            </React.Fragment>
          )}
        </View>

        {weeklyMiracle && (
          <TouchableOpacity
            style={styles.weeklyLectureCard}
            onPress={() => setShowMiracleModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.weeklyLectureHeader}>
              <View style={styles.weeklyLectureIcon}>
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={24}
                  color={colors.card}
                />
              </View>
              <View style={styles.weeklyLectureText}>
                <Text style={styles.weeklyLectureLabel}>Weekly Miracle</Text>
                <Text style={styles.weeklyLectureTitle}>{weeklyMiracle.title}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={24}
                color={colors.card}
              />
            </View>
            <Text style={styles.weeklyLectureDescription} numberOfLines={2}>
              {weeklyMiracle.description}
            </Text>
          </TouchableOpacity>
        )}

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
          
          {weeklyChallenges.length > 0 && (
            <View style={styles.challengesPreview}>
              {weeklyChallenges.slice(0, 3).map((challenge, index) => (
                <View key={`challenge-preview-${challenge.id}-${index}`} style={styles.challengePreviewItem}>
                  <View style={styles.challengePreviewBar}>
                    <View 
                      style={[
                        styles.challengePreviewFill, 
                        { 
                          width: `${Math.min((challenge.progress / challenge.requirement.value) * 100, 100)}%`,
                          backgroundColor: challenge.completed ? colors.success : colors.card
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.challengePreviewText} numberOfLines={1}>
                    {challenge.title}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {!loadingDailyContent && dailyVerse && dailyHadith && (
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
        )}

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
              key={`prayer-${prayer.name}-${index}`}
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

      <Modal
        visible={showMiracleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMiracleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{weeklyMiracle?.title}</Text>
              <TouchableOpacity onPress={() => setShowMiracleModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalDescription}>{weeklyMiracle?.description}</Text>
              
              <Text style={styles.modalSectionTitle}>Details</Text>
              <Text style={styles.modalText}>{weeklyMiracle?.details}</Text>

              <Text style={styles.modalSectionTitle}>Explanation</Text>
              <Text style={styles.modalText}>{weeklyMiracle?.explanation}</Text>

              {weeklyMiracle?.quranVerses && weeklyMiracle.quranVerses.length > 0 && (
                <React.Fragment>
                  <Text style={styles.modalSectionTitle}>Quranic References</Text>
                  {weeklyMiracle.quranVerses.map((verse, index) => (
                    <View key={`verse-${index}`} style={styles.verseCard}>
                      <Text style={styles.verseArabic}>{verse.arabic}</Text>
                      <Text style={styles.verseTranslation}>{verse.translation}</Text>
                      <Text style={styles.verseReference}>Quran {verse.surah}:{verse.verse}</Text>
                    </View>
                  ))}
                </React.Fragment>
              )}

              {weeklyMiracle?.hadiths && weeklyMiracle.hadiths.length > 0 && (
                <React.Fragment>
                  <Text style={styles.modalSectionTitle}>Hadith References</Text>
                  {weeklyMiracle.hadiths.map((hadith, index) => (
                    <View key={`hadith-${index}`} style={styles.hadithCard}>
                      <Text style={styles.hadithText}>{hadith.text}</Text>
                      <Text style={styles.hadithReference}>{hadith.source}</Text>
                    </View>
                  ))}
                </React.Fragment>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButtonsContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    right: 16,
    zIndex: 1000,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'android' ? 48 : 16,
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
    boxShadow: '0px 4px 12px rgba(63, 81, 181, 0.3)',
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
  weeklyLectureCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  weeklyLectureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  weeklyLectureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklyLectureText: {
    flex: 1,
  },
  weeklyLectureLabel: {
    fontSize: 12,
    color: colors.card,
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: 4,
  },
  weeklyLectureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  weeklyLectureDescription: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
    lineHeight: 20,
  },
  challengesCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 188, 212, 0.3)',
    elevation: 4,
  },
  challengesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
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
  challengesPreview: {
    gap: 8,
  },
  challengePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  challengePreviewBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  challengePreviewFill: {
    height: '100%',
    borderRadius: 3,
  },
  challengePreviewText: {
    fontSize: 11,
    color: colors.card,
    opacity: 0.9,
    width: 100,
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
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.12)',
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
    boxShadow: '0px 2px 6px rgba(63, 81, 181, 0.3)',
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
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.12)',
    elevation: 3,
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  modalScroll: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  verseCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  verseArabic: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 26,
  },
  verseTranslation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  verseReference: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  hadithCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  hadithText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  hadithReference: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
