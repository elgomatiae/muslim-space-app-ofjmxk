
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Linking } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { lectureCategories, recitationCategories } from '@/data/videos';
import { quizzes } from '@/data/quizzes';
import { useRouter } from 'expo-router';

export default function LearningScreen() {
  const [selectedCategory, setSelectedCategory] = useState<'lectures' | 'recitations' | 'quizzes'>('lectures');
  const router = useRouter();

  const openYouTubeVideo = async (youtubeId: string) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const youtubeAppUrl = `vnd.youtube://watch?v=${youtubeId}`;
    
    try {
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        await Linking.openURL(youtubeUrl);
      }
    } catch (error) {
      console.log('Error opening YouTube:', error);
      await Linking.openURL(youtubeUrl);
    }
  };

  const renderCategoryVideos = (category: any) => (
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
        {category.videos.map((video: any, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.videoCard} 
            activeOpacity={0.8}
            onPress={() => openYouTubeVideo(video.youtubeId)}
          >
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <View style={styles.playIconOverlay}>
              <IconSymbol
                ios_icon_name="play.circle.fill"
                android_material_icon_name="play-circle"
                size={48}
                color="rgba(255, 255, 255, 0.9)"
              />
            </View>
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
            style={[styles.tab, selectedCategory === 'lectures' && styles.tabActive]}
            onPress={() => setSelectedCategory('lectures')}
          >
            <Text style={[styles.tabText, selectedCategory === 'lectures' && styles.tabTextActive]}>
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

        {selectedCategory === 'lectures' && (
          <React.Fragment>
            {lectureCategories.map(category => renderCategoryVideos(category))}
          </React.Fragment>
        )}

        {selectedCategory === 'recitations' && (
          <React.Fragment>
            {recitationCategories.map(category => renderCategoryVideos(category))}
          </React.Fragment>
        )}

        {selectedCategory === 'quizzes' && (
          <View style={styles.quizzesContainer}>
            {quizzes.map((quiz, index) => (
              <TouchableOpacity key={index} style={styles.quizCard} activeOpacity={0.8}>
                <View style={[styles.quizIconContainer, { backgroundColor: quiz.color }]}>
                  <IconSymbol
                    ios_icon_name={quiz.icon as any}
                    android_material_icon_name={quiz.icon as any}
                    size={32}
                    color={colors.card}
                  />
                </View>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizCategory}>{quiz.category}</Text>
                  <Text style={styles.quizQuestions}>{quiz.questions.length} questions</Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron-right"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
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
  playIconOverlay: {
    position: 'absolute',
    top: 36,
    left: 76,
    alignItems: 'center',
    justifyContent: 'center',
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
  quizzesContainer: {
    paddingHorizontal: 16,
  },
  quizCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  quizCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  quizQuestions: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
