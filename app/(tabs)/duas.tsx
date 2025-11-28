
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  bookmarked: boolean;
}

const duaCategories = [
  'All',
  'Morning & Evening',
  'Family',
  'Hardship',
  'Gratitude',
  'Protection',
  'Travel',
  'Health',
];

const duas: Dua[] = [
  {
    id: '1',
    title: 'Morning Dua',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal-mulku lillah',
    translation: 'We have entered a new day and with it all dominion is Allah\'s',
    category: 'Morning & Evening',
    bookmarked: true,
  },
  {
    id: '2',
    title: 'For Parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irhamhuma kama rabbayani saghira',
    translation: 'My Lord, have mercy upon them as they brought me up when I was small',
    category: 'Family',
    bookmarked: false,
  },
  {
    id: '3',
    title: 'In Times of Difficulty',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakeel',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
    category: 'Hardship',
    bookmarked: true,
  },
  {
    id: '4',
    title: 'Gratitude',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Alhamdulillahi rabbil \'alamin',
    translation: 'All praise is due to Allah, Lord of all the worlds',
    category: 'Gratitude',
    bookmarked: false,
  },
  {
    id: '5',
    title: 'Protection from Evil',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
    category: 'Protection',
    bookmarked: false,
  },
  {
    id: '6',
    title: 'Before Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
    transliteration: 'Subhanal-ladhi sakhkhara lana hadha',
    translation: 'Glory be to Him who has subjected this to us',
    category: 'Travel',
    bookmarked: true,
  },
];

export default function DuasScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedDuas, setBookmarkedDuas] = useState<string[]>(
    duas.filter(d => d.bookmarked).map(d => d.id)
  );

  const toggleBookmark = (duaId: string) => {
    setBookmarkedDuas(prev =>
      prev.includes(duaId)
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId]
    );
  };

  const filteredDuas = selectedCategory === 'All'
    ? duas
    : duas.filter(dua => dua.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duas</Text>
        <Text style={styles.headerSubtitle}>Supplications for every occasion</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {duaCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {filteredDuas.map((dua, index) => (
          <View key={index} style={styles.duaCard}>
            <View style={styles.duaHeader}>
              <Text style={styles.duaTitle}>{dua.title}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(dua.id)}>
                <IconSymbol
                  ios_icon_name={bookmarkedDuas.includes(dua.id) ? 'bookmark.fill' : 'bookmark'}
                  android_material_icon_name={bookmarkedDuas.includes(dua.id) ? 'bookmark' : 'bookmark-border'}
                  size={24}
                  color={bookmarkedDuas.includes(dua.id) ? colors.secondary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.duaContent}>
              <Text style={styles.duaArabic}>{dua.arabic}</Text>
              <Text style={styles.duaTransliteration}>{dua.transliteration}</Text>
              <Text style={styles.duaTranslation}>{dua.translation}</Text>
            </View>

            <View style={styles.duaFooter}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{dua.category}</Text>
              </View>
              <TouchableOpacity style={styles.shareButton}>
                <IconSymbol
                  ios_icon_name="square.and.arrow.up"
                  android_material_icon_name="share"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredDuas.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>No duas found in this category</Text>
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
  categoriesScroll: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryChipTextActive: {
    color: colors.card,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  duaCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  duaContent: {
    marginBottom: 16,
  },
  duaArabic: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 40,
  },
  duaTransliteration: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  duaTranslation: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  duaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});
