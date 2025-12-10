
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/commonStyles';
import { calculatePrayerTimes, getNextPrayer, PrayerTimesData } from '../../utils/prayerTimes';
import { IconSymbol } from '../../components/IconSymbol';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyVerse, setDailyVerse] = useState<any>(null);
  const [dailyHadith, setDailyHadith] = useState<any>(null);
  const [completedPrayers, setCompletedPrayers] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPrayerTimes();
    loadDailyContent();
  }, []);

  const loadPrayerTimes = async () => {
    try {
      const times = await calculatePrayerTimes();
      setPrayerTimes(times);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyContent = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch daily content
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_content')
        .select(`
          *,
          verse:verse_id (arabic, translation, reference),
          hadith:hadith_id (arabic, translation, reference)
        `)
        .eq('content_date', today)
        .single();

      if (dailyError) {
        console.log('No daily content found, will use fallback');
      } else if (dailyData) {
        setDailyVerse(dailyData.verse);
        setDailyHadith(dailyData.hadith);
      }
    } catch (error) {
      console.error('Error loading daily content:', error);
    }
  };

  const togglePrayerCompletion = (prayerName: string) => {
    setCompletedPrayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(prayerName)) {
        newSet.delete(prayerName);
      } else {
        newSet.add(prayerName);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, isDark && styles.textDark]}>
          Loading prayer times...
        </Text>
      </View>
    );
  }

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;
  const prayers = prayerTimes ? [
    { name: 'Fajr', time: prayerTimes.fajr, color: colors.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, color: colors.dhuhr },
    { name: 'Asr', time: prayerTimes.asr, color: colors.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib, color: colors.maghrib },
    { name: 'Isha', time: prayerTimes.isha, color: colors.isha },
  ] : [];

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, isDark && styles.textDark]}>
          As-salamu alaykum
        </Text>
        <Text style={[styles.date, isDark && styles.textSecondaryDark]}>
          {prayerTimes?.date}
        </Text>
      </View>

      {/* Next Prayer Card */}
      {nextPrayer && (
        <View style={[styles.nextPrayerCard, isDark && styles.cardDark, shadows.medium]}>
          <View style={styles.nextPrayerHeader}>
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.nextPrayerLabel, isDark && styles.textSecondaryDark]}>
              Next Prayer
            </Text>
          </View>
          <Text style={[styles.nextPrayerName, isDark && styles.textDark]}>
            {nextPrayer.name}
          </Text>
          <Text style={[styles.nextPrayerTime, isDark && styles.textDark]}>
            {nextPrayer.time}
          </Text>
          <Text style={[styles.nextPrayerCountdown, { color: colors.primary }]}>
            in {nextPrayer.timeUntil}
          </Text>
        </View>
      )}

      {/* Prayer Times List */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
          Today&apos;s Prayers
        </Text>
        {prayers.map((prayer, index) => (
          <TouchableOpacity
            key={`prayer-${prayer.name}-${index}`}
            style={[
              styles.prayerCard,
              isDark && styles.cardDark,
              completedPrayers.has(prayer.name) && styles.prayerCardCompleted,
            ]}
            onPress={() => togglePrayerCompletion(prayer.name)}
            activeOpacity={0.7}
          >
            <View style={styles.prayerInfo}>
              <View style={[styles.prayerDot, { backgroundColor: prayer.color }]} />
              <Text style={[styles.prayerName, isDark && styles.textDark]}>
                {prayer.name}
              </Text>
            </View>
            <View style={styles.prayerRight}>
              <Text style={[styles.prayerTime, isDark && styles.textDark]}>
                {prayer.time}
              </Text>
              {completedPrayers.has(prayer.name) && (
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check_circle"
                  size={24}
                  color={colors.success}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Verse */}
      {dailyVerse && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Daily Verse
          </Text>
          <View style={[styles.contentCard, isDark && styles.cardDark]}>
            <Text style={[styles.arabicText, isDark && styles.textDark]}>
              {dailyVerse.arabic}
            </Text>
            <Text style={[styles.translationText, isDark && styles.textSecondaryDark]}>
              {dailyVerse.translation}
            </Text>
            <Text style={[styles.referenceText, { color: colors.primary }]}>
              {dailyVerse.reference}
            </Text>
          </View>
        </View>
      )}

      {/* Daily Hadith */}
      {dailyHadith && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Daily Hadith
          </Text>
          <View style={[styles.contentCard, isDark && styles.cardDark]}>
            <Text style={[styles.arabicText, isDark && styles.textDark]}>
              {dailyHadith.arabic}
            </Text>
            <Text style={[styles.translationText, isDark && styles.textSecondaryDark]}>
              {dailyHadith.translation}
            </Text>
            <Text style={[styles.referenceText, { color: colors.primary }]}>
              {dailyHadith.reference}
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Padding */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.backgroundDark,
  },
  scrollContent: {
    padding: spacing.md,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  nextPrayerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nextPrayerLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  nextPrayerName: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  nextPrayerTime: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  nextPrayerCountdown: {
    ...typography.body,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  prayerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerCardCompleted: {
    opacity: 0.6,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  prayerName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  prayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prayerTime: {
    ...typography.body,
    color: colors.text,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  arabicText: {
    ...typography.h4,
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  translationText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  referenceText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
