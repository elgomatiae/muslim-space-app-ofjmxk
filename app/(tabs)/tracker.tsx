
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';
import { supabase } from '../../lib/supabase';

interface TrackerData {
  prayers_completed: number;
  prayers_total: number;
  prayers_streak: number;
  dhikr_count: number;
  dhikr_goal: number;
  dhikr_streak: number;
  quran_pages: number;
  quran_goal: number;
  quran_streak: number;
}

export default function TrackerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [trackerData, setTrackerData] = useState<TrackerData>({
    prayers_completed: 0,
    prayers_total: 5,
    prayers_streak: 0,
    dhikr_count: 0,
    dhikr_goal: 300,
    dhikr_streak: 0,
    quran_pages: 0,
    quran_goal: 5,
    quran_streak: 0,
  });
  
  const [dhikrInput, setDhikrInput] = useState('');
  const [quranInput, setQuranInput] = useState('');

  useEffect(() => {
    loadTrackerData();
  }, []);

  const loadTrackerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('iman_tracker')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error) {
        console.log('No tracker data found for today');
      } else if (data) {
        setTrackerData({
          prayers_completed: data.prayers_completed || 0,
          prayers_total: data.prayers_total || 5,
          prayers_streak: data.prayers_streak || 0,
          dhikr_count: data.dhikr_count || 0,
          dhikr_goal: data.dhikr_goal || 300,
          dhikr_streak: data.dhikr_streak || 0,
          quran_pages: data.quran_pages || 0,
          quran_goal: data.quran_goal || 5,
          quran_streak: data.quran_streak || 0,
        });
      }
    } catch (error) {
      console.error('Error loading tracker data:', error);
    }
  };

  const updateDhikr = async () => {
    const count = parseInt(dhikrInput);
    if (isNaN(count) || count <= 0) return;

    const newCount = trackerData.dhikr_count + count;
    setTrackerData(prev => ({ ...prev, dhikr_count: newCount }));
    setDhikrInput('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      await supabase
        .from('iman_tracker')
        .upsert({
          user_id: user.id,
          date: today,
          dhikr_count: newCount,
        });
    } catch (error) {
      console.error('Error updating dhikr:', error);
    }
  };

  const updateQuran = async () => {
    const pages = parseInt(quranInput);
    if (isNaN(pages) || pages <= 0) return;

    const newPages = trackerData.quran_pages + pages;
    setTrackerData(prev => ({ ...prev, quran_pages: newPages }));
    setQuranInput('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      await supabase
        .from('iman_tracker')
        .upsert({
          user_id: user.id,
          date: today,
          quran_pages: newPages,
        });
    } catch (error) {
      console.error('Error updating Quran:', error);
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
    >
      <Text style={[styles.title, isDark && styles.textDark]}>
        Iman Tracker
      </Text>
      <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>
        Track your daily spiritual habits
      </Text>

      {/* Prayers Section */}
      <View style={styles.section}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <IconSymbol
              ios_icon_name="hands.sparkles.fill"
              android_material_icon_name="mosque"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Prayers
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getProgressPercentage(trackerData.prayers_completed, trackerData.prayers_total)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, isDark && styles.textDark]}>
              {trackerData.prayers_completed} / {trackerData.prayers_total}
            </Text>
          </View>

          <View style={styles.streakContainer}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.streakText, isDark && styles.textDark]}>
              {trackerData.prayers_streak} day streak
            </Text>
          </View>
        </View>
      </View>

      {/* Dhikr Section */}
      <View style={styles.section}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <IconSymbol
              ios_icon_name="circle.grid.3x3.fill"
              android_material_icon_name="grid_view"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Dhikr
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getProgressPercentage(trackerData.dhikr_count, trackerData.dhikr_goal)}%`,
                    backgroundColor: colors.secondary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, isDark && styles.textDark]}>
              {trackerData.dhikr_count} / {trackerData.dhikr_goal}
            </Text>
          </View>

          <View style={styles.streakContainer}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.streakText, isDark && styles.textDark]}>
              {trackerData.dhikr_streak} day streak
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Add count..."
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={dhikrInput}
              onChangeText={setDhikrInput}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={updateDhikr}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={20}
                color={colors.textDark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quran Section */}
      <View style={styles.section}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu_book"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Quran Reading
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getProgressPercentage(trackerData.quran_pages, trackerData.quran_goal)}%`,
                    backgroundColor: colors.info,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, isDark && styles.textDark]}>
              {trackerData.quran_pages} / {trackerData.quran_goal} pages
            </Text>
          </View>

          <View style={styles.streakContainer}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.streakText, isDark && styles.textDark]}>
              {trackerData.quran_streak} day streak
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Add pages..."
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={quranInput}
              onChangeText={setQuranInput}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={updateQuran}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={20}
                color={colors.textDark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: isDark => isDark ? colors.surfaceDark : colors.surface,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'right',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  streakText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  inputDark: {
    backgroundColor: colors.backgroundDark,
    color: colors.textDark,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
