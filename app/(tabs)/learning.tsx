
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';
import { supabase } from '../../lib/supabase';

interface Lecture {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  category_id: string;
}

interface Recitation {
  id: string;
  title: string;
  reciter: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  category_id: string;
}

export default function LearningScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [recitations, setRecitations] = useState<Recitation[]>([]);
  const [selectedTab, setSelectedTab] = useState<'lectures' | 'recitations'>('lectures');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load lectures
      const { data: lecturesData, error: lecturesError } = await supabase
        .from('lectures')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(20);

      if (lecturesError) {
        console.error('Error loading lectures:', lecturesError);
      } else {
        setLectures(lecturesData || []);
      }

      // Load recitations
      const { data: recitationsData, error: recitationsError } = await supabase
        .from('recitations')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(20);

      if (recitationsError) {
        console.error('Error loading recitations:', recitationsError);
      } else {
        setRecitations(recitationsData || []);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const openVideo = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  const renderLectureCard = (lecture: Lecture, index: number) => (
    <TouchableOpacity
      key={`lecture-${lecture.id}-${index}`}
      style={[styles.card, isDark && styles.cardDark]}
      onPress={() => openVideo(lecture.video_url)}
      activeOpacity={0.7}
    >
      {lecture.thumbnail_url ? (
        <Image
          source={{ uri: lecture.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <IconSymbol
            ios_icon_name="play.circle.fill"
            android_material_icon_name="play_circle"
            size={48}
            color={colors.primary}
          />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isDark && styles.textDark]} numberOfLines={2}>
          {lecture.title}
        </Text>
        <Text style={[styles.cardSubtitle, isDark && styles.textSecondaryDark]}>
          {lecture.speaker}
        </Text>
        <View style={styles.cardFooter}>
          <IconSymbol
            ios_icon_name="clock"
            android_material_icon_name="schedule"
            size={14}
            color={isDark ? colors.textSecondaryDark : colors.textSecondary}
          />
          <Text style={[styles.duration, isDark && styles.textSecondaryDark]}>
            {lecture.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecitationCard = (recitation: Recitation, index: number) => (
    <TouchableOpacity
      key={`recitation-${recitation.id}-${index}`}
      style={[styles.card, isDark && styles.cardDark]}
      onPress={() => openVideo(recitation.video_url)}
      activeOpacity={0.7}
    >
      {recitation.thumbnail_url ? (
        <Image
          source={{ uri: recitation.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <IconSymbol
            ios_icon_name="play.circle.fill"
            android_material_icon_name="play_circle"
            size={48}
            color={colors.primary}
          />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isDark && styles.textDark]} numberOfLines={2}>
          {recitation.title}
        </Text>
        <Text style={[styles.cardSubtitle, isDark && styles.textSecondaryDark]}>
          {recitation.reciter}
        </Text>
        <View style={styles.cardFooter}>
          <IconSymbol
            ios_icon_name="clock"
            android_material_icon_name="schedule"
            size={14}
            color={isDark ? colors.textSecondaryDark : colors.textSecondary}
          />
          <Text style={[styles.duration, isDark && styles.textSecondaryDark]}>
            {recitation.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Tab Selector */}
      <View style={[styles.tabContainer, Platform.OS === 'android' && { marginTop: 48 }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'lectures' && styles.tabActive,
            selectedTab === 'lectures' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('lectures')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'lectures' && styles.tabTextActive,
            ]}
          >
            Lectures
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'recitations' && styles.tabActive,
            selectedTab === 'recitations' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('recitations')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'recitations' && styles.tabTextActive,
            ]}
          >
            Recitations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedTab === 'lectures' ? (
          <>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Islamic Lectures
            </Text>
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => renderLectureCard(lecture, index))
            ) : (
              <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
                No lectures available
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Quran Recitations
            </Text>
            {recitations.length > 0 ? (
              recitations.map((recitation, index) => renderRecitationCard(recitation, index))
            ) : (
              <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
                No recitations available
              </Text>
            )}
          </>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
  tabContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  cardDark: {
    backgroundColor: colors.surfaceDark,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  textDark: {
    color: colors.textDark,
  },
  textSecondaryDark: {
    color: colors.textSecondaryDark,
  },
});
