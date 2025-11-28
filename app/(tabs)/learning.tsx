
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Linking from 'expo-linking';
import { videoCategories, quranRecitations, quizzes } from '@/data/videos';

type TabType = 'lectures' | 'recitations' | 'quizzes';

export default function LearningScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('lectures');

  const openVideo = (url: string) => {
    Linking.openURL(url);
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
        {selectedTab === 'lectures' && (
          <React.Fragment>
            {videoCategories.map((category, categoryIndex) => (
              <View key={categoryIndex} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.videoScroll}
                >
                  {category.videos.map((video, videoIndex) => (
                    <TouchableOpacity
                      key={videoIndex}
                      style={styles.videoCard}
                      onPress={() => openVideo(video.url)}
                    >
                      <Image 
                        source={{ uri: video.thumbnail }} 
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

        {selectedTab === 'recitations' && (
          <React.Fragment>
            {quranRecitations.map((category, categoryIndex) => (
              <View key={categoryIndex} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.videoScroll}
                >
                  {category.recitations.map((recitation, recitationIndex) => (
                    <TouchableOpacity
                      key={recitationIndex}
                      style={styles.videoCard}
                      onPress={() => openVideo(recitation.url)}
                    >
                      <Image 
                        source={{ uri: recitation.thumbnail }} 
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

        {selectedTab === 'quizzes' && (
          <React.Fragment>
            {quizzes.map((quiz, quizIndex) => (
              <TouchableOpacity key={quizIndex} style={styles.quizCard}>
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
                    <Text style={styles.quizMetaText}>{quiz.questions} questions</Text>
                    <Text style={styles.quizMetaText}>•</Text>
                    <Text style={styles.quizMetaText}>{quiz.difficulty}</Text>
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
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    gap: 8,
  },
  quizMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
