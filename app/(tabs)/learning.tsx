
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Linking from 'expo-linking';
import { quizBanks } from '@/data/quizData';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

type TabType = 'lectures' | 'recitations' | 'quizzes';

interface Video {
  id: string;
  category_id: string;
  title: string;
  speaker: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  order_index: number;
}

interface Recitation {
  id: string;
  category_id: string;
  title: string;
  reciter: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  order_index: number;
}

interface VideoCategory {
  id: string;
  title: string;
  videos: Video[];
}

interface RecitationCategory {
  id: string;
  title: string;
  recitations: Recitation[];
}

const lectureCategoryTitles: { [key: string]: string } = {
  'quran-tafsir': 'Quran & Tafsir',
  'seerah': 'Seerah',
  'aqeedah': 'Aqeedah',
  'fiqh': 'Fiqh',
  'motivational': 'Motivational',
  'debates': 'Debates & Apologetics',
  'youth': 'Youth Lectures',
  'short-clips': 'Short Clips',
};

const recitationCategoryTitles: { [key: string]: string } = {
  'short-surahs': 'Short Surahs',
  'long-surahs': 'Long Surahs',
  'beautiful': 'Beautiful Recitations',
  'emotional': 'Emotional Recitations',
  'juz-amma': 'Juz Amma',
};

export default function LearningScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('lectures');
  const [lectureCategories, setLectureCategories] = useState<VideoCategory[]>([]);
  const [recitationCategories, setRecitationCategories] = useState<RecitationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (selectedTab === 'lectures') {
      fetchLectures();
    } else if (selectedTab === 'recitations') {
      fetchRecitations();
    } else {
      setLoading(false);
    }
  }, [selectedTab]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .order('category_id', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      if (data) {
        // Group by category
        const grouped: { [key: string]: Video[] } = {};
        data.forEach((lecture) => {
          if (!grouped[lecture.category_id]) {
            grouped[lecture.category_id] = [];
          }
          grouped[lecture.category_id].push(lecture);
        });

        const categories: VideoCategory[] = Object.keys(grouped).map((categoryId) => ({
          id: categoryId,
          title: lectureCategoryTitles[categoryId] || categoryId,
          videos: grouped[categoryId],
        }));

        setLectureCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recitations')
        .select('*')
        .order('category_id', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      if (data) {
        // Group by category
        const grouped: { [key: string]: Recitation[] } = {};
        data.forEach((recitation) => {
          if (!grouped[recitation.category_id]) {
            grouped[recitation.category_id] = [];
          }
          grouped[recitation.category_id].push(recitation);
        });

        const categories: RecitationCategory[] = Object.keys(grouped).map((categoryId) => ({
          id: categoryId,
          title: recitationCategoryTitles[categoryId] || categoryId,
          recitations: grouped[categoryId],
        }));

        setRecitationCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching recitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  const openQuiz = (quizId: string) => {
    router.push(`/quiz?quizId=${quizId}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning</Text>
        <Text style={styles.headerSubtitle}>Expand your Islamic knowledge</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'lectures' && styles.tabActive]}
          onPress={() => setSelectedTab('lectures')}
        >
          <IconSymbol
            ios_icon_name="play.rectangle.fill"
            android_material_icon_name="play-circle"
            size={24}
            color={selectedTab === 'lectures' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'lectures' && styles.tabTextActive]}>
            Lectures
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recitations' && styles.tabActive]}
          onPress={() => setSelectedTab('recitations')}
        >
          <IconSymbol
            ios_icon_name="book.fill"
            android_material_icon_name="menu-book"
            size={24}
            color={selectedTab === 'recitations' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'recitations' && styles.tabTextActive]}>
            Recitations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'quizzes' && styles.tabActive]}
          onPress={() => setSelectedTab('quizzes')}
        >
          <IconSymbol
            ios_icon_name="questionmark.circle.fill"
            android_material_icon_name="quiz"
            size={24}
            color={selectedTab === 'quizzes' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'quizzes' && styles.tabTextActive]}>
            Quizzes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading content...</Text>
          </View>
        ) : (
          <React.Fragment>
            {selectedTab === 'lectures' && (
              <React.Fragment>
                {lectureCategories.length === 0 ? (
                  <View style={styles.emptyState}>
                    <IconSymbol
                      ios_icon_name="play.rectangle"
                      android_material_icon_name="play-circle-outline"
                      size={64}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.emptyStateTitle}>No Lectures Yet</Text>
                    <Text style={styles.emptyStateText}>
                      Lectures will appear here once they are added to the database.
                    </Text>
                  </View>
                ) : (
                  lectureCategories.map((category, categoryIndex) => (
                    <View key={`category-${categoryIndex}-${category.id}`} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.videoScroll}
                      >
                        {category.videos.map((video, videoIndex) => (
                          <TouchableOpacity
                            key={`video-${categoryIndex}-${videoIndex}-${video.id}`}
                            style={styles.videoCard}
                            onPress={() => openVideo(video.video_url)}
                          >
                            <Image 
                              source={{ uri: video.thumbnail_url }} 
                              style={styles.thumbnail}
                              resizeMode="cover"
                            />
                            <View style={styles.playIconOverlay}>
                              <IconSymbol
                                ios_icon_name="play.circle.fill"
                                android_material_icon_name="play-circle"
                                size={48}
                                color="rgba(255, 255, 255, 0.9)"
                              />
                            </View>
                            <View style={styles.videoInfo}>
                              <Text style={styles.videoTitle} numberOfLines={2}>
                                {video.title}
                              </Text>
                              <Text style={styles.videoSpeaker} numberOfLines={1}>
                                {video.speaker}
                              </Text>
                              <Text style={styles.videoDuration}>{video.duration}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ))
                )}
              </React.Fragment>
            )}

            {selectedTab === 'recitations' && (
              <React.Fragment>
                {recitationCategories.length === 0 ? (
                  <View style={styles.emptyState}>
                    <IconSymbol
                      ios_icon_name="book"
                      android_material_icon_name="menu-book"
                      size={64}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.emptyStateTitle}>No Recitations Yet</Text>
                    <Text style={styles.emptyStateText}>
                      Recitations will appear here once they are added to the database.
                    </Text>
                  </View>
                ) : (
                  recitationCategories.map((category, categoryIndex) => (
                    <View key={`recitation-category-${categoryIndex}-${category.id}`} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.videoScroll}
                      >
                        {category.recitations.map((recitation, recitationIndex) => (
                          <TouchableOpacity
                            key={`recitation-${categoryIndex}-${recitationIndex}-${recitation.id}`}
                            style={styles.videoCard}
                            onPress={() => openVideo(recitation.video_url)}
                          >
                            <Image 
                              source={{ uri: recitation.thumbnail_url }} 
                              style={styles.thumbnail}
                              resizeMode="cover"
                            />
                            <View style={styles.playIconOverlay}>
                              <IconSymbol
                                ios_icon_name="play.circle.fill"
                                android_material_icon_name="play-circle"
                                size={48}
                                color="rgba(255, 255, 255, 0.9)"
                              />
                            </View>
                            <View style={styles.videoInfo}>
                              <Text style={styles.videoTitle} numberOfLines={2}>
                                {recitation.title}
                              </Text>
                              <Text style={styles.videoSpeaker} numberOfLines={1}>
                                {recitation.reciter}
                              </Text>
                              <Text style={styles.videoDuration}>{recitation.duration}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ))
                )}
              </React.Fragment>
            )}

            {selectedTab === 'quizzes' && (
              <React.Fragment>
                <View style={styles.quizzesGrid}>
                  {quizBanks.map((quiz, quizIndex) => (
                    <TouchableOpacity 
                      key={`quiz-${quizIndex}-${quiz.title}`} 
                      style={styles.quizCard}
                      onPress={() => openQuiz(quiz.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.quizIcon, { backgroundColor: quiz.color }]}>
                        <IconSymbol
                          ios_icon_name="questionmark.circle.fill"
                          android_material_icon_name="quiz"
                          size={32}
                          color={colors.card}
                        />
                      </View>
                      <View style={styles.quizInfo}>
                        <Text style={styles.quizTitle}>{quiz.title}</Text>
                        <Text style={styles.quizDescription}>{quiz.description}</Text>
                        <View style={styles.quizMeta}>
                          <View style={styles.quizMetaItem}>
                            <IconSymbol
                              ios_icon_name="list.bullet"
                              android_material_icon_name="list"
                              size={14}
                              color={colors.textSecondary}
                            />
                            <Text style={styles.quizMetaText}>10 questions</Text>
                          </View>
                          <Text style={styles.quizMetaText}>•</Text>
                          <View style={styles.quizMetaItem}>
                            <IconSymbol
                              ios_icon_name="chart.bar.fill"
                              android_material_icon_name="bar-chart"
                              size={14}
                              color={colors.textSecondary}
                            />
                            <Text style={styles.quizMetaText}>{quiz.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      <IconSymbol
                        ios_icon_name="chevron.right"
                        android_material_icon_name="chevron-right"
                        size={24}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </React.Fragment>
            )}
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
    paddingTop: Platform.OS === 'android' ? 48 : 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
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
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  videoScroll: {
    paddingRight: 16,
  },
  videoCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 112,
    backgroundColor: colors.border,
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  videoSpeaker: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quizzesGrid: {
    gap: 12,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  quizIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  quizDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quizMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quizMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
