
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';
import { supabase } from '../../lib/supabase';
import ProgressRings from '../../components/ProgressRings';
import { useTracker } from '../../contexts/TrackerContext';

interface DhikrPhrase {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  default_count: number;
  order_index: number;
}

export default function TrackerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { trackerData, updateDhikr, updateQuran, loadTrackerData } = useTracker();
  
  const [dhikrPhrases, setDhikrPhrases] = useState<DhikrPhrase[]>([]);
  const [selectedPhrase, setSelectedPhrase] = useState<DhikrPhrase | null>(null);
  const [showPhraseModal, setShowPhraseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalType, setGoalType] = useState<'pages' | 'verses' | 'dhikr' | null>(null);
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    loadDhikrPhrases();
    loadTrackerData();
  }, []);

  const loadDhikrPhrases = async () => {
    try {
      const { data, error } = await supabase
        .from('dhikr_phrases')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error loading dhikr phrases:', error);
        return;
      }

      if (data && data.length > 0) {
        setDhikrPhrases(data);
        setSelectedPhrase(data[0]);
      }
    } catch (error) {
      console.error('Error loading dhikr phrases:', error);
    }
  };

  const incrementDhikr = async (amount: number) => {
    const newCount = trackerData.dhikr.count + amount;
    await updateDhikr(newCount, trackerData.dhikr.goal);
  };

  const addQuranPage = async () => {
    const newPages = trackerData.quran.pages + 1;
    await updateQuran(
      newPages,
      trackerData.quran.goal,
      trackerData.quran.versesMemorized,
      trackerData.quran.versesGoal
    );
  };

  const addQuranVerse = async () => {
    const newVerses = trackerData.quran.versesMemorized + 1;
    await updateQuran(
      trackerData.quran.pages,
      trackerData.quran.goal,
      newVerses,
      trackerData.quran.versesGoal
    );
  };

  const openGoalModal = (type: 'pages' | 'verses' | 'dhikr') => {
    setGoalType(type);
    let currentGoal = 0;
    
    if (type === 'pages') {
      currentGoal = trackerData.quran.goal;
    } else if (type === 'verses') {
      currentGoal = trackerData.quran.versesGoal;
    } else if (type === 'dhikr') {
      currentGoal = trackerData.dhikr.goal;
    }
    
    setGoalInput(currentGoal.toString());
    setShowGoalModal(true);
  };

  const saveGoal = async () => {
    const newGoal = parseInt(goalInput);
    
    if (isNaN(newGoal) || newGoal <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid number greater than 0');
      return;
    }

    try {
      if (goalType === 'pages') {
        await updateQuran(
          trackerData.quran.pages,
          newGoal,
          trackerData.quran.versesMemorized,
          trackerData.quran.versesGoal
        );
      } else if (goalType === 'verses') {
        await updateQuran(
          trackerData.quran.pages,
          trackerData.quran.goal,
          trackerData.quran.versesMemorized,
          newGoal
        );
      } else if (goalType === 'dhikr') {
        await updateDhikr(trackerData.dhikr.count, newGoal);
      }
      
      setShowGoalModal(false);
      Alert.alert('Success', 'Goal updated successfully!');
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getGoalModalTitle = () => {
    if (goalType === 'pages') return 'Set Pages Goal';
    if (goalType === 'verses') return 'Set Verses Goal';
    if (goalType === 'dhikr') return 'Set Dhikr Goal';
    return 'Set Goal';
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={[styles.scrollContent, Platform.OS === 'android' && { paddingTop: 48 }]}
    >
      <Text style={[styles.title, isDark && styles.textDark]}>
        Iman Tracker
      </Text>
      <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>
        Track your daily spiritual habits
      </Text>

      {/* Progress Rings */}
      <View style={[styles.ringsCard, isDark && styles.cardDark]}>
        <ProgressRings
          prayers={trackerData.prayers}
          dhikr={trackerData.dhikr}
          quran={trackerData.quran}
          size={280}
          showLabels={true}
        />
      </View>

      {/* Dhikr Section */}
      <View style={styles.section}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <IconSymbol
              ios_icon_name="circle.grid.3x3.fill"
              android_material_icon_name="grid_view"
              size={24}
              color={colors.secondary}
            />
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Dhikr Counter
            </Text>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => openGoalModal('dhikr')}
            >
              <IconSymbol
                ios_icon_name="target"
                android_material_icon_name="flag"
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* Selected Phrase Display */}
          {selectedPhrase && (
            <TouchableOpacity
              style={[styles.phraseCard, isDark && styles.phraseCardDark]}
              onPress={() => setShowPhraseModal(true)}
            >
              <Text style={[styles.phraseArabic, isDark && styles.textDark]}>
                {selectedPhrase.arabic}
              </Text>
              <Text style={[styles.phraseTransliteration, isDark && styles.textSecondaryDark]}>
                {selectedPhrase.transliteration}
              </Text>
              <Text style={[styles.phraseTranslation, isDark && styles.textSecondaryDark]}>
                {selectedPhrase.translation}
              </Text>
              <View style={styles.changePhraseButton}>
                <Text style={styles.changePhraseText}>Tap to change phrase</Text>
                <IconSymbol
                  ios_icon_name="chevron.down"
                  android_material_icon_name="expand_more"
                  size={16}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Counter Display */}
          <View style={styles.counterDisplay}>
            <Text style={[styles.counterNumber, isDark && styles.textDark]}>
              {trackerData.dhikr.count}
            </Text>
            <Text style={[styles.counterGoal, isDark && styles.textSecondaryDark]}>
              / {trackerData.dhikr.goal}
            </Text>
          </View>

          {/* Counter Buttons */}
          <View style={styles.counterButtons}>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.secondary }]}
              onPress={() => incrementDhikr(1)}
            >
              <Text style={styles.counterButtonText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.secondary }]}
              onPress={() => incrementDhikr(10)}
            >
              <Text style={styles.counterButtonText}>+10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: colors.secondary }]}
              onPress={() => incrementDhikr(33)}
            >
              <Text style={styles.counterButtonText}>+33</Text>
            </TouchableOpacity>
          </View>

          {/* Streak */}
          <View style={styles.streakContainer}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.streakText, isDark && styles.textDark]}>
              {trackerData.dhikr.streak} day streak
            </Text>
          </View>
        </View>
      </View>

      {/* Quran Section */}
      <View style={styles.section}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu_book"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardTitle, isDark && styles.textDark]}>
              Quran Progress
            </Text>
          </View>

          {/* Pages Read */}
          <View style={styles.quranSubsection}>
            <View style={styles.subsectionHeader}>
              <Text style={[styles.subsectionTitle, isDark && styles.textDark]}>
                Pages Read
              </Text>
              <TouchableOpacity 
                style={styles.goalButtonSmall}
                onPress={() => openGoalModal('pages')}
              >
                <IconSymbol
                  ios_icon_name="target"
                  android_material_icon_name="flag"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.goalButtonText}>Goal</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(trackerData.quran.pages, trackerData.quran.goal)}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, isDark && styles.textDark]}>
                {trackerData.quran.pages} / {trackerData.quran.goal} pages
              </Text>
            </View>

            {/* Quick Track Button */}
            <TouchableOpacity
              style={[styles.quickTrackButton, { backgroundColor: colors.primary }]}
              onPress={addQuranPage}
            >
              <IconSymbol
                ios_icon_name="plus.circle.fill"
                android_material_icon_name="add_circle"
                size={24}
                color={colors.textDark}
              />
              <Text style={styles.quickTrackButtonText}>Track 1 Page</Text>
            </TouchableOpacity>
          </View>

          {/* Verses Memorized */}
          <View style={styles.quranSubsection}>
            <View style={styles.subsectionHeader}>
              <Text style={[styles.subsectionTitle, isDark && styles.textDark]}>
                Verses Memorized
              </Text>
              <TouchableOpacity 
                style={styles.goalButtonSmall}
                onPress={() => openGoalModal('verses')}
              >
                <IconSymbol
                  ios_icon_name="target"
                  android_material_icon_name="flag"
                  size={18}
                  color={colors.accent}
                />
                <Text style={[styles.goalButtonText, { color: colors.accent }]}>Goal</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(trackerData.quran.versesMemorized, trackerData.quran.versesGoal)}%`,
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, isDark && styles.textDark]}>
                {trackerData.quran.versesMemorized} / {trackerData.quran.versesGoal} verses
              </Text>
            </View>

            {/* Quick Track Button */}
            <TouchableOpacity
              style={[styles.quickTrackButton, { backgroundColor: colors.accent }]}
              onPress={addQuranVerse}
            >
              <IconSymbol
                ios_icon_name="plus.circle.fill"
                android_material_icon_name="add_circle"
                size={24}
                color={colors.textDark}
              />
              <Text style={styles.quickTrackButtonText}>Track 1 Verse</Text>
            </TouchableOpacity>
          </View>

          {/* Streak */}
          <View style={styles.streakContainer}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.streakText, isDark && styles.textDark]}>
              {trackerData.quran.streak} day streak
            </Text>
          </View>
        </View>
      </View>

      {/* Phrase Selection Modal */}
      <Modal
        visible={showPhraseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPhraseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>
                Select Dhikr Phrase
              </Text>
              <TouchableOpacity onPress={() => setShowPhraseModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.phraseList}>
              {dhikrPhrases.map((phrase) => (
                <TouchableOpacity
                  key={phrase.id}
                  style={[
                    styles.phraseOption,
                    selectedPhrase?.id === phrase.id && styles.phraseOptionSelected,
                    isDark && styles.phraseOptionDark,
                  ]}
                  onPress={() => {
                    setSelectedPhrase(phrase);
                    setShowPhraseModal(false);
                  }}
                >
                  <Text style={[styles.phraseOptionArabic, isDark && styles.textDark]}>
                    {phrase.arabic}
                  </Text>
                  <Text style={[styles.phraseOptionTransliteration, isDark && styles.textSecondaryDark]}>
                    {phrase.transliteration}
                  </Text>
                  <Text style={[styles.phraseOptionTranslation, isDark && styles.textSecondaryDark]}>
                    {phrase.translation}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Goal Setting Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.goalModalContent, isDark && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>
                {getGoalModalTitle()}
              </Text>
              <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.goalDescription, isDark && styles.textSecondaryDark]}>
              {goalType === 'pages' && 'Set your daily goal for Quran pages to read'}
              {goalType === 'verses' && 'Set your daily goal for verses to memorize'}
              {goalType === 'dhikr' && 'Set your daily goal for dhikr count'}
            </Text>

            <View style={styles.goalInputContainer}>
              <TextInput
                style={[styles.goalInput, isDark && styles.goalInputDark]}
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="number-pad"
                placeholder="Enter goal"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </View>

            <View style={styles.goalModalButtons}>
              <TouchableOpacity
                style={[styles.goalModalButton, styles.goalModalButtonCancel]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.goalModalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.goalModalButton, styles.goalModalButtonSave]}
                onPress={saveGoal}
              >
                <Text style={styles.goalModalButtonTextSave}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Padding */}
      <View style={{ height: 120 }} />
    </ScrollView>
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
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  ringsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  goalButton: {
    padding: spacing.xs,
  },
  phraseCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  phraseCardDark: {
    backgroundColor: colors.backgroundDark,
  },
  phraseArabic: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  phraseTransliteration: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  phraseTranslation: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  changePhraseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  changePhraseText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  counterDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  },
  counterGoal: {
    fontSize: 24,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  counterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  counterButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  quranSubsection: {
    marginBottom: spacing.lg,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  goalButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
  },
  goalButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'right',
  },
  quickTrackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  quickTrackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxHeight: '80%',
  },
  modalContentDark: {
    backgroundColor: colors.surfaceDark,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text,
  },
  phraseList: {
    maxHeight: 400,
  },
  phraseOption: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  phraseOptionDark: {
    backgroundColor: colors.backgroundDark,
  },
  phraseOptionSelected: {
    borderColor: colors.primary,
  },
  phraseOptionArabic: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  phraseOptionTransliteration: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  phraseOptionTranslation: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  goalModalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  goalInputContainer: {
    marginBottom: spacing.lg,
  },
  goalInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  goalInputDark: {
    backgroundColor: colors.backgroundDark,
  },
  goalModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  goalModalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalModalButtonCancel: {
    backgroundColor: colors.border,
  },
  goalModalButtonSave: {
    backgroundColor: colors.primary,
  },
  goalModalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  goalModalButtonTextSave: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
