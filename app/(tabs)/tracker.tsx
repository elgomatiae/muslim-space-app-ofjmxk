
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import Svg, { Circle } from 'react-native-svg';

interface TrackerData {
  prayers: { completed: number; total: number; streak: number };
  dhikr: { count: number; goal: number; streak: number };
  quran: { pages: number; goal: number; streak: number };
}

export default function TrackerScreen() {
  const [trackerData] = useState<TrackerData>({
    prayers: { completed: 3, total: 5, streak: 7 },
    dhikr: { count: 150, goal: 300, streak: 5 },
    quran: { pages: 2, goal: 5, streak: 12 },
  });

  const renderProgressRing = (completed: number, total: number, color: string, size: number = 120) => {
    const percentage = (completed / total) * 100;
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={[styles.progressRing, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth="8"
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.progressRingContent}>
          <Text style={styles.progressRingNumber}>{completed}</Text>
          <Text style={styles.progressRingTotal}>/ {total}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Iman Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your spiritual journey</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today&apos;s Overview</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              {renderProgressRing(trackerData.prayers.completed, trackerData.prayers.total, colors.primary, 100)}
              <Text style={styles.summaryLabel}>Prayers</Text>
            </View>
            <View style={styles.summaryItem}>
              {renderProgressRing(trackerData.dhikr.count, trackerData.dhikr.goal, colors.secondary, 100)}
              <Text style={styles.summaryLabel}>Dhikr</Text>
            </View>
            <View style={styles.summaryItem}>
              {renderProgressRing(trackerData.quran.pages, trackerData.quran.goal, colors.accent, 100)}
              <Text style={styles.summaryLabel}>Quran</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prayers</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <IconSymbol
                ios_icon_name="hands.sparkles.fill"
                android_material_icon_name="favorite"
                size={32}
                color={colors.primary}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Daily Prayers</Text>
                <Text style={styles.detailSubtitle}>
                  {trackerData.prayers.completed} of {trackerData.prayers.total} completed
                </Text>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={20}
                color={colors.warning}
              />
              <Text style={styles.streakText}>{trackerData.prayers.streak} day streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dhikr</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <IconSymbol
                ios_icon_name="circle.grid.3x3.fill"
                android_material_icon_name="apps"
                size={32}
                color={colors.secondary}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Tasbih Counter</Text>
                <Text style={styles.detailSubtitle}>
                  {trackerData.dhikr.count} of {trackerData.dhikr.goal} today
                </Text>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={20}
                color={colors.warning}
              />
              <Text style={styles.streakText}>{trackerData.dhikr.streak} day streak</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Open Counter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quran Reading</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="menu-book"
                size={32}
                color={colors.accent}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Daily Reading</Text>
                <Text style={styles.detailSubtitle}>
                  {trackerData.quran.pages} of {trackerData.quran.goal} pages
                </Text>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={20}
                color={colors.warning}
              />
              <Text style={styles.streakText}>{trackerData.quran.streak} day streak</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Log Pages</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.motivationCard}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={40}
            color={colors.highlight}
          />
          <Text style={styles.motivationTitle}>Keep Going!</Text>
          <Text style={styles.motivationText}>
            &quot;And whoever relies upon Allah - then He is sufficient for him.&quot; (Quran 65:3)
          </Text>
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  progressRing: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  progressRingTotal: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailInfo: {
    flex: 1,
    marginLeft: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  motivationCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(255, 213, 79, 0.3)',
    elevation: 4,
  },
  motivationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
