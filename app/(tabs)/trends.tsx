
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useTracker } from '@/contexts/TrackerContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Svg, { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';

type TimeRange = 'week' | 'month';

interface DailyData {
  date: string;
  prayers_completed: number;
  prayers_total: number;
  dhikr_count: number;
  dhikr_goal: number;
  quran_pages: number;
  quran_goal: number;
  quran_verses_memorized: number;
  quran_verses_goal: number;
}

interface TrendStats {
  average: number;
  total: number;
  bestDay: number;
  completionRate: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRAPH_WIDTH = SCREEN_WIDTH - 64;
const GRAPH_HEIGHT = 200;

export default function TrendsScreen() {
  const { user } = useAuth();
  const { trackerData } = useTracker();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'prayers' | 'dhikr' | 'quran'>('prayers');

  useEffect(() => {
    loadTrendsData();
  }, [user, timeRange]);

  const loadTrendsData = async () => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);

      // Fetch weekly data
      const { data: weekData, error: weekError } = await supabase
        .from('iman_tracker')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (weekError) {
        console.error('Error fetching weekly data:', weekError);
      } else {
        setWeeklyData(weekData || []);
      }

      // Fetch monthly data
      const { data: monthData, error: monthError } = await supabase
        .from('iman_tracker')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', monthAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (monthError) {
        console.error('Error fetching monthly data:', monthError);
      } else {
        setMonthlyData(monthData || []);
      }
    } catch (error) {
      console.error('Error loading trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = (): DailyData[] => {
    return timeRange === 'week' ? weeklyData : monthlyData;
  };

  const calculateStats = (metric: 'prayers' | 'dhikr' | 'quran'): TrendStats => {
    const data = getCurrentData();
    if (data.length === 0) {
      return { average: 0, total: 0, bestDay: 0, completionRate: 0 };
    }

    let total = 0;
    let goalTotal = 0;
    let bestDay = 0;

    data.forEach(day => {
      let value = 0;
      let goal = 0;

      if (metric === 'prayers') {
        value = day.prayers_completed;
        goal = day.prayers_total;
      } else if (metric === 'dhikr') {
        value = day.dhikr_count;
        goal = day.dhikr_goal;
      } else if (metric === 'quran') {
        // Calculate combined progress (50% pages + 50% verses)
        const pagesProgress = day.quran_goal > 0 ? (day.quran_pages / day.quran_goal) : 0;
        const versesProgress = day.quran_verses_goal > 0 ? (day.quran_verses_memorized / day.quran_verses_goal) : 0;
        value = (pagesProgress + versesProgress) * 50; // Scale to 0-100
        goal = 100;
      }

      total += value;
      goalTotal += goal;
      if (value > bestDay) {
        bestDay = value;
      }
    });

    const average = data.length > 0 ? total / data.length : 0;
    const completionRate = goalTotal > 0 ? (total / goalTotal) * 100 : 0;

    return {
      average: Math.round(average * 10) / 10,
      total: Math.round(total),
      bestDay: Math.round(bestDay),
      completionRate: Math.round(completionRate),
    };
  };

  const renderLineGraph = () => {
    const data = getCurrentData();
    if (data.length === 0) {
      return (
        <View style={styles.emptyGraph}>
          <IconSymbol
            ios_icon_name="chart.line.uptrend.xyaxis"
            android_material_icon_name="show-chart"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyGraphText}>No data available yet</Text>
          <Text style={styles.emptyGraphSubtext}>
            Start tracking your faith journey to see trends
          </Text>
        </View>
      );
    }

    const padding = 40;
    const graphWidth = GRAPH_WIDTH - padding * 2;
    const graphHeight = GRAPH_HEIGHT - padding * 2;

    // Get values based on selected metric
    const values = data.map(day => {
      if (selectedMetric === 'prayers') {
        return day.prayers_total > 0 ? (day.prayers_completed / day.prayers_total) * 100 : 0;
      } else if (selectedMetric === 'dhikr') {
        return day.dhikr_goal > 0 ? Math.min((day.dhikr_count / day.dhikr_goal) * 100, 100) : 0;
      } else {
        const pagesProgress = day.quran_goal > 0 ? (day.quran_pages / day.quran_goal) : 0;
        const versesProgress = day.quran_verses_goal > 0 ? (day.quran_verses_memorized / day.quran_verses_goal) : 0;
        return (pagesProgress + versesProgress) * 50;
      }
    });

    const maxValue = Math.max(...values, 100);
    const minValue = 0;
    const valueRange = maxValue - minValue;

    // Calculate points
    const points = values.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * graphWidth;
      const y = padding + graphHeight - ((value - minValue) / valueRange) * graphHeight;
      return { x, y, value };
    });

    // Get color based on metric
    const getColor = () => {
      if (selectedMetric === 'prayers') return colors.primary;
      if (selectedMetric === 'dhikr') return colors.secondary;
      return colors.accent;
    };

    const color = getColor();

    return (
      <View style={styles.graphContainer}>
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value, index) => {
            const y = padding + graphHeight - (value / 100) * graphHeight;
            return (
              <React.Fragment key={`grid-${index}`}>
                <Line
                  x1={padding}
                  y1={y}
                  x2={GRAPH_WIDTH - padding}
                  y2={y}
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={padding - 8}
                  y={y + 4}
                  fontSize="10"
                  fill={colors.textSecondary}
                  textAnchor="end"
                >
                  {value}%
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Line graph */}
          {points.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = points[index - 1];
            return (
              <Line
                key={`line-${index}`}
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill={color}
              stroke={colors.card}
              strokeWidth="2"
            />
          ))}

          {/* Date labels */}
          {data.map((day, index) => {
            if (timeRange === 'week' || index % 5 === 0 || index === data.length - 1) {
              const x = padding + (index / (data.length - 1)) * graphWidth;
              const date = new Date(day.date);
              const label = `${date.getMonth() + 1}/${date.getDate()}`;
              return (
                <SvgText
                  key={`label-${index}`}
                  x={x}
                  y={GRAPH_HEIGHT - 10}
                  fontSize="10"
                  fill={colors.textSecondary}
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              );
            }
            return null;
          })}
        </Svg>
      </View>
    );
  };

  const renderProgressBars = () => {
    const data = getCurrentData();
    if (data.length === 0) return null;

    const recentDays = data.slice(-7); // Show last 7 days

    return (
      <View style={styles.progressBarsContainer}>
        {recentDays.map((day, index) => {
          const date = new Date(day.date);
          const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          let progress = 0;
          if (selectedMetric === 'prayers') {
            progress = day.prayers_total > 0 ? (day.prayers_completed / day.prayers_total) * 100 : 0;
          } else if (selectedMetric === 'dhikr') {
            progress = day.dhikr_goal > 0 ? Math.min((day.dhikr_count / day.dhikr_goal) * 100, 100) : 0;
          } else {
            const pagesProgress = day.quran_goal > 0 ? (day.quran_pages / day.quran_goal) : 0;
            const versesProgress = day.quran_verses_goal > 0 ? (day.quran_verses_memorized / day.quran_verses_goal) : 0;
            progress = (pagesProgress + versesProgress) * 50;
          }

          const getColor = () => {
            if (selectedMetric === 'prayers') return colors.primary;
            if (selectedMetric === 'dhikr') return colors.secondary;
            return colors.accent;
          };

          return (
            <View key={`bar-${index}`} style={styles.progressBarRow}>
              <Text style={styles.progressBarLabel}>{dayLabel}</Text>
              <View style={styles.progressBarTrack}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${Math.min(progress, 100)}%`, backgroundColor: getColor() }
                  ]} 
                />
              </View>
              <Text style={styles.progressBarValue}>{Math.round(progress)}%</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const stats = calculateStats(selectedMetric);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faith Trends</Text>
        <Text style={styles.headerSubtitle}>Track your spiritual progress over time</Text>
      </View>

      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === 'week' && styles.timeRangeButtonActive]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'week' && styles.timeRangeTextActive]}>
            Last Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeRangeButton, timeRange === 'month' && styles.timeRangeButtonActive]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'month' && styles.timeRangeTextActive]}>
            Last Month
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!user || !isSupabaseConfigured() ? (
          <View style={styles.signInPrompt}>
            <IconSymbol
              ios_icon_name="person.crop.circle.badge.exclamationmark"
              android_material_icon_name="account-circle"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.signInTitle}>Sign In Required</Text>
            <Text style={styles.signInText}>
              Please sign in to view your faith tracker trends and progress over time.
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading trends...</Text>
          </View>
        ) : (
          <React.Fragment>
            <View style={styles.metricSelector}>
              <TouchableOpacity
                style={[styles.metricButton, selectedMetric === 'prayers' && styles.metricButtonActivePrayers]}
                onPress={() => setSelectedMetric('prayers')}
              >
                <IconSymbol
                  ios_icon_name="hands.sparkles.fill"
                  android_material_icon_name="favorite"
                  size={20}
                  color={selectedMetric === 'prayers' ? colors.card : colors.primary}
                />
                <Text style={[styles.metricButtonText, selectedMetric === 'prayers' && styles.metricButtonTextActive]}>
                  Prayers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.metricButton, selectedMetric === 'dhikr' && styles.metricButtonActiveDhikr]}
                onPress={() => setSelectedMetric('dhikr')}
              >
                <IconSymbol
                  ios_icon_name="sparkles"
                  android_material_icon_name="auto-awesome"
                  size={20}
                  color={selectedMetric === 'dhikr' ? colors.card : colors.secondary}
                />
                <Text style={[styles.metricButtonText, selectedMetric === 'dhikr' && styles.metricButtonTextActive]}>
                  Dhikr
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.metricButton, selectedMetric === 'quran' && styles.metricButtonActiveQuran]}
                onPress={() => setSelectedMetric('quran')}
              >
                <IconSymbol
                  ios_icon_name="book.fill"
                  android_material_icon_name="menu-book"
                  size={20}
                  color={selectedMetric === 'quran' ? colors.card : colors.accent}
                />
                <Text style={[styles.metricButtonText, selectedMetric === 'quran' && styles.metricButtonTextActive]}>
                  Quran
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="chart.bar.fill"
                  android_material_icon_name="bar-chart"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.statValue}>{stats.average}</Text>
                <Text style={styles.statLabel}>Daily Average</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="sum"
                  android_material_icon_name="functions"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={24}
                  color={colors.warning}
                />
                <Text style={styles.statValue}>{stats.bestDay}</Text>
                <Text style={styles.statLabel}>Best Day</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol
                  ios_icon_name="percent"
                  android_material_icon_name="percent"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.statValue}>{stats.completionRate}%</Text>
                <Text style={styles.statLabel}>Completion</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="chart.line.uptrend.xyaxis"
                  android_material_icon_name="show-chart"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.cardTitle}>Progress Over Time</Text>
              </View>
              {renderLineGraph()}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="calendar"
                  android_material_icon_name="calendar-today"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.cardTitle}>Daily Breakdown</Text>
              </View>
              {renderProgressBars()}
            </View>

            <View style={styles.currentProgressCard}>
              <View style={styles.currentProgressHeader}>
                <IconSymbol
                  ios_icon_name="clock.fill"
                  android_material_icon_name="schedule"
                  size={24}
                  color={colors.accent}
                />
                <Text style={styles.currentProgressTitle}>Today&apos;s Progress</Text>
              </View>
              
              <View style={styles.currentProgressRow}>
                <View style={styles.currentProgressItem}>
                  <Text style={styles.currentProgressLabel}>Prayers</Text>
                  <Text style={styles.currentProgressValue}>
                    {trackerData.prayers.completed}/{trackerData.prayers.total}
                  </Text>
                </View>
                <View style={styles.currentProgressItem}>
                  <Text style={styles.currentProgressLabel}>Dhikr</Text>
                  <Text style={styles.currentProgressValue}>
                    {trackerData.dhikr.count}/{trackerData.dhikr.goal}
                  </Text>
                </View>
                <View style={styles.currentProgressItem}>
                  <Text style={styles.currentProgressLabel}>Quran</Text>
                  <Text style={styles.currentProgressValue}>
                    {trackerData.quran.pages}/{trackerData.quran.goal}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.motivationCard}>
              <IconSymbol
                ios_icon_name="heart.fill"
                android_material_icon_name="favorite"
                size={32}
                color={colors.error}
              />
              <Text style={styles.motivationTitle}>Keep Growing!</Text>
              <Text style={styles.motivationText}>
                &quot;The most beloved deeds to Allah are those that are most consistent, even if they are small.&quot;
              </Text>
              <Text style={styles.motivationReference}>- Prophet Muhammad ﷺ</Text>
            </View>
          </React.Fragment>
        )}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    fontSize: 15,
    color: colors.textSecondary,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timeRangeTextActive: {
    color: colors.card,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  signInPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  signInText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  metricSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  metricButtonActivePrayers: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metricButtonActiveDhikr: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  metricButtonActiveQuran: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  metricButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  metricButtonTextActive: {
    color: colors.card,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  graphContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  emptyGraph: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyGraphText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyGraphSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressBarsContainer: {
    gap: 12,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    width: 40,
  },
  progressBarTrack: {
    flex: 1,
    height: 24,
    backgroundColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 12,
  },
  progressBarValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    width: 45,
    textAlign: 'right',
  },
  currentProgressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  currentProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  currentProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  currentProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currentProgressItem: {
    alignItems: 'center',
  },
  currentProgressLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  currentProgressValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  motivationReference: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
