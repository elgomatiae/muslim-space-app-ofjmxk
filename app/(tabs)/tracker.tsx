
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

export default function TrackerScreen() {
  const [trackerData, setTrackerData] = useState<TrackerData>({
    prayers: { completed: 3, total: 5, streak: 7 },
    dhikr: { count: 150, goal: 300, streak: 5 },
    quran: { pages: 2, goal: 5, streak: 12 },
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalType, setGoalType] = useState<'dhikr' | 'quran'>('dhikr');
  const [goalValue, setGoalValue] = useState('');

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

  const incrementDhikr = () => {
    setTrackerData({
      ...trackerData,
      dhikr: { ...trackerData.dhikr, count: trackerData.dhikr.count + 1 },
    });
  };

  const incrementQuran = () => {
    setTrackerData({
      ...trackerData,
      quran: { ...trackerData.quran, pages: trackerData.quran.pages + 1 },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Iman Tracker</Text>
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
            <Text style={styles.sectionTitle}>Dhikr</Text>
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
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <IconSymbol
                ios_icon_name="circle.grid.3x3.fill"
                android_material_icon_name="apps"
                size={32}
                color={colors.secondary}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Tasbih Counter</Text>
                <Text style={styles.detailSubtitle}>
                  {trackerData.dhikr.count} of {trackerData.dhikr.goal} today
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
              <Text style={styles.streakText}>{trackerData.dhikr.streak} day streak</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={incrementDhikr}>
              <Text style={styles.actionButtonText}>Add Count (+1)</Text>
            </TouchableOpacity>
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
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="menu-book"
                size={32}
                color={colors.accent}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Daily Reading</Text>
                <Text style={styles.detailSubtitle}>
                  {trackerData.quran.pages} of {trackerData.quran.goal} pages
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
              <Text style={styles.streakText}>{trackerData.quran.streak} day streak</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={incrementQuran}>
              <Text style={styles.actionButtonText}>Log Page (+1)</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    fontSize: 14,
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
    marginBottom: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
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
});
