
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, ImageBackground } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

type TabType = 'mental' | 'physical';

export default function WellnessScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('mental');
  const [journalEntry, setJournalEntry] = useState('');
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);

  return (
    <ImageBackground
      source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2FsbGlncmFwaHkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjgwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtinINmE2YTZhzwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjI1MCIgZm9udC1zaXplPSI2MCIgb3BhY2l0eT0iMC4wMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmaWxsPSIjMDAwMDAwIj7Yp9mE2K3ZhdivINmE2YTZhzwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMzUwIiBmb250LXNpemU9IjcwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtiz2KjYrdin2YY8L3RleHQ+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNjYWxsaWdyYXBoeSkiLz48L3N2Zz4=' }}
      style={styles.container}
      imageStyle={styles.backgroundImageStyle}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness</Text>
        <Text style={styles.headerSubtitle}>Nurture your mind and body</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'mental' && styles.tabActive]}
          onPress={() => setSelectedTab('mental')}
        >
          <IconSymbol
            ios_icon_name="brain.head.profile"
            android_material_icon_name="psychology"
            size={20}
            color={selectedTab === 'mental' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'mental' && styles.tabTextActive]}>
            Mental
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'physical' && styles.tabActive]}
          onPress={() => setSelectedTab('physical')}
        >
          <IconSymbol
            ios_icon_name="figure.walk"
            android_material_icon_name="directions-run"
            size={20}
            color={selectedTab === 'physical' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'physical' && styles.tabTextActive]}>
            Physical
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === 'mental' && (
          <React.Fragment>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="heart.fill"
                  android_material_icon_name="favorite"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.cardTitle}>Gratitude Journal</Text>
              </View>
              <Text style={styles.cardDescription}>
                List three things you&apos;re grateful for today
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="What are you grateful for?"
                placeholderTextColor={colors.textSecondary}
                value={journalEntry}
                onChangeText={setJournalEntry}
                multiline
              />
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="sparkles"
                  android_material_icon_name="auto-awesome"
                  size={24}
                  color={colors.accent}
                />
                <Text style={styles.cardTitle}>Reflection Prompts</Text>
              </View>
              <View style={styles.promptsList}>
                <View style={styles.promptItem}>
                  <Text style={styles.promptText}>
                    What act of worship brought you closest to Allah today?
                  </Text>
                </View>
                <View style={styles.promptItem}>
                  <Text style={styles.promptText}>
                    How did you show kindness to others today?
                  </Text>
                </View>
                <View style={styles.promptItem}>
                  <Text style={styles.promptText}>
                    What challenge did you face and how did your faith help?
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="leaf.fill"
                  android_material_icon_name="spa"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.cardTitle}>Stress Relief Dhikr</Text>
              </View>
              <View style={styles.dhikrList}>
                <View style={styles.dhikrItem}>
                  <Text style={styles.dhikrArabic}>لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ</Text>
                  <Text style={styles.dhikrTranslation}>
                    There is no deity except You; exalted are You
                  </Text>
                </View>
                <View style={styles.dhikrItem}>
                  <Text style={styles.dhikrArabic}>حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ</Text>
                  <Text style={styles.dhikrTranslation}>
                    Allah is sufficient for me, and He is the best Disposer of affairs
                  </Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        )}

        {selectedTab === 'physical' && (
          <React.Fragment>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="figure.walk"
                  android_material_icon_name="directions-run"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.cardTitle}>Daily Movement</Text>
              </View>
              <Text style={styles.cardDescription}>
                The Prophet (ﷺ) said: &quot;Your body has a right over you&quot;
              </Text>
              <View style={styles.exerciseList}>
                <View style={styles.exerciseItem}>
                  <IconSymbol
                    ios_icon_name="figure.walk"
                    android_material_icon_name="directions-walk"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.exerciseText}>Morning walk (20 min)</Text>
                </View>
                <View style={styles.exerciseItem}>
                  <IconSymbol
                    ios_icon_name="figure.strengthtraining.traditional"
                    android_material_icon_name="fitness-center"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.exerciseText}>Light stretching (10 min)</Text>
                </View>
                <View style={styles.exerciseItem}>
                  <IconSymbol
                    ios_icon_name="figure.yoga"
                    android_material_icon_name="self-improvement"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.exerciseText}>Gentle yoga (15 min)</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="drop.fill"
                  android_material_icon_name="water-drop"
                  size={24}
                  color={colors.accent}
                />
                <Text style={styles.cardTitle}>Hydration Reminder</Text>
              </View>
              <Text style={styles.cardDescription}>
                Stay hydrated throughout the day. Aim for 8 glasses of water.
              </Text>
              <View style={styles.waterTracker}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass, index) => (
                  <View key={index} style={styles.waterGlass}>
                    <IconSymbol
                      ios_icon_name="drop.fill"
                      android_material_icon_name="water-drop"
                      size={24}
                      color={colors.accent}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="moon.zzz.fill"
                  android_material_icon_name="bedtime"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.cardTitle}>Sleep & Rest</Text>
              </View>
              <Text style={styles.cardDescription}>
                Quality sleep is essential for physical and spiritual well-being
              </Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>• Sleep early and wake for Fajr</Text>
                <Text style={styles.tipText}>• Recite Ayat al-Kursi before sleep</Text>
                <Text style={styles.tipText}>• Avoid screens 1 hour before bed</Text>
                <Text style={styles.tipText}>• Make wudu before sleeping</Text>
              </View>
            </View>
          </React.Fragment>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImageStyle: {
    opacity: 1,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptsList: {
    gap: 12,
  },
  promptItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  promptText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  dhikrList: {
    gap: 16,
  },
  dhikrItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  dhikrArabic: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  dhikrTranslation: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  exerciseList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  exerciseText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  waterTracker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  waterGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});
