
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingsProps {
  prayers: { completed: number; total: number; streak: number };
  dhikr: { count: number; goal: number; streak: number };
  quran: { 
    pages: number; 
    goal: number; 
    streak: number;
    versesMemorized: number;
    versesGoal: number;
  };
}

export default function ProgressRings({ prayers, dhikr, quran }: ProgressRingsProps) {
  const size = 280;
  const strokeWidth = 20;
  const center = size / 2;
  const radius1 = (size - strokeWidth) / 2 - 10;
  const radius2 = radius1 - strokeWidth - 10;
  const radius3 = radius2 - strokeWidth - 10;
  const circumference1 = 2 * Math.PI * radius1;
  const circumference2 = 2 * Math.PI * radius2;
  const circumference3 = 2 * Math.PI * radius3;

  const prayersProgress = prayers.total > 0 ? prayers.completed / prayers.total : 0;
  const dhikrProgress = dhikr.goal > 0 ? Math.min(dhikr.count / dhikr.goal, 1) : 0;
  
  // Both pages and verses must be completed for full Quran progress
  const pagesProgress = quran.goal > 0 ? Math.min(quran.pages / quran.goal, 1) : 0;
  const versesProgress = quran.versesGoal > 0 ? Math.min(quran.versesMemorized / quran.versesGoal, 1) : 0;
  const quranProgress = Math.min(pagesProgress, versesProgress); // Use the minimum of both

  const prayersOffset = circumference1 - prayersProgress * circumference1;
  const dhikrOffset = circumference2 - dhikrProgress * circumference2;
  const quranOffset = circumference3 - quranProgress * circumference3;

  const getProgressColor = (progress: number) => {
    if (progress >= 1) return colors.success;
    if (progress >= 0.5) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Prayers Ring (Outer) */}
        <Circle
          cx={center}
          cy={center}
          r={radius1}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius1}
          stroke={getProgressColor(prayersProgress)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference1}
          strokeDashoffset={prayersOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Dhikr Ring (Middle) */}
        <Circle
          cx={center}
          cy={center}
          r={radius2}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius2}
          stroke={colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference2}
          strokeDashoffset={dhikrOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Quran Ring (Inner) */}
        <Circle
          cx={center}
          cy={center}
          r={radius3}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius3}
          stroke={colors.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference3}
          strokeDashoffset={quranOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        <Text style={styles.centerTitle}>Daily Progress</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: getProgressColor(prayersProgress) }]} />
            <Text style={styles.statText}>Prayers: {Math.round(prayersProgress * 100)}%</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: colors.secondary }]} />
            <Text style={styles.statText}>Dhikr: {Math.round(dhikrProgress * 100)}%</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: colors.accent }]} />
            <Text style={styles.statText}>Quran: {Math.round(quranProgress * 100)}%</Text>
          </View>
        </View>
        {quranProgress < 1 && (pagesProgress < 1 || versesProgress < 1) && (
          <Text style={styles.quranNote}>
            Complete both reading and memorization goals
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statsContainer: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  quranNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 180,
  },
});
