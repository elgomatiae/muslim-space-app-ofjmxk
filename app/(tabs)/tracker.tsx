
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import ProgressRings from '@/components/ProgressRings';

interface TrackerData {
  prayers: { completed: number; total: number; streak: number };
  dhikr: { count: number; goal: number; streak: number };
  quran: { pages: number; goal: number; streak: number };
}

const dhikrPhrases = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'SubhanAllah', translation: 'Glory be to Allah' },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', translation: 'All praise is due to Allah' },
  { id: 'allahu-akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest' },
  { id: 'la-ilaha-illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah' },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah' },
  { id: 'la-hawla', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', transliteration: 'La hawla wa la quwwata illa billah', translation: 'There is no power nor strength except with Allah' },
];

const quranSurahs = [
  'Al-Fatiha', 'Al-Baqarah', 'Ali \'Imran', 'An-Nisa', 'Al-Ma\'idah', 'Al-An\'am', 'Al-A\'raf', 'Al-Anfal',
  'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf',
  'Maryam', 'Ta-Ha', 'Al-Anbiya', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan', 'Ash-Shu\'ara',
];

export default function TrackerScreen() {
  const [trackerData, setTrackerData] = useState<TrackerData>({
    prayers: { completed: 3, total: 5, streak: 7 },
    dhikr: { count: 150, goal: 300, streak: 5 },
    quran: { pages: 2, goal: 5, streak: 12 },
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDhikrModal, setShowDhikrModal] = useState(false);
  const [showQuranModal, setShowQuranModal] = useState(false);
  const [goalType, setGoalType] = useState<'dhikr' | 'quran'>('dhikr');
  const [goalValue, setGoalValue] = useState('');
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrPhrases[0]);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [currentSurah, setCurrentSurah] = useState('Al-Baqarah');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentJuz, setCurrentJuz] = useState(1);

  const openGoalModal = (type: 'dhikr' | 'quran') => {
    setGoalType(type);
    setGoalValue(type === 'dhikr' ? trackerData.dhikr.goal.toString() : trackerData.quran.goal.toString());
    setShowGoalModal(true);
  };

  const saveGoal = () => {
    const value = parseInt(goalValue);
    if (isNaN(value) || value <= 0) {
      return;
    }

    if (goalType === 'dhikr') {
      setTrackerData({
        ...trackerData,
        dhikr: { ...trackerData.dhikr, goal: value },
      });
    } else {
      setTrackerData({
        ...trackerData,
        quran: { ...trackerData.quran, goal: value },
      });
    }
    setShowGoalModal(false);
  };

  const incrementTasbih = () => {
    setTasbihCount(tasbihCount + 1);
    setTrackerData({
      ...trackerData,
      dhikr: { ...trackerData.dhikr, count: trackerData.dhikr.count + 1 },
    });
  };

  const resetTasbih = () => {
    setTasbihCount(0);
  };

  const selectDhikr = (dhikr: typeof dhikrPhrases[0]) => {
    setSelectedDhikr(dhikr);
    setShowDhikrModal(false);
  };

  const incrementQuran = () => {
    setTrackerData({
      ...trackerData,
      quran: { ...trackerData.quran, pages: trackerData.quran.pages + 1 },
    });
    setCurrentPage(currentPage + 1);
  };

  const decrementQuran = () => {
    if (trackerData.quran.pages > 0) {
      setTrackerData({
        ...trackerData,
        quran: { ...trackerData.quran, pages: trackerData.quran.pages - 1 },
      });
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faith Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your spiritual journey</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.ringsCard}>
          <ProgressRings
            prayers={trackerData.prayers}
            dhikr={trackerData.dhikr}
            quran={trackerData.quran}
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
            <Text style={styles.sectionTitle}>Quran Reading</Text>
            <TouchableOpacity onPress={() => openGoalModal('quran')} style={styles.goalButton}>
              <IconSymbol
                ios_icon_name="target"
                android_material_icon_name="flag"
                size={16}
                color={colors.accent}
              />
              <Text style={styles.goalButtonText}>Set Goal</Text>
            </TouchableOpacity>
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
                <Text style={styles.quranTitle}>Daily Reading</Text>
                <Text style={styles.quranSubtitle}>
                  {trackerData.quran.pages} of {trackerData.quran.goal} pages today
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.surahSelector}
              onPress={() => setShowQuranModal(true)}
            >
              <View style={styles.surahSelectorContent}>
                <View>
                  <Text style={styles.surahLabel}>Current Surah</Text>
                  <Text style={styles.surahName}>{currentSurah}</Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.down.circle.fill"
                  android_material_icon_name="arrow-drop-down-circle"
                  size={28}
                  color={colors.accent}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.quranProgress}>
              <View style={styles.quranProgressItem}>
                <Text style={styles.quranProgressLabel}>Page</Text>
                <Text style={styles.quranProgressValue}>{currentPage}</Text>
                <Text style={styles.quranProgressTotal}>of 604</Text>
              </View>
              <View style={styles.quranProgressDivider} />
              <View style={styles.quranProgressItem}>
                <Text style={styles.quranProgressLabel}>Juz</Text>
                <Text style={styles.quranProgressValue}>{currentJuz}</Text>
                <Text style={styles.quranProgressTotal}>of 30</Text>
              </View>
            </View>

            <View style={styles.quranButtons}>
              <TouchableOpacity 
                style={styles.quranButtonSecondary}
                onPress={decrementQuran}
              >
                <IconSymbol
                  ios_icon_name="minus.circle"
                  android_material_icon_name="remove-circle"
                  size={24}
                  color={colors.accent}
                />
                <Text style={styles.quranButtonSecondaryText}>-1 Page</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quranButtonMain}
                onPress={incrementQuran}
                activeOpacity={0.8}
              >
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={24}
                  color={colors.card}
                />
                <Text style={styles.quranButtonMainText}>+1 Page</Text>
              </TouchableOpacity>
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
          onPress={() => setShowGoalModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Set {goalType === 'dhikr' ? 'Tasbih' : 'Pages'} Goal
            </Text>
            <Text style={styles.modalSubtitle}>
              How many {goalType === 'dhikr' ? 'dhikr counts' : 'pages'} do you want to complete daily?
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

      <Modal
        visible={showQuranModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuranModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowQuranModal(false)}
        >
          <View style={styles.dhikrModalContent}>
            <View style={styles.dhikrModalHeader}>
              <Text style={styles.modalTitle}>Select Surah</Text>
              <TouchableOpacity onPress={() => setShowQuranModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.dhikrList}>
              {quranSurahs.map((surah, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.surahOption,
                    currentSurah === surah && styles.surahOptionSelected,
                  ]}
                  onPress={() => {
                    setCurrentSurah(surah);
                    setShowQuranModal(false);
                  }}
                >
                  <View style={styles.surahOptionContent}>
                    <Text style={styles.surahOptionNumber}>{index + 1}</Text>
                    <Text style={styles.surahOptionName}>{surah}</Text>
                  </View>
                  {currentSurah === surah && (
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={24}
                      color={colors.accent}
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
    marginBottom: 16,
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
  surahSelector: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  surahSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surahLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  quranProgress: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  quranProgressItem: {
    flex: 1,
    alignItems: 'center',
  },
  quranProgressLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quranProgressValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  quranProgressTotal: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quranProgressDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  quranButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quranButtonMain: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  quranButtonMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  quranButtonSecondary: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quranButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
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
    width: '100%',
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
  surahOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  surahOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  surahOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  surahOptionNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
    width: 32,
  },
  surahOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
