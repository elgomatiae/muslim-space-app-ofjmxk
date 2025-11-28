
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Location from 'expo-location';
import { calculatePrayerTimes, getNextPrayer, PrayerTime } from '@/utils/prayerTimes';
import { getDailyHadith, getDailyVerse } from '@/data/dailyContent';

interface Prayer extends PrayerTime {
  completed: boolean;
}

export default function HomeScreen() {
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

  const dailyHadith = getDailyHadith();
  const dailyVerse = getDailyVerse();

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
      setPrayers(prayerTimes.map(pt => ({ ...pt, completed: false })));
    }
  }, [location]);

  useEffect(() => {
    const result = getNextPrayer(prayers, currentTime);
    if (result) {
      setNextPrayer(result.prayer);
      setTimeUntilNext(result.timeUntil);
    }
  }, [currentTime, prayers]);

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
  };

  const completedCount = prayers.filter(p => p.completed).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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

      <View style={styles.dailyContentSection}>
        <View style={styles.dailyCard}>
          <View style={styles.dailyCardHeader}>
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu-book"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.dailyCardTitle}>Daily Verse</Text>
          </View>
          <Text style={styles.dailyArabic}>{dailyVerse.arabic}</Text>
          <Text style={styles.dailyTranslation}>{dailyVerse.translation}</Text>
          <Text style={styles.dailyReference}>{dailyVerse.reference}</Text>
        </View>

        <View style={styles.dailyCard}>
          <View style={styles.dailyCardHeader}>
            <IconSymbol
              ios_icon_name="text.quote"
              android_material_icon_name="format-quote"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.dailyCardTitle}>Daily Hadith</Text>
          </View>
          <Text style={styles.dailyArabic}>{dailyHadith.arabic}</Text>
          <Text style={styles.dailyTranslation}>{dailyHadith.translation}</Text>
          <Text style={styles.dailyReference}>{dailyHadith.reference}</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingTop: 16,
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
  dailyContentSection: {
    marginBottom: 16,
  },
  dailyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  dailyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  dailyArabic: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 10,
    lineHeight: 30,
  },
  dailyTranslation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  dailyReference: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
});
