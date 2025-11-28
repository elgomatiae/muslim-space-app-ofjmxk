
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface DawahSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  articles: number;
}

const sections: DawahSection[] = [
  {
    id: '1',
    title: 'Scientific Miracles',
    description: 'Embryology, mountains, seas, and more',
    icon: 'flask',
    color: colors.primary,
    articles: 12,
  },
  {
    id: '2',
    title: 'Linguistic Miracles',
    description: 'Eloquence and uniqueness of Arabic',
    icon: 'text-format',
    color: colors.secondary,
    articles: 8,
  },
  {
    id: '3',
    title: 'Historical Miracles',
    description: 'Prophecies and preserved manuscripts',
    icon: 'history',
    color: colors.accent,
    articles: 15,
  },
  {
    id: '4',
    title: 'Mathematical Miracles',
    description: 'Numeric patterns and word frequencies',
    icon: 'calculate',
    color: colors.highlight,
    articles: 10,
  },
  {
    id: '5',
    title: 'How to Give Dawah',
    description: 'Step-by-step conversation guides',
    icon: 'chat',
    color: colors.success,
    articles: 20,
  },
];

export default function DawahScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dawah Resources</Text>
        <Text style={styles.headerSubtitle}>Share Islam with confidence</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.introCard}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={48}
            color={colors.primary}
          />
          <Text style={styles.introTitle}>Welcome to Dawah Hub</Text>
          <Text style={styles.introText}>
            Explore the miracles of Islam and learn how to share your faith effectively with others.
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <TouchableOpacity key={index} style={styles.sectionCard} activeOpacity={0.8}>
              <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
                <IconSymbol
                  ios_icon_name={section.icon as any}
                  android_material_icon_name={section.icon as any}
                  size={32}
                  color={colors.card}
                />
              </View>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
                <View style={styles.articlesBadge}>
                  <IconSymbol
                    ios_icon_name="doc.text"
                    android_material_icon_name="article"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.articlesText}>{section.articles} articles</Text>
                </View>
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

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Quick Dawah Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Start with common ground and shared values</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Listen actively and show genuine interest</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Use clear examples and relatable stories</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Be patient and respectful at all times</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Focus on the beauty and wisdom of Islam</Text>
            </View>
          </View>
        </View>
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
    padding: 16,
    paddingBottom: 120,
  },
  introCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  articlesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articlesText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  tipsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(63, 81, 181, 0.3)',
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.card,
    marginTop: 7,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
