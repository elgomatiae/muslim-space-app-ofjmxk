
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAchievements } from '@/contexts/AchievementContext';
import { Achievement } from '@/data/achievements';
import { Challenge } from '@/data/challenges';

export default function AchievementsScreen() {
  const { achievements, dailyChallenges, weeklyChallenges, totalPoints } = useAchievements();
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'challenges'>('challenges');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completedDailyCount = dailyChallenges.filter(c => c.completed).length;
  const completedWeeklyCount = weeklyChallenges.filter(c => c.completed).length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9C27B0';
      case 'rare': return '#2196F3';
      default: return colors.textSecondary;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return colors.error;
      case 'medium': return colors.warning;
      default: return colors.success;
    }
  };

  const getIconName = (icon: string, platform: 'ios' | 'android') => {
    const iconMap: Record<string, { ios: string; android: string }> = {
      'flame': { ios: 'flame.fill', android: 'local-fire-department' },
      'star': { ios: 'star.fill', android: 'star' },
      'trophy': { ios: 'trophy.fill', android: 'emoji-events' },
      'beads': { ios: 'circle.grid.3x3.fill', android: 'grid-on' },
      'medal': { ios: 'medal.fill', android: 'military-tech' },
      'book': { ios: 'book.fill', android: 'menu-book' },
      'book-open': { ios: 'book.pages.fill', android: 'auto-stories' },
      'brain': { ios: 'brain.head.profile', android: 'psychology' },
      'book-bookmark': { ios: 'book.closed.fill', android: 'bookmark' },
      'graduation-cap': { ios: 'graduationcap.fill', android: 'school' },
      'book-reader': { ios: 'text.book.closed.fill', android: 'local-library' },
      'check-circle': { ios: 'checkmark.circle.fill', android: 'check-circle' },
      'share': { ios: 'square.and.arrow.up.fill', android: 'share' },
      'dumbbell': { ios: 'figure.strengthtraining.traditional', android: 'fitness-center' },
      'heart': { ios: 'heart.fill', android: 'favorite' },
      'award': { ios: 'rosette', android: 'workspace-premium' },
      'hands-sparkles': { ios: 'hands.sparkles.fill', android: 'favorite' },
      'video': { ios: 'play.rectangle.fill', android: 'play-circle' },
      'question-circle': { ios: 'questionmark.circle.fill', android: 'help' },
      'sunrise': { ios: 'sunrise.fill', android: 'wb-twilight' },
      'calendar-check': { ios: 'calendar.badge.checkmark', android: 'event-available' },
    };
    
    const mapping = iconMap[icon] || { ios: 'star.fill', android: 'star' };
    return platform === 'ios' ? mapping.ios : mapping.android;
  };

  const renderAchievement = (achievement: Achievement, index: number) => (
    <View
      key={`achievement-${achievement.id}-${index}`}
      style={[
        styles.achievementCard,
        !achievement.unlocked && styles.achievementCardLocked,
      ]}
    >
      <View style={[
        styles.achievementIcon,
        { backgroundColor: achievement.unlocked ? getRarityColor(achievement.rarity) : colors.border },
      ]}>
        <IconSymbol
          ios_icon_name={getIconName(achievement.icon, 'ios')}
          android_material_icon_name={getIconName(achievement.icon, 'android')}
          size={32}
          color={achievement.unlocked ? colors.card : colors.textSecondary}
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, !achievement.unlocked && styles.textLocked]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, !achievement.unlocked && styles.textLocked]}>
          {achievement.description}
        </Text>
        <View style={styles.achievementMeta}>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(achievement.rarity) }]}>
            <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
          </View>
          {achievement.unlocked && achievement.unlockedAt && (
            <Text style={styles.unlockedDate}>
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
      {achievement.unlocked && (
        <IconSymbol
          ios_icon_name="checkmark.seal.fill"
          android_material_icon_name="verified"
          size={28}
          color={colors.success}
        />
      )}
    </View>
  );

  const renderChallenge = (challenge: Challenge, index: number) => {
    const progressPercent = (challenge.progress / challenge.requirement.value) * 100;
    
    return (
      <View
        key={`challenge-${challenge.id}-${index}`}
        style={[
          styles.challengeCard,
          challenge.completed && styles.challengeCardCompleted,
        ]}
      >
        <View style={styles.challengeHeader}>
          <View style={[
            styles.challengeIcon,
            { backgroundColor: challenge.completed ? colors.success : getDifficultyColor(challenge.difficulty) },
          ]}>
            <IconSymbol
              ios_icon_name={getIconName(challenge.icon, 'ios')}
              android_material_icon_name={getIconName(challenge.icon, 'android')}
              size={24}
              color={colors.card}
            />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          </View>
          {challenge.completed && (
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={28}
              color={colors.success}
            />
          )}
        </View>
        
        <View style={styles.challengeProgress}>
          <View style={styles.challengeProgressBar}>
            <View style={[styles.challengeProgressFill, { width: `${Math.min(progressPercent, 100)}%` }]} />
          </View>
          <Text style={styles.challengeProgressText}>
            {challenge.progress} / {challenge.requirement.value}
          </Text>
        </View>

        <View style={styles.challengeMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
          </View>
          <View style={styles.rewardBadge}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={14}
              color={colors.highlight}
            />
            <Text style={styles.rewardText}>+{challenge.reward.points} pts</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.pointsBadge}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={20}
            color={colors.highlight}
          />
          <Text style={styles.pointsText}>{totalPoints} pts</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'challenges' && styles.tabActive]}
          onPress={() => setSelectedTab('challenges')}
        >
          <Text style={[styles.tabText, selectedTab === 'challenges' && styles.tabTextActive]}>
            Challenges
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>
              {completedDailyCount + completedWeeklyCount}/{dailyChallenges.length + weeklyChallenges.length}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'achievements' && styles.tabActive]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={[styles.tabText, selectedTab === 'achievements' && styles.tabTextActive]}>
            Badges
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{unlockedCount}/{achievements.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === 'challenges' ? (
          <React.Fragment>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Challenges</Text>
              <Text style={styles.sectionSubtitle}>
                Complete {completedDailyCount}/{dailyChallenges.length} today
              </Text>
              {dailyChallenges.map((challenge, index) => renderChallenge(challenge, index))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Challenges</Text>
              <Text style={styles.sectionSubtitle}>
                Complete {completedWeeklyCount}/{weeklyChallenges.length} this week
              </Text>
              {weeklyChallenges.map((challenge, index) => renderChallenge(challenge, index))}
            </View>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unlockedCount}</Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{achievements.length - unlockedCount}</Text>
                <Text style={styles.statLabel}>Locked</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round((unlockedCount / achievements.length) * 100)}%</Text>
                <Text style={styles.statLabel}>Complete</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Achievements</Text>
              {achievements.map((achievement, index) => renderAchievement(achievement, index))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.card,
  },
  tabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    gap: 12,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  unlockedDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  textLocked: {
    color: colors.textSecondary,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  challengeCardCompleted: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  challengeProgress: {
    marginBottom: 12,
  },
  challengeProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  challengeProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
});
