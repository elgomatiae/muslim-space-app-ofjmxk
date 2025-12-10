
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';

interface WellnessActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: 'mental' | 'physical';
}

const mentalActivities: WellnessActivity[] = [
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Reflect on your blessings and write down what you&apos;re grateful for today',
    icon: 'heart.fill',
    color: colors.error,
    type: 'mental',
  },
  {
    id: 'reflection',
    title: 'Daily Reflection',
    description: 'Take time to reflect on your actions and intentions',
    icon: 'brain.head.profile',
    color: colors.info,
    type: 'mental',
  },
  {
    id: 'stress',
    title: 'Stress Relief Dhikr',
    description: 'Calm your mind with remembrance of Allah',
    icon: 'leaf.fill',
    color: colors.success,
    type: 'mental',
  },
  {
    id: 'mindfulness',
    title: 'Mindful Breathing',
    description: 'Practice mindful breathing exercises',
    icon: 'wind',
    color: colors.primaryLight,
    type: 'mental',
  },
];

const physicalActivities: WellnessActivity[] = [
  {
    id: 'stretching',
    title: 'Morning Stretches',
    description: 'Start your day with gentle stretching exercises',
    icon: 'figure.walk',
    color: colors.secondary,
    type: 'physical',
  },
  {
    id: 'exercise',
    title: 'Light Exercise',
    description: 'Engage in light physical activity',
    icon: 'figure.run',
    color: colors.warning,
    type: 'physical',
  },
  {
    id: 'walking',
    title: 'Daily Walk',
    description: 'Take a walk and enjoy nature',
    icon: 'figure.hiking',
    color: colors.success,
    type: 'physical',
  },
  {
    id: 'hydration',
    title: 'Stay Hydrated',
    description: 'Remember to drink water throughout the day',
    icon: 'drop.fill',
    color: colors.info,
    type: 'physical',
  },
];

export default function WellnessScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedTab, setSelectedTab] = useState<'mental' | 'physical'>('mental');
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());

  const toggleActivity = (activityId: string) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const activities = selectedTab === 'mental' ? mentalActivities : physicalActivities;
  const completedCount = activities.filter(a => completedActivities.has(a.id)).length;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Tab Selector */}
      <View style={[styles.tabContainer, Platform.OS === 'android' && { marginTop: 48 }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'mental' && styles.tabActive,
            selectedTab === 'mental' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('mental')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'mental' && styles.tabTextActive,
            ]}
          >
            Mental Wellness
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'physical' && styles.tabActive,
            selectedTab === 'physical' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('physical')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'physical' && styles.tabTextActive,
            ]}
          >
            Physical Wellness
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <View style={[styles.progressCard, isDark && styles.cardDark]}>
        <Text style={[styles.progressTitle, isDark && styles.textDark]}>
          Today&apos;s Progress
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completedCount / activities.length) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, isDark && styles.textDark]}>
            {completedCount} / {activities.length}
          </Text>
        </View>
      </View>

      {/* Activities List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {activities.map((activity, index) => (
          <TouchableOpacity
            key={`activity-${activity.id}-${index}`}
            style={[
              styles.activityCard,
              isDark && styles.cardDark,
              completedActivities.has(activity.id) && styles.activityCardCompleted,
            ]}
            onPress={() => toggleActivity(activity.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <IconSymbol
                ios_icon_name={activity.icon}
                android_material_icon_name="favorite"
                size={32}
                color={activity.color}
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, isDark && styles.textDark]}>
                {activity.title}
              </Text>
              <Text style={[styles.activityDescription, isDark && styles.textSecondaryDark]}>
                {activity.description}
              </Text>
            </View>
            {completedActivities.has(activity.id) && (
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={28}
                color={colors.success}
              />
            )}
          </TouchableOpacity>
        ))}

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
  tabContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textDark,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
  },
  progressTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  activityCardCompleted: {
    opacity: 0.7,
  },
  activityIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  activityTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  activityDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
