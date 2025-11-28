
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
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'morning', label: 'Morning', icon: 'wb-sunny' },
  { id: 'family', label: 'Family', icon: 'people' },
  { id: 'hardship', label: 'Hardship', icon: 'favorite-border' },
  { id: 'gratitude', label: 'Gratitude', icon: 'star' },
  { id: 'protection', label: 'Protection', icon: 'shield' },
  { id: 'travel', label: 'Travel', icon: 'flight' },
  { id: 'health', label: 'Health', icon: 'healing' },
];

const duas: Dua[] = [
  {
    id: '1',
    title: 'Morning Dua',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal-mulku lillah',
    translation: 'We have entered a new day and with it all dominion is Allah\'s',
    category: 'morning',
    bookmarked: true,
  },
  {
    id: '2',
    title: 'For Parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irhamhuma kama rabbayani saghira',
    translation: 'My Lord, have mercy upon them as they brought me up when I was small',
    category: 'family',
    bookmarked: false,
  },
  {
    id: '3',
    title: 'In Times of Difficulty',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakeel',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
    category: 'hardship',
    bookmarked: true,
  },
  {
    id: '4',
    title: 'Gratitude',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Alhamdulillahi rabbil \'alamin',
    translation: 'All praise is due to Allah, Lord of all the worlds',
    category: 'gratitude',
    bookmarked: false,
  },
  {
    id: '5',
    title: 'Protection from Evil',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
    category: 'protection',
    bookmarked: false,
  },
  {
    id: '6',
    title: 'Before Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
    transliteration: 'Subhanal-ladhi sakhkhara lana hadha',
    translation: 'Glory be to Him who has subjected this to us',
    category: 'travel',
    bookmarked: true,
  },
];

export default function DuasScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const filteredDuas = selectedCategory === 'all'
    ? duas
    : duas.filter(dua => dua.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duas</Text>
        <Text style={styles.headerSubtitle}>Supplications for every occasion</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {duaCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconSymbol
                ios_icon_name={category.icon as any}
                android_material_icon_name={category.icon as any}
                size={20}
                color={selectedCategory === category.id ? colors.card : colors.primary}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.categoryButtonTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                <Text style={styles.categoryBadgeText}>
                  {duaCategories.find(c => c.id === dua.category)?.label || dua.category}
                </Text>
              </View>
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
  categoriesContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryButtonTextActive: {
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
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
