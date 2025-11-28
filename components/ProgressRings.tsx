
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';

interface ProgressRingsProps {
  prayers: { completed: number; total: number };
  dhikr: { count: number; goal: number };
  quran: { pages: number; goal: number };
}

export default function ProgressRings({ prayers, dhikr, quran }: ProgressRingsProps) {
  const size = 280;
  const center = size / 2;
  const strokeWidth = 20;
  
  const outerRadius = (size - strokeWidth) / 2 - 10;
  const middleRadius = outerRadius - strokeWidth - 8;
  const innerRadius = middleRadius - strokeWidth - 8;
  
  const prayersPercentage = (prayers.completed / prayers.total) * 100;
  const dhikrPercentage = (dhikr.count / dhikr.goal) * 100;
  const quranPercentage = (quran.pages / quran.goal) * 100;
  
  const getCircumference = (radius: number) => 2 * Math.PI * radius;
  const getStrokeDashoffset = (radius: number, percentage: number) => {
    const circumference = getCircumference(radius);
    return circumference - (percentage / 100) * circumference;
  };
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={getCircumference(outerRadius)}
          strokeDashoffset={getStrokeDashoffset(outerRadius, prayersPercentage)}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={middleRadius}
          stroke={colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={getCircumference(middleRadius)}
          strokeDashoffset={getStrokeDashoffset(middleRadius, dhikrPercentage)}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke={colors.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={getCircumference(innerRadius)}
          strokeDashoffset={getStrokeDashoffset(innerRadius, quranPercentage)}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      
      <View style={styles.centerContent}>
        <Text style={styles.centerTitle}>Today&apos;s</Text>
        <Text style={styles.centerSubtitle}>Progress</Text>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Prayers ({prayers.completed}/{prayers.total})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
          <Text style={styles.legendText}>Dhikr ({dhikr.count}/{dhikr.goal})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Quran ({quran.pages}/{quran.goal})</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  centerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  legend: {
    marginTop: 24,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
