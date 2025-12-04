
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAchievements } from '@/contexts/AchievementContext';

type TabType = 'lectures' | 'recitations' | 'quizzes' | 'duas';

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

interface Quiz {
  id: string;
  quiz_id: string;
  title: string;
  description: string;
  difficulty: string;
  color: string;
  order_index: number;
}

interface Dua {
  id: string;
  category_id: string;
  category_title: string;
  category_icon: string;
  category_color: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
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

interface DuaCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  count: number;
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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [duaCategories, setDuaCategories] = useState<DuaCategory[]>([]);
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string | null>(null);
  const [categoryDuas, setCategoryDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { incrementLectureCount } = useAchievements();

  useEffect(() => {
    if (selectedTab === 'lectures') {
      fetchLectures();
    } else if (selectedTab === 'recitations') {
      fetchRecitations();
    } else if (selectedTab === 'quizzes') {
      fetchQuizzes();
    } else if (selectedTab === 'duas') {
      fetchDuaCategories();
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
        console.log('Fetched recitations:', data.length);
        const grouped: { [key: string]: Recitation[] } = {};
        data.forEach((recitation) => {
          if (!grouped[recitation.category_id]) {
            grouped[recitation.category_id] = [];
          }
          grouped[recitation.category_id].push(recitation);
        });

        console.log('Grouped recitations by category:', Object.keys(grouped));

        const categories: RecitationCategory[] = Object.keys(grouped).map((categoryId) => ({
          id: categoryId,
          title: recitationCategoryTitles[categoryId] || categoryId,
          recitations: grouped[categoryId],
        }));

        console.log('Recitation categories:', categories.map(c => `${c.title} (${c.recitations.length})`));
        setRecitationCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching recitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDuaCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('duas')
        .select('category_id, category_title, category_icon, category_color');

      if (error) throw error;

      if (data) {
        // Group by category and count
        const categoryMap: { [key: string]: DuaCategory } = {};
        data.forEach((dua) => {
          if (!categoryMap[dua.category_id]) {
            categoryMap[dua.category_id] = {
              id: dua.category_id,
              title: dua.category_title,
              icon: dua.category_icon,
              color: dua.category_color,
              count: 0,
            };
          }
          categoryMap[dua.category_id].count++;
        });

        setDuaCategories(Object.values(categoryMap));
      }
    } catch (error) {
      console.error('Error fetching dua categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryDuas = async (categoryId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('duas')
        .select('*')
        .eq('category_id', categoryId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setCategoryDuas(data || []);
    } catch (error) {
      console.error('Error fetching category duas:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = async (url: string) => {
    console.log('Opening lecture video, incrementing lecture count...');
    await incrementLectureCount();
    Linking.openURL(url);
  };

  const openQuiz = (quizId: string) => {
    router.push(`/quiz?quizId=${quizId}` as any);
  };

  const openDuaCategory = (categoryId: string) => {
    setSelectedDuaCategory(categoryId);
    fetchCategoryDuas(categoryId);
  };

  const closeDuaCategory = () => {
    setSelectedDuaCategory(null);
    setCategoryDuas([]);
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
            size={20}
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
            size={20}
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
            size={20}
            color={selectedTab === 'quizzes' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'quizzes' && styles.tabTextActive]}>
            Quizzes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'duas' && styles.tabActive]}
          onPress={() => setSelectedTab('duas')}
        >
          <IconSymbol
            ios_icon_name="hands.sparkles.fill"
            android_material_icon_name="volunteer-activism"
            size={20}
            color={selectedTab === 'duas' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'duas' && styles.tabTextActive]}>
            Duas
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
                  <React.Fragment>
                    {lectureCategories.map((category) => (
                      <View key={category.id} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.videoScroll}
                        >
                          {category.videos.map((video) => (
                            <TouchableOpacity
                              key={video.id}
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
                    ))}
                  </React.Fragment>
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
                  <React.Fragment>
                    {recitationCategories.map((category) => (
                      <View key={category.id} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.videoScroll}
                        >
                          {category.recitations.map((recitation) => (
                            <TouchableOpacity
                              key={recitation.id}
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
                    ))}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}

            {selectedTab === 'quizzes' && (
              <React.Fragment>
                {quizzes.length === 0 ? (
                  <View style={styles.emptyState}>
                    <IconSymbol
                      ios_icon_name="questionmark.circle"
                      android_material_icon_name="quiz"
                      size={64}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.emptyStateTitle}>No Quizzes Yet</Text>
                    <Text style={styles.emptyStateText}>
                      Quizzes will appear here once they are added to the database.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.quizzesGrid}>
                    {quizzes.map((quiz) => (
                      <TouchableOpacity 
                        key={quiz.quiz_id} 
                        style={styles.quizCard}
                        onPress={() => openQuiz(quiz.quiz_id)}
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
                )}
              </React.Fragment>
            )}

            {selectedTab === 'duas' && (
              <React.Fragment>
                {!selectedDuaCategory ? (
                  <React.Fragment>
                    {duaCategories.length === 0 ? (
                      <View style={styles.emptyState}>
                        <IconSymbol
                          ios_icon_name="hands.sparkles"
                          android_material_icon_name="volunteer-activism"
                          size={64}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.emptyStateTitle}>No Duas Yet</Text>
                        <Text style={styles.emptyStateText}>
                          Duas will appear here once they are added to the database.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.duaCategoriesGrid}>
                        {duaCategories.map((category) => (
                          <TouchableOpacity
                            key={category.id}
                            style={[styles.duaCategoryCard, { backgroundColor: category.color }]}
                            onPress={() => openDuaCategory(category.id)}
                            activeOpacity={0.8}
                          >
                            <IconSymbol
                              ios_icon_name={category.icon as any}
                              android_material_icon_name={category.icon as any}
                              size={32}
                              color={colors.card}
                            />
                            <Text style={styles.duaCategoryTitle}>{category.title}</Text>
                            <Text style={styles.duaCategoryCount}>{category.count} duas</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={closeDuaCategory}
                    >
                      <IconSymbol
                        ios_icon_name="chevron.left"
                        android_material_icon_name="chevron-left"
                        size={24}
                        color={colors.text}
                      />
                      <Text style={styles.backButtonText}>Back to Categories</Text>
                    </TouchableOpacity>

                    {categoryDuas.length > 0 && (
                      <React.Fragment>
                        <View style={[styles.duaCategoryBanner, { backgroundColor: categoryDuas[0].category_color }]}>
                          <IconSymbol
                            ios_icon_name={categoryDuas[0].category_icon as any}
                            android_material_icon_name={categoryDuas[0].category_icon as any}
                            size={36}
                            color={colors.card}
                          />
                          <View style={styles.duaCategoryBannerText}>
                            <Text style={styles.duaCategoryBannerTitle}>{categoryDuas[0].category_title} Duas</Text>
                            <Text style={styles.duaCategoryBannerSubtitle}>{categoryDuas.length} supplications</Text>
                          </View>
                        </View>

                        {categoryDuas.map((dua) => (
                          <View key={dua.id} style={styles.duaCard}>
                            <View style={[styles.duaNumber, { backgroundColor: dua.category_color }]}>
                              <Text style={styles.duaNumberText}>{dua.order_index + 1}</Text>
                            </View>
                            <Text style={styles.duaArabic}>{dua.arabic}</Text>
                            <Text style={styles.duaTransliteration}>{dua.transliteration}</Text>
                            <Text style={styles.duaTranslation}>{dua.translation}</Text>
                            <Text style={styles.duaReference}>{dua.reference}</Text>
                          </View>
                        ))}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
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
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
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
  duaCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  duaCategoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  duaCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginTop: 12,
    textAlign: 'center',
  },
  duaCategoryCount: {
    fontSize: 13,
    color: colors.card,
    marginTop: 4,
    opacity: 0.9,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  duaCategoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  duaCategoryBannerText: {
    flex: 1,
  },
  duaCategoryBannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 4,
  },
  duaCategoryBannerSubtitle: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  duaCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  duaNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  duaNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
  },
  duaArabic: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 40,
  },
  duaTransliteration: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  duaTranslation: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
    marginBottom: 16,
  },
  duaReference: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
