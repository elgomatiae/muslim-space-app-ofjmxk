
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
  
  // Calculate Quran progress as 50% pages + 50% verses
  const pagesProgress = quran.goal > 0 ? Math.min(quran.pages / quran.goal, 1) : 0;
  const versesProgress = quran.versesGoal > 0 ? Math.min(quran.versesMemorized / quran.versesGoal, 1) : 0;
  const quranProgress = (pagesProgress * 0.5) + (versesProgress * 0.5); // 50% each

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
        <Text style={styles.centerTitle}>Faith{'\n'}Tracker</Text>
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
});
