
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Platform,
  Modal,
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
  const [dhikrGoalInput, setDhikrGoalInput] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  const [quranPagesInput, setQuranPagesInput] = useState('');
  const [quranPagesGoalInput, setQuranPagesGoalInput] = useState('');
  const [quranVersesInput, setQuranVersesInput] = useState('');
  const [quranVersesGoalInput, setQuranVersesGoalInput] = useState('');
  const [showQuranGoalModal, setShowQuranGoalModal] = useState(false);

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

  const updateDhikrGoal = async () => {
    const goal = parseInt(dhikrGoalInput);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid number greater than 0');
      return;
    }

    await updateDhikr(trackerData.dhikr.count, goal);
    setDhikrGoalInput('');
    setShowGoalModal(false);
  };

  const addQuranPages = async () => {
    const pages = parseInt(quranPagesInput);
    if (isNaN(pages) || pages <= 0) return;

    const newPages = trackerData.quran.pages + pages;
    await updateQuran(
      newPages,
      trackerData.quran.goal,
      trackerData.quran.versesMemorized,
      trackerData.quran.versesGoal
    );
    setQuranPagesInput('');
  };

  const addQuranVerses = async () => {
    const verses = parseInt(quranVersesInput);
    if (isNaN(verses) || verses <= 0) return;

    const newVerses = trackerData.quran.versesMemorized + verses;
    await updateQuran(
      trackerData.quran.pages,
      trackerData.quran.goal,
      newVerses,
      trackerData.quran.versesGoal
    );
    setQuranVersesInput('');
  };

  const updateQuranGoals = async () => {
    const pagesGoal = parseInt(quranPagesGoalInput);
    const versesGoal = parseInt(quranVersesGoalInput);

    if (isNaN(pagesGoal) || pagesGoal <= 0 || isNaN(versesGoal) || versesGoal <= 0) {
      Alert.alert('Invalid Goals', 'Please enter valid numbers greater than 0');
      return;
    }

    await updateQuran(
      trackerData.quran.pages,
      pagesGoal,
      trackerData.quran.versesMemorized,
      versesGoal
    );
    setQuranPagesGoalInput('');
    setQuranVersesGoalInput('');
    setShowQuranGoalModal(false);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
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

          {/* Set Goal Button */}
          <TouchableOpacity
            style={styles.setGoalButton}
            onPress={() => setShowGoalModal(true)}
          >
            <IconSymbol
              ios_icon_name="target"
              android_material_icon_name="flag"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.setGoalText}>Set Daily Goal</Text>
          </TouchableOpacity>

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
            <Text style={[styles.subsectionTitle, isDark && styles.textDark]}>
              Pages Read
            </Text>
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

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Add pages..."
                placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
                value={quranPagesInput}
                onChangeText={setQuranPagesInput}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={addQuranPages}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color={colors.textDark}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Verses Memorized */}
          <View style={styles.quranSubsection}>
            <Text style={[styles.subsectionTitle, isDark && styles.textDark]}>
              Verses Memorized
            </Text>
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

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Add verses..."
                placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
                value={quranVersesInput}
                onChangeText={setQuranVersesInput}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.accent }]}
                onPress={addQuranVerses}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color={colors.textDark}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Set Goals Button */}
          <TouchableOpacity
            style={styles.setGoalButton}
            onPress={() => {
              setQuranPagesGoalInput(trackerData.quran.goal.toString());
              setQuranVersesGoalInput(trackerData.quran.versesGoal.toString());
              setShowQuranGoalModal(true);
            }}
          >
            <IconSymbol
              ios_icon_name="target"
              android_material_icon_name="flag"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.setGoalText}>Set Daily Goals</Text>
          </TouchableOpacity>

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

      {/* Dhikr Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.smallModal, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              Set Daily Dhikr Goal
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.inputDark]}
              placeholder="Enter goal (e.g., 300)"
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={dhikrGoalInput}
              onChangeText={setDhikrGoalInput}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={updateDhikrGoal}
              >
                <Text style={[styles.modalButtonText, { color: colors.textDark }]}>
                  Set Goal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quran Goals Modal */}
      <Modal
        visible={showQuranGoalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQuranGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.smallModal, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              Set Daily Quran Goals
            </Text>
            <Text style={[styles.modalLabel, isDark && styles.textSecondaryDark]}>
              Pages to Read
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.inputDark]}
              placeholder="Enter pages goal (e.g., 5)"
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={quranPagesGoalInput}
              onChangeText={setQuranPagesGoalInput}
              keyboardType="number-pad"
            />
            <Text style={[styles.modalLabel, isDark && styles.textSecondaryDark]}>
              Verses to Memorize
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.inputDark]}
              placeholder="Enter verses goal (e.g., 3)"
              placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
              value={quranVersesGoalInput}
              onChangeText={setQuranVersesGoalInput}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowQuranGoalModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={updateQuranGoals}
              >
                <Text style={[styles.modalButtonText, { color: colors.textDark }]}>
                  Set Goals
                </Text>
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
  setGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  setGoalText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  quranSubsection: {
    marginBottom: spacing.lg,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
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
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  inputDark: {
    backgroundColor: colors.backgroundDark,
    color: colors.textDark,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
  smallModal: {
    maxHeight: 'auto',
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
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.border,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
