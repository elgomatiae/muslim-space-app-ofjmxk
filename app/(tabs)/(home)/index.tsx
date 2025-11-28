
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface Prayer {
  name: string;
  time: string;
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
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let next: Prayer | null = null;
    let minDiff = Infinity;

    prayers.forEach(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      const diff = prayerMinutes - currentMinutes;

      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        next = prayer;
      }
    });

    if (!next) {
      next = prayers[0];
      const [hours, minutes] = next.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      minDiff = (24 * 60 - currentMinutes) + prayerMinutes;
    }

    setNextPrayer(next);

    const hours = Math.floor(minDiff / 60);
    const mins = minDiff % 60;
    setTimeUntilNext(`${hours}h ${mins}m`);
  }, [currentTime, prayers]);

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
          <IconSymbol
            ios_icon_name="bell.fill"
            android_material_icon_name="notifications"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
        </View>
        {nextPrayer && (
          <React.Fragment>
            <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
            <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
            <Text style={styles.countdown}>in {timeUntilNext}</Text>
          </React.Fragment>
        )}
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

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu-book"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.actionLabel}>Quran</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol
              ios_icon_name="hands.sparkles.fill"
              android_material_icon_name="favorite"
              size={32}
              color={colors.secondary}
            />
            <Text style={styles.actionLabel}>Duas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol
              ios_icon_name="circle.grid.3x3.fill"
              android_material_icon_name="apps"
              size={32}
              color={colors.accent}
            />
            <Text style={styles.actionLabel}>Dhikr</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <IconSymbol
              ios_icon_name="compass.fill"
              android_material_icon_name="explore"
              size={32}
              color={colors.highlight}
            />
            <Text style={styles.actionLabel}>Qibla</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
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
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(63, 81, 181, 0.3)',
    elevation: 4,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: colors.card,
    marginLeft: 8,
    fontWeight: '600',
  },
  nextPrayerName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 8,
  },
  nextPrayerTime: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.card,
    marginBottom: 8,
  },
  countdown: {
    fontSize: 16,
    color: colors.card,
    opacity: 0.9,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  prayersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  prayerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  prayerNameCompleted: {
    color: colors.card,
  },
  prayerTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  prayerTimeCompleted: {
    color: colors.card,
    opacity: 0.9,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.card,
    borderColor: colors.card,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    width: '50%',
    padding: 6,
  },
  actionCardInner: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
});
