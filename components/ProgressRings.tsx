
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
  size?: number;
  showLabels?: boolean;
}

export default function ProgressRings({ 
  prayers, 
  dhikr, 
  quran, 
  size = 300,
  showLabels = true 
}: ProgressRingsProps) {
  const strokeWidth = 16;
  const center = size / 2;
  
  // Calculate radii for three concentric rings
  const radius1 = (size - strokeWidth) / 2 - 10; // Outer ring (Prayers)
  const radius2 = radius1 - strokeWidth - 8;      // Middle ring (Quran)
  const radius3 = radius2 - strokeWidth - 8;      // Inner ring (Dhikr)
  
  const circumference1 = 2 * Math.PI * radius1;
  const circumference2 = 2 * Math.PI * radius2;
  const circumference3 = 2 * Math.PI * radius3;

  // Calculate progress percentages
  const prayersProgress = prayers.total > 0 ? prayers.completed / prayers.total : 0;
  const dhikrProgress = dhikr.goal > 0 ? Math.min(dhikr.count / dhikr.goal, 1) : 0;
  
  // Calculate Quran progress as 50% pages + 50% verses
  const pagesProgress = quran.goal > 0 ? Math.min(quran.pages / quran.goal, 1) : 0;
  const versesProgress = quran.versesGoal > 0 ? Math.min(quran.versesMemorized / quran.versesGoal, 1) : 0;
  const quranProgress = (pagesProgress * 0.5) + (versesProgress * 0.5);

  // Calculate stroke dash offsets
  const prayersOffset = circumference1 - prayersProgress * circumference1;
  const quranOffset = circumference2 - quranProgress * circumference2;
  const dhikrOffset = circumference3 - dhikrProgress * circumference3;

  // Color based on progress
  const getPrayerColor = () => {
    if (prayersProgress >= 1) return colors.success;
    if (prayersProgress >= 0.6) return colors.primaryLight;
    return colors.primary;
  };

  const getQuranColor = () => {
    if (quranProgress >= 1) return colors.success;
    if (quranProgress >= 0.6) return '#4CAF50';
    return colors.accent;
  };

  const getDhikrColor = () => {
    if (dhikrProgress >= 1) return colors.success;
    if (dhikrProgress >= 0.6) return colors.secondaryLight;
    return colors.secondary;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Prayers Ring (Outer) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={radius1}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Prayers Ring (Outer) - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={radius1}
          stroke={getPrayerColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference1}
          strokeDashoffset={prayersOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Quran Ring (Middle) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={radius2}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Quran Ring (Middle) - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={radius2}
          stroke={getQuranColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference2}
          strokeDashoffset={quranOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Dhikr Ring (Inner) - Background */}
        <Circle
          cx={center}
          cy={center}
          r={radius3}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Dhikr Ring (Inner) - Progress */}
        <Circle
          cx={center}
          cy={center}
          r={radius3}
          stroke={getDhikrColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference3}
          strokeDashoffset={dhikrOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center Content - Centered Text */}
      <View style={[styles.centerContent, { width: radius3 * 2, height: radius3 * 2 }]}>
        <Text style={styles.centerTitle}>Iman{'\n'}Tracker</Text>
      </View>

      {/* Labels */}
      {showLabels && (
        <View style={styles.labelsContainer}>
          <View style={styles.labelRow}>
            <View style={[styles.labelDot, { backgroundColor: getPrayerColor() }]} />
            <Text style={styles.labelText}>
              Prayers {prayers.completed}/{prayers.total}
            </Text>
          </View>
          <View style={styles.labelRow}>
            <View style={[styles.labelDot, { backgroundColor: getQuranColor() }]} />
            <Text style={styles.labelText}>
              Quran {Math.round(quranProgress * 100)}%
            </Text>
          </View>
          <View style={styles.labelRow}>
            <View style={[styles.labelDot, { backgroundColor: getDhikrColor() }]} />
            <Text style={styles.labelText}>
              Dhikr {dhikr.count}/{dhikr.goal}
            </Text>
          </View>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  labelsContainer: {
    marginTop: 20,
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  labelText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});
