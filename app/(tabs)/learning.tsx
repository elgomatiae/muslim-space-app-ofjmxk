
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
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
    <ImageBackground
      source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2FsbGlncmFwaHkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjgwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtinINmE2YTZhzwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjI1MCIgZm9udC1zaXplPSI2MCIgb3BhY2l0eT0iMC4wMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmaWxsPSIjMDAwMDAwIj7Yp9mE2K3ZhdivINmE2YTZhzwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMzUwIiBmb250LXNpemU9IjcwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtiz2KjYrdin2YY8L3RleHQ+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNjYWxsaWdyYXBoeSkiLz48L3N2Zz4=' }}
      style={styles.container}
      imageStyle={styles.backgroundImageStyle}
    >
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
                      <View style={styles.thumbnail}>
                        <IconSymbol
                          ios_icon_name="play.circle.fill"
                          android_material_icon_name="play-circle"
                          size={48}
                          color={colors.card}
                        />
                      </View>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {video.title}
                      </Text>
                      <Text style={styles.videoDuration}>{video.duration}</Text>
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
                      <View style={[styles.thumbnail, { backgroundColor: colors.secondary }]}>
                        <IconSymbol
                          ios_icon_name="waveform"
                          android_material_icon_name="graphic-eq"
                          size={48}
                          color={colors.card}
                        />
                      </View>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {recitation.title}
                      </Text>
                      <Text style={styles.videoDuration}>{recitation.reciter}</Text>
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
    width: 180,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    padding: 12,
    paddingBottom: 4,
    lineHeight: 18,
  },
  videoDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingHorizontal: 12,
    paddingBottom: 12,
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
