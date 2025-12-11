
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import ProgressRings from '@/components/ProgressRings';
import { useTracker } from '@/contexts/TrackerContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { Achievement } from '@/data/achievements';
import { Challenge } from '@/data/challenges';

const dhikrPhrases = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'SubhanAllah', translation: 'Glory be to Allah' },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', translation: 'All praise is due to Allah' },
  { id: 'allahu-akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest' },
  { id: 'la-ilaha-illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah' },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah' },
  { id: 'la-hawla', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', transliteration: 'La hawla wa la quwwata illa billah', translation: 'There is no power nor strength except with Allah' },
];

export default function TrackerScreen() {
  const { trackerData, updateDhikr, updateQuran, getLifetimeStats, getWeeklyStats } = useTracker();
  const { checkAchievements, updateChallengeProgress, achievements, weeklyChallenges } = useAchievements();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDhikrModal, setShowDhikrModal] = useState(false);
  const [goalType, setGoalType] = useState<'dhikr' | 'quran-pages' | 'quran-verses'>('dhikr');
  const [goalValue, setGoalValue] = useState('');
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrPhrases[0]);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [selectedGoalsTab, setSelectedGoalsTab] = useState<'challenges' | 'achievements'>('challenges');

  const openGoalModal = (type: 'dhikr' | 'quran-pages' | 'quran-verses') => {
    setGoalType(type);
    if (type === 'dhikr') {
      setGoalValue(trackerData.dhikr.goal.toString());
    } else if (type === 'quran-pages') {
      setGoalValue(trackerData.quran.goal.toString());
    } else {
      setGoalValue(trackerData.quran.versesGoal.toString());
    }
    setShowGoalModal(true);
  };

  const saveGoal = async () => {
    const value = parseInt(goalValue);
    if (isNaN(value) || value <= 0) {
      return;
    }

    if (goalType === 'dhikr') {
      await updateDhikr(trackerData.dhikr.count, value);
    } else if (goalType === 'quran-pages') {
      await updateQuran(trackerData.quran.pages, value, trackerData.quran.versesMemorized, trackerData.quran.versesGoal);
    } else {
      await updateQuran(trackerData.quran.pages, trackerData.quran.goal, trackerData.quran.versesMemorized, value);
    }
    setShowGoalModal(false);
  };

  const incrementTasbih = async () => {
    setTasbihCount(tasbihCount + 1);
    const newCount = trackerData.dhikr.count + 1;
    await updateDhikr(newCount, trackerData.dhikr.goal);
    
    const weeklyStats = await getWeeklyStats();
    await updateChallengeProgress('weekly-dhikr-2000', weeklyStats.dhikrCount);
    
    const stats = await getLifetimeStats();
    await checkAchievements(trackerData, stats);
  };

  const resetTasbih = () => {
    setTasbihCount(0);
  };

  const selectDhikr = (dhikr: typeof dhikrPhrases[0]) => {
    setSelectedDhikr(dhikr);
    setShowDhikrModal(false);
  };

  const incrementPages = async () => {
    const newPages = trackerData.quran.pages + 1;
    await updateQuran(newPages, trackerData.quran.goal, trackerData.quran.versesMemorized, trackerData.quran.versesGoal);
    
    const weeklyStats = await getWeeklyStats();
    await updateChallengeProgress('weekly-quran-35-pages', weeklyStats.quranPages);
    
    const stats = await getLifetimeStats();
    await checkAchievements(trackerData, stats);
  };

  const decrementPages = async () => {
    if (trackerData.quran.pages > 0) {
      await updateQuran(trackerData.quran.pages - 1, trackerData.quran.goal, trackerData.quran.versesMemorized, trackerData.quran.versesGoal);
    }
  };

  const incrementVerses = async () => {
    const newVerses = trackerData.quran.versesMemorized + 1;
    await updateQuran(trackerData.quran.pages, trackerData.quran.goal, newVerses, trackerData.quran.versesGoal);
    
    const stats = await getLifetimeStats();
    await checkAchievements(trackerData, stats);
  };

  const decrementVerses = async () => {
    if (trackerData.quran.versesMemorized > 0) {
      await updateQuran(trackerData.quran.pages, trackerData.quran.goal, trackerData.quran.versesMemorized - 1, trackerData.quran.versesGoal);
    }
  };

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
          size={28}
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
        </View>
      </View>
      {achievement.unlocked && (
        <IconSymbol
          ios_icon_name="checkmark.seal.fill"
          android_material_icon_name="verified"
          size={24}
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
              size={20}
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
              size={24}
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
              size={12}
              color={colors.highlight}
            />
            <Text style={styles.rewardText}>+{challenge.reward.points} pts</Text>
          </View>
        </View>
      </View>
    );
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completedWeeklyCount = weeklyChallenges.filter(c => c.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Faith Tracker</Text>
          <Text style={styles.headerSubtitle}>Track your spiritual journey</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.ringsCard}>
          <ProgressRings
            prayers={trackerData.prayers}
            dhikr={trackerData.dhikr}
            quran={{ 
              pages: trackerData.quran.pages, 
              goal: trackerData.quran.goal, 
              streak: trackerData.quran.streak,
              versesMemorized: trackerData.quran.versesMemorized,
              versesGoal: trackerData.quran.versesGoal
            }}
          />
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasbih Counter</Text>
            <TouchableOpacity onPress={() => openGoalModal('dhikr')} style={styles.goalButton}>
              <IconSymbol
                ios_icon_name="target"
                android_material_icon_name="flag"
                size={16}
                color={colors.secondary}
              />
              <Text style={styles.goalButtonText}>Set Goal</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tasbihCard}>
            <TouchableOpacity 
              style={styles.dhikrSelector}
              onPress={() => setShowDhikrModal(true)}
            >
              <View style={styles.dhikrSelectorContent}>
                <View style={styles.dhikrTextContainer}>
                  <Text style={styles.dhikrArabic}>{selectedDhikr.arabic}</Text>
                  <Text style={styles.dhikrTransliteration}>{selectedDhikr.transliteration}</Text>
                  <Text style={styles.dhikrTranslation}>{selectedDhikr.translation}</Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.down.circle.fill"
                  android_material_icon_name="arrow-drop-down-circle"
                  size={28}
                  color={colors.secondary}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.tasbihCounter}>
              <Text style={styles.tasbihCountLabel}>Current Count</Text>
              <Text style={styles.tasbihCountNumber}>{tasbihCount}</Text>
              <Text style={styles.tasbihCountTotal}>
                Total Today: {trackerData.dhikr.count} / {trackerData.dhikr.goal}
              </Text>
            </View>

            <View style={styles.tasbihButtons}>
              <TouchableOpacity 
                style={styles.tasbihButtonMain}
                onPress={incrementTasbih}
                activeOpacity={0.8}
              >
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={32}
                  color={colors.card}
                />
                <Text style={styles.tasbihButtonMainText}>Count</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.tasbihButtonReset}
                onPress={resetTasbih}
              >
                <IconSymbol
                  ios_icon_name="arrow.counterclockwise"
                  android_material_icon_name="refresh"
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.tasbihButtonResetText}>Reset</Text>
              </TouchableOpacity>
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
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quran Tracker</Text>
          </View>
          <View style={styles.quranCard}>
            <View style={styles.quranHeader}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="menu-book"
                size={32}
                color={colors.accent}
              />
              <View style={styles.quranHeaderInfo}>
                <Text style={styles.quranTitle}>Daily Goals</Text>
                <Text style={styles.quranSubtitle}>Complete both goals for full progress</Text>
              </View>
            </View>

            <View style={styles.quranGoalSection}>
              <View style={styles.quranGoalHeader}>
                <View style={styles.quranGoalHeaderLeft}>
                  <IconSymbol
                    ios_icon_name="book.pages"
                    android_material_icon_name="auto-stories"
                    size={20}
                    color={colors.accent}
                  />
                  <Text style={styles.quranGoalTitle}>Pages to Read</Text>
                </View>
                <TouchableOpacity onPress={() => openGoalModal('quran-pages')} style={styles.goalButtonSmall}>
                  <IconSymbol
                    ios_icon_name="pencil"
                    android_material_icon_name="edit"
                    size={14}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.quranProgress}>
                <Text style={styles.quranProgressText}>
                  {trackerData.quran.pages} / {trackerData.quran.goal} pages
                </Text>
                <View style={styles.quranProgressBar}>
                  <View 
                    style={[
                      styles.quranProgressFill, 
                      { width: `${Math.min((trackerData.quran.pages / trackerData.quran.goal) * 100, 100)}%`, backgroundColor: colors.accent }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.quranButtons}>
                <TouchableOpacity 
                  style={styles.quranButtonSecondary}
                  onPress={decrementPages}
                >
                  <IconSymbol
                    ios_icon_name="minus.circle"
                    android_material_icon_name="remove-circle"
                    size={20}
                    color={colors.accent}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quranButtonMain, { backgroundColor: colors.accent }]}
                  onPress={incrementPages}
                  activeOpacity={0.8}
                >
                  <IconSymbol
                    ios_icon_name="plus.circle.fill"
                    android_material_icon_name="add-circle"
                    size={20}
                    color={colors.card}
                  />
                  <Text style={styles.quranButtonMainText}>Add Page</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.quranGoalSection}>
              <View style={styles.quranGoalHeader}>
                <View style={styles.quranGoalHeaderLeft}>
                  <IconSymbol
                    ios_icon_name="brain.head.profile"
                    android_material_icon_name="psychology"
                    size={20}
                    color={colors.accent}
                  />
                  <Text style={styles.quranGoalTitle}>Verses to Memorize</Text>
                </View>
                <TouchableOpacity onPress={() => openGoalModal('quran-verses')} style={styles.goalButtonSmall}>
                  <IconSymbol
                    ios_icon_name="pencil"
                    android_material_icon_name="edit"
                    size={14}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.quranProgress}>
                <Text style={styles.quranProgressText}>
                  {trackerData.quran.versesMemorized} / {trackerData.quran.versesGoal} verses
                </Text>
                <View style={styles.quranProgressBar}>
                  <View 
                    style={[
                      styles.quranProgressFill, 
                      { width: `${Math.min((trackerData.quran.versesMemorized / trackerData.quran.versesGoal) * 100, 100)}%`, backgroundColor: colors.accent }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.quranButtons}>
                <TouchableOpacity 
                  style={styles.quranButtonSecondary}
                  onPress={decrementVerses}
                >
                  <IconSymbol
                    ios_icon_name="minus.circle"
                    android_material_icon_name="remove-circle"
                    size={20}
                    color={colors.accent}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quranButtonMain, { backgroundColor: colors.accent }]}
                  onPress={incrementVerses}
                  activeOpacity={0.8}
                >
                  <IconSymbol
                    ios_icon_name="plus.circle.fill"
                    android_material_icon_name="add-circle"
                    size={20}
                    color={colors.card}
                  />
                  <Text style={styles.quranButtonMainText}>Add Verse</Text>
                </TouchableOpacity>
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
          </View>
        </View>

        <View style={styles.goalsSection}>
          <View style={styles.goalsSectionHeader}>
            <Text style={styles.goalsSectionTitle}>Goals & Achievements</Text>
          </View>

          <View style={styles.goalsTabs}>
            <TouchableOpacity
              style={[styles.goalsTab, selectedGoalsTab === 'challenges' && styles.goalsTabActive]}
              onPress={() => setSelectedGoalsTab('challenges')}
            >
              <Text style={[styles.goalsTabText, selectedGoalsTab === 'challenges' && styles.goalsTabTextActive]}>
                Challenges
              </Text>
              <View style={styles.goalsTabBadge}>
                <Text style={styles.goalsTabBadgeText}>
                  {completedWeeklyCount}/{weeklyChallenges.length}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.goalsTab, selectedGoalsTab === 'achievements' && styles.goalsTabActive]}
              onPress={() => setSelectedGoalsTab('achievements')}
            >
              <Text style={[styles.goalsTabText, selectedGoalsTab === 'achievements' && styles.goalsTabTextActive]}>
                Badges
              </Text>
              <View style={styles.goalsTabBadge}>
                <Text style={styles.goalsTabBadgeText}>{unlockedCount}/{achievements.length}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {selectedGoalsTab === 'challenges' ? (
            <React.Fragment>
              <View style={styles.goalsSubsection}>
                <Text style={styles.goalsSubsectionTitle}>Weekly Challenges</Text>
                <Text style={styles.goalsSubsectionSubtitle}>
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

              <View style={styles.goalsSubsection}>
                <Text style={styles.goalsSubsectionTitle}>All Achievements</Text>
                {achievements.map((achievement, index) => renderAchievement(achievement, index))}
              </View>
            </React.Fragment>
          )}
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

      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={(e) => {
            if (e.target === e.currentTarget) {
              setShowGoalModal(false);
            }
          }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Set {goalType === 'dhikr' ? 'Tasbih' : goalType === 'quran-pages' ? 'Pages' : 'Verses'} Goal
              </Text>
              <Text style={styles.modalSubtitle}>
                How many {goalType === 'dhikr' ? 'dhikr counts' : goalType === 'quran-pages' ? 'pages' : 'verses'} do you want to complete daily?
              </Text>
              <TextInput
                style={styles.modalInput}
                value={goalValue}
                onChangeText={setGoalValue}
                keyboardType="number-pad"
                placeholder="Enter goal"
                placeholderTextColor={colors.textSecondary}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowGoalModal(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={saveGoal}
                >
                  <Text style={styles.modalButtonTextSave}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showDhikrModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDhikrModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowDhikrModal(false)}
        >
          <View style={styles.dhikrModalContent}>
            <View style={styles.dhikrModalHeader}>
              <Text style={styles.modalTitle}>Select Dhikr</Text>
              <TouchableOpacity onPress={() => setShowDhikrModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.dhikrList}>
              {dhikrPhrases.map((dhikr, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dhikrOption,
                    selectedDhikr.id === dhikr.id && styles.dhikrOptionSelected,
                  ]}
                  onPress={() => selectDhikr(dhikr)}
                >
                  <View style={styles.dhikrOptionContent}>
                    <Text style={styles.dhikrOptionArabic}>{dhikr.arabic}</Text>
                    <Text style={styles.dhikrOptionTransliteration}>{dhikr.transliteration}</Text>
                    <Text style={styles.dhikrOptionTranslation}>{dhikr.translation}</Text>
                  </View>
                  {selectedDhikr.id === dhikr.id && (
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={24}
                      color={colors.secondary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  ringsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  goalButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  tasbihCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  dhikrSelector: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  dhikrSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dhikrTextContainer: {
    flex: 1,
  },
  dhikrArabic: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'left',
  },
  dhikrTransliteration: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 2,
  },
  dhikrTranslation: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  tasbihCounter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  tasbihCountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tasbihCountNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  tasbihCountTotal: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tasbihButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tasbihButtonMain: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  tasbihButtonMainText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  tasbihButtonReset: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tasbihButtonResetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  quranCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  quranHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quranHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  quranTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  quranSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quranGoalSection: {
    marginBottom: 16,
  },
  quranGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quranGoalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quranGoalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  quranProgress: {
    marginBottom: 12,
  },
  quranProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  quranProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  quranProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quranButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quranButtonMain: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  quranButtonMainText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
  },
  quranButtonSecondary: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  goalsSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  goalsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalsSectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  goalsTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  goalsTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    gap: 8,
  },
  goalsTabActive: {
    backgroundColor: colors.primary,
  },
  goalsTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  goalsTabTextActive: {
    color: colors.card,
  },
  goalsTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  goalsTabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.card,
  },
  goalsSubsection: {
    marginBottom: 20,
  },
  goalsSubsectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  goalsSubsectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
    elevation: 1,
    gap: 10,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.card,
  },
  textLocked: {
    color: colors.textSecondary,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
    elevation: 1,
  },
  challengeCardCompleted: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  challengeDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  challengeProgress: {
    marginBottom: 10,
  },
  challengeProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  challengeProgressText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.card,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    gap: 3,
  },
  rewardText: {
    fontSize: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalButtonTextSave: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  dhikrModalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    width: '100%',
    marginTop: 'auto',
  },
  dhikrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dhikrList: {
    maxHeight: 500,
  },
  dhikrOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dhikrOptionSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.card,
  },
  dhikrOptionContent: {
    flex: 1,
  },
  dhikrOptionArabic: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dhikrOptionTransliteration: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 2,
  },
  dhikrOptionTranslation: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
