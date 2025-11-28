
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface VideoCategory {
  id: string;
  title: string;
  icon: string;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  speaker: string;
}

const categories: VideoCategory[] = [
  {
    id: '1',
    title: 'Quran & Tafsir',
    icon: 'book',
    videos: [
      { id: '1', title: 'Understanding Surah Al-Fatiha', duration: '15:30', thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400', speaker: 'Sheikh Ahmad' },
      { id: '2', title: 'Tafsir of Surah Yaseen', duration: '45:20', thumbnail: 'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=400', speaker: 'Dr. Bilal' },
      { id: '3', title: 'Miracles in the Quran', duration: '22:15', thumbnail: 'https://images.unsplash.com/photo-1584286595398-a59f21d25e6f?w=400', speaker: 'Sheikh Omar' },
    ],
  },
  {
    id: '2',
    title: 'Seerah',
    icon: 'person',
    videos: [
      { id: '4', title: 'Life of Prophet Muhammad ﷺ', duration: '60:00', thumbnail: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400', speaker: 'Sheikh Yasir' },
      { id: '5', title: 'The Battle of Badr', duration: '35:45', thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400', speaker: 'Dr. Ahmad' },
    ],
  },
  {
    id: '3',
    title: 'Aqeedah',
    icon: 'star',
    videos: [
      { id: '6', title: 'The Six Pillars of Iman', duration: '28:30', thumbnail: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400', speaker: 'Sheikh Ibrahim' },
      { id: '7', title: 'Understanding Tawheed', duration: '40:15', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', speaker: 'Dr. Khalid' },
    ],
  },
  {
    id: '4',
    title: 'Motivational',
    icon: 'favorite',
    videos: [
      { id: '8', title: 'Never Give Up on Allah', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', speaker: 'Sheikh Mufti' },
      { id: '9', title: 'The Power of Dua', duration: '18:20', thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400', speaker: 'Sheikh Nouman' },
    ],
  },
];

export default function LearningScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const renderCategoryVideos = (category: VideoCategory) => (
    <View key={category.id} style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <IconSymbol
          ios_icon_name={category.icon as any}
          android_material_icon_name={category.icon as any}
          size={24}
          color={colors.primary}
        />
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosScroll}>
        {category.videos.map((video, index) => (
          <TouchableOpacity key={index} style={styles.videoCard} activeOpacity={0.8}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{video.duration}</Text>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
              <Text style={styles.videoSpeaker}>{video.speaker}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning</Text>
        <Text style={styles.headerSubtitle}>Expand your Islamic knowledge</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedCategory === null && styles.tabActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.tabText, selectedCategory === null && styles.tabTextActive]}>
              Lectures
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedCategory === 'recitations' && styles.tabActive]}
            onPress={() => setSelectedCategory('recitations')}
          >
            <Text style={[styles.tabText, selectedCategory === 'recitations' && styles.tabTextActive]}>
              Recitations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedCategory === 'quizzes' && styles.tabActive]}
            onPress={() => setSelectedCategory('quizzes')}
          >
            <Text style={[styles.tabText, selectedCategory === 'quizzes' && styles.tabTextActive]}>
              Quizzes
            </Text>
          </TouchableOpacity>
        </View>

        {selectedCategory === null && (
          <React.Fragment>
            {categories.map(category => renderCategoryVideos(category))}
          </React.Fragment>
        )}

        {selectedCategory === 'recitations' && (
          <View style={styles.comingSoon}>
            <IconSymbol
              ios_icon_name="music.note"
              android_material_icon_name="music-note"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.comingSoonText}>Quran Recitations</Text>
            <Text style={styles.comingSoonSubtext}>Beautiful recitations coming soon</Text>
          </View>
        )}

        {selectedCategory === 'quizzes' && (
          <View style={styles.comingSoon}>
            <IconSymbol
              ios_icon_name="questionmark.circle"
              android_material_icon_name="help"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.comingSoonText}>Islamic Quizzes</Text>
            <Text style={styles.comingSoonSubtext}>Test your knowledge soon</Text>
          </View>
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
    paddingBottom: 120,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.card,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  videosScroll: {
    paddingLeft: 16,
  },
  videoCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  durationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  videoSpeaker: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
