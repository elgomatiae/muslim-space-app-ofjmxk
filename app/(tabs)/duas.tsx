
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface DuaCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  duas: Dua[];
}

interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

const duaCategories: DuaCategory[] = [
  {
    id: 'family',
    title: 'Family',
    icon: 'heart',
    color: colors.secondary,
    duas: [
      {
        id: 'f1',
        arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
        transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yunin',
        translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes',
        reference: 'Quran 25:74',
      },
    ],
  },
  {
    id: 'stress',
    title: 'Stress',
    icon: 'cloud',
    color: colors.accent,
    duas: [
      {
        id: 's1',
        arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: 'Hasbunallahu wa ni\'mal wakeel',
        translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
        reference: 'Quran 3:173',
      },
    ],
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    icon: 'star',
    color: colors.highlight,
    duas: [
      {
        id: 'g1',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Alhamdulillahi rabbil \'alameen',
        translation: 'All praise is due to Allah, Lord of the worlds',
        reference: 'Quran 1:2',
      },
    ],
  },
  {
    id: 'strength',
    title: 'Strength',
    icon: 'bolt',
    color: colors.warning,
    duas: [
      {
        id: 'st1',
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        transliteration: 'Rabbi ishrah li sadri wa yassir li amri',
        translation: 'My Lord, expand for me my breast and ease for me my task',
        reference: 'Quran 20:25-26',
      },
    ],
  },
  {
    id: 'protection',
    title: 'Protection',
    icon: 'shield',
    color: colors.primary,
    duas: [
      {
        id: 'p1',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
        reference: 'Muslim',
      },
    ],
  },
  {
    id: 'travel',
    title: 'Travel',
    icon: 'airplane',
    color: colors.accent,
    duas: [
      {
        id: 't1',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
        transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin',
        translation: 'Glory to Him who has subjected this to us, and we could never have it',
        reference: 'Quran 43:13',
      },
    ],
  },
];

export default function DuasScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const category = duaCategories.find(c => c.id === selectedCategory);

  return (
    <ImageBackground
      source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2FsbGlncmFwaHkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjgwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtinINmE2YTZhzwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjI1MCIgZm9udC1zaXplPSI2MCIgb3BhY2l0eT0iMC4wMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmaWxsPSIjMDAwMDAwIj7Yp9mE2K3ZhdivINmE2YTZhzwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMzUwIiBmb250LXNpemU9IjcwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtiz2KjYrdin2YY8L3RleHQ+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNjYWxsaWdyYXBoeSkiLz48L3N2Zz4=' }}
      style={styles.container}
      imageStyle={styles.backgroundImageStyle}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duas</Text>
        <Text style={styles.headerSubtitle}>Supplications for every occasion</Text>
      </View>

      {!selectedCategory ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.categoriesGrid}>
            {duaCategories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, { backgroundColor: cat.color }]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <IconSymbol
                  ios_icon_name={cat.icon as any}
                  android_material_icon_name={cat.icon as any}
                  size={32}
                  color={colors.card}
                />
                <Text style={styles.categoryButtonText}>{cat.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <React.Fragment>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="chevron-left"
              size={24}
              color={colors.text}
            />
            <Text style={styles.backButtonText}>Back to Categories</Text>
          </TouchableOpacity>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {category && (
              <React.Fragment>
                <View style={[styles.categoryHeader, { backgroundColor: category.color }]}>
                  <IconSymbol
                    ios_icon_name={category.icon as any}
                    android_material_icon_name={category.icon as any}
                    size={32}
                    color={colors.card}
                  />
                  <Text style={styles.categoryHeaderTitle}>{category.title} Duas</Text>
                </View>

                {category.duas.map((dua, index) => (
                  <View key={index} style={styles.duaCard}>
                    <Text style={styles.duaArabic}>{dua.arabic}</Text>
                    <Text style={styles.duaTransliteration}>{dua.transliteration}</Text>
                    <Text style={styles.duaTranslation}>{dua.translation}</Text>
                    <Text style={styles.duaReference}>{dua.reference}</Text>
                  </View>
                ))}
              </React.Fragment>
            )}
          </ScrollView>
        </React.Fragment>
      )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginTop: 12,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
  },
  duaCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  duaArabic: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 36,
  },
  duaTransliteration: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  duaTranslation: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  duaReference: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
