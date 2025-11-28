
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface WellnessActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
}

const mentalWellness: WellnessActivity[] = [
  {
    id: '1',
    title: 'Gratitude Journal',
    description: 'Reflect on your blessings',
    icon: 'heart.text',
    color: colors.secondary,
    duration: '5 min',
  },
  {
    id: '2',
    title: 'Mindful Dhikr',
    description: 'Calm your mind with remembrance',
    icon: 'sparkles',
    color: colors.primary,
    duration: '10 min',
  },
  {
    id: '3',
    title: 'Reflection Time',
    description: 'Connect with your inner self',
    icon: 'moon.stars',
    color: colors.accent,
    duration: '15 min',
  },
];

const physicalWellness: WellnessActivity[] = [
  {
    id: '4',
    title: 'Morning Stretch',
    description: 'Start your day energized',
    icon: 'figure.walk',
    color: colors.success,
    duration: '10 min',
  },
  {
    id: '5',
    title: 'Light Exercise',
    description: 'Keep your body healthy',
    icon: 'figure.run',
    color: colors.warning,
    duration: '20 min',
  },
  {
    id: '6',
    title: 'Breathing Exercise',
    description: 'Improve your focus',
    icon: 'wind',
    color: colors.highlight,
    duration: '5 min',
  },
];

export default function WellnessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness</Text>
        <Text style={styles.headerSubtitle}>Nurture your mind and body</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.quoteCard}>
          <IconSymbol
            ios_icon_name="quote.opening"
            android_material_icon_name="format-quote"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.quoteText}>
            &quot;Indeed, with hardship comes ease.&quot;
          </Text>
          <Text style={styles.quoteReference}>Quran 94:6</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="brain.head.profile"
              android_material_icon_name="psychology"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Mental Wellness</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Strengthen your faith and find inner peace through Islamic practices
          </Text>
          {mentalWellness.map((activity, index) => (
            <TouchableOpacity key={index} style={styles.activityCard} activeOpacity={0.8}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <IconSymbol
                  ios_icon_name={activity.icon as any}
                  android_material_icon_name="favorite"
                  size={24}
                  color={colors.card}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{activity.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="figure.walk"
              android_material_icon_name="directions-walk"
              size={24}
              color={colors.success}
            />
            <Text style={styles.sectionTitle}>Physical Wellness</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Take care of your body as a trust from Allah
          </Text>
          {physicalWellness.map((activity, index) => (
            <TouchableOpacity key={index} style={styles.activityCard} activeOpacity={0.8}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <IconSymbol
                  ios_icon_name={activity.icon as any}
                  android_material_icon_name="directions-walk"
                  size={24}
                  color={colors.card}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{activity.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Daily Wellness Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.tipText}>Start your day with Fajr prayer</Text>
            </View>
            <View style={styles.tipItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.tipText}>Practice gratitude daily</Text>
            </View>
            <View style={styles.tipItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.tipText}>Stay hydrated throughout the day</Text>
            </View>
            <View style={styles.tipItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.tipText}>Take breaks for dhikr and reflection</Text>
            </View>
            <View style={styles.tipItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.tipText}>Get adequate sleep for better worship</Text>
            </View>
          </View>
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
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  quoteCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(63, 81, 181, 0.3)',
    elevation: 4,
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 26,
  },
  quoteReference: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  durationBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tipsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});
