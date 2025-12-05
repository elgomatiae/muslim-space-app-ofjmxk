
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
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
    id: 'morning',
    title: 'Morning',
    icon: 'sun-max',
    color: '#FFB300',
    duas: [
      {
        id: 'mor1',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
        transliteration: 'Asbahna wa asbahal-mulku lillah',
        translation: 'We have entered the morning and the dominion belongs to Allah',
        reference: 'Muslim',
      },
      {
        id: 'mor2',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
        transliteration: 'Allahumma bika asbahna wa bika amsayna',
        translation: 'O Allah, by You we enter the morning and by You we enter the evening',
        reference: 'Abu Dawud',
      },
      {
        id: 'mor3',
        arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ',
        transliteration: 'Asbahna \'ala fitratil-Islam',
        translation: 'We have entered the morning upon the natural religion of Islam',
        reference: 'Ahmad',
      },
    ],
  },
  {
    id: 'evening',
    title: 'Evening',
    icon: 'moon',
    color: '#5E35B1',
    duas: [
      {
        id: 'eve1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
        transliteration: 'Amsayna wa amsal-mulku lillah',
        translation: 'We have entered the evening and the dominion belongs to Allah',
        reference: 'Muslim',
      },
      {
        id: 'eve2',
        arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ',
        transliteration: 'Allahumma inni amsaytu ushhiduka',
        translation: 'O Allah, I have entered the evening and I bear witness to You',
        reference: 'Abu Dawud',
      },
      {
        id: 'eve3',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Amsayna wa amsal-mulku lillahi walhamdulillah',
        translation: 'We have entered the evening and the dominion and praise belong to Allah',
        reference: 'Muslim',
      },
    ],
  },
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
      {
        id: 'f2',
        arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي',
        transliteration: 'Rabbi ij\'alni muqimas-salati wa min dhurriyyati',
        translation: 'My Lord, make me an establisher of prayer, and [many] from my descendants',
        reference: 'Quran 14:40',
      },
      {
        id: 'f3',
        arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ',
        transliteration: 'Rabbanagh-fir li wa liwalidayya wa lilmu\'minin',
        translation: 'Our Lord, forgive me and my parents and the believers',
        reference: 'Quran 14:41',
      },
      {
        id: 'f4',
        arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        transliteration: 'Rabbir-hamhuma kama rabbayani saghira',
        translation: 'My Lord, have mercy upon them as they brought me up when I was small',
        reference: 'Quran 17:24',
      },
    ],
  },
  {
    id: 'stress',
    title: 'Stress & Anxiety',
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
      {
        id: 's2',
        arabic: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
        translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers',
        reference: 'Quran 21:87',
      },
      {
        id: 's3',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
        transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan',
        translation: 'O Allah, I seek refuge in You from worry and grief',
        reference: 'Bukhari',
      },
      {
        id: 's4',
        arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
        transliteration: 'Allahumma la sahla illa ma ja\'altahu sahla',
        translation: 'O Allah, there is no ease except what You make easy',
        reference: 'Ibn Hibban',
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
      {
        id: 'g2',
        arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ كُلُّهُ',
        transliteration: 'Allahumma lakal-hamdu kulluh',
        translation: 'O Allah, all praise is due to You',
        reference: 'Muslim',
      },
      {
        id: 'g3',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
        transliteration: 'Alhamdulillahil-ladhi at\'amana wa saqana',
        translation: 'All praise is due to Allah who has fed us and given us drink',
        reference: 'Abu Dawud',
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
      {
        id: 'st2',
        arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
        transliteration: 'Rabbana afrigh \'alayna sabran wa thabbit aqdamana',
        translation: 'Our Lord, pour upon us patience and plant firmly our feet',
        reference: 'Quran 2:250',
      },
      {
        id: 'st3',
        arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ',
        transliteration: 'Hasbiyallahu la ilaha illa huwa',
        translation: 'Sufficient for me is Allah; there is no deity except Him',
        reference: 'Quran 9:129',
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
      {
        id: 'p2',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
        transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'',
        translation: 'In the name of Allah with whose name nothing is harmed',
        reference: 'Tirmidhi',
      },
      {
        id: 'p3',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ',
        transliteration: 'Allahumma inni a\'udhu bika minal-barasi wal-junun',
        translation: 'O Allah, I seek refuge in You from leprosy and madness',
        reference: 'Abu Dawud',
      },
      {
        id: 'p4',
        arabic: 'أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'A\'udhu billahis-sami\'il-\'alimi minash-shaytanir-rajim',
        translation: 'I seek refuge in Allah, the All-Hearing, the All-Knowing, from the accursed Satan',
        reference: 'Abu Dawud',
      },
    ],
  },
  {
    id: 'travel',
    title: 'Travel',
    icon: 'airplane',
    color: '#00ACC1',
    duas: [
      {
        id: 't1',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
        transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin',
        translation: 'Glory to Him who has subjected this to us, and we could never have it',
        reference: 'Quran 43:13',
      },
      {
        id: 't2',
        arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى',
        transliteration: 'Allahumma inna nas\'aluka fi safarina hadhal-birra wat-taqwa',
        translation: 'O Allah, we ask You in this journey of ours for righteousness and piety',
        reference: 'Muslim',
      },
      {
        id: 't3',
        arabic: 'اللَّهُمَّ اطْوِ لَنَا الْأَرْضَ وَهَوِّنْ عَلَيْنَا السَّفَرَ',
        transliteration: 'Allahummah-twi lanal-arda wa hawwin \'alaynas-safar',
        translation: 'O Allah, shorten the distance for us and make the journey easy',
        reference: 'Muslim',
      },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep',
    icon: 'bed',
    color: '#7E57C2',
    duas: [
      {
        id: 'sl1',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        translation: 'In Your name, O Allah, I die and I live',
        reference: 'Bukhari',
      },
      {
        id: 'sl2',
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        transliteration: 'Allahumma qini \'adhabaka yawma tab\'athu \'ibadak',
        translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants',
        reference: 'Abu Dawud',
      },
      {
        id: 'sl3',
        arabic: 'اللَّهُمَّ بِاسْمِكَ أَحْيَا وَأَمُوتُ',
        transliteration: 'Allahumma bismika ahya wa amut',
        translation: 'O Allah, in Your name I live and die',
        reference: 'Bukhari',
      },
    ],
  },
  {
    id: 'health',
    title: 'Health',
    icon: 'heart-pulse',
    color: '#EF5350',
    duas: [
      {
        id: 'h1',
        arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي',
        transliteration: 'Allahumma \'afini fi badani',
        translation: 'O Allah, grant me health in my body',
        reference: 'Abu Dawud',
      },
      {
        id: 'h2',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
        transliteration: 'Allahumma inni as\'alukal-\'afiyata fid-dunya wal-akhirah',
        translation: 'O Allah, I ask You for well-being in this world and the Hereafter',
        reference: 'Ibn Majah',
      },
      {
        id: 'h3',
        arabic: 'أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ',
        transliteration: 'Adh-hibil-ba\'sa rabban-nas',
        translation: 'Remove the harm, O Lord of mankind',
        reference: 'Bukhari',
      },
    ],
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness',
    icon: 'hands-praying',
    color: '#66BB6A',
    duas: [
      {
        id: 'for1',
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
        transliteration: 'Astaghfirullahul-\'Azim',
        translation: 'I seek forgiveness from Allah, the Magnificent',
        reference: 'Abu Dawud',
      },
      {
        id: 'for2',
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ',
        transliteration: 'Rabbigh-fir li wa tub \'alayy',
        translation: 'My Lord, forgive me and accept my repentance',
        reference: 'Abu Dawud',
      },
      {
        id: 'for3',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: 'Allahumma innaka \'afuwwun tuhibbul-\'afwa fa\'fu \'anni',
        translation: 'O Allah, You are Forgiving and love forgiveness, so forgive me',
        reference: 'Tirmidhi',
      },
      {
        id: 'for4',
        arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا',
        transliteration: 'Rabbana zalamna anfusana wa illam taghfir lana',
        translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us',
        reference: 'Quran 7:23',
      },
    ],
  },
  {
    id: 'success',
    title: 'Success',
    icon: 'trophy',
    color: '#FFA726',
    duas: [
      {
        id: 'suc1',
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: 'Rabbi zidni \'ilma',
        translation: 'My Lord, increase me in knowledge',
        reference: 'Quran 20:114',
      },
      {
        id: 'suc2',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanah',
        translation: 'Our Lord, give us in this world good and in the Hereafter good',
        reference: 'Quran 2:201',
      },
      {
        id: 'suc3',
        arabic: 'رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ',
        transliteration: 'Rabbi adkhilni mudkhala sidq',
        translation: 'My Lord, cause me to enter a sound entrance',
        reference: 'Quran 17:80',
      },
    ],
  },
];

export default function DuasScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const category = duaCategories.find(c => c.id === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duas</Text>
        <Text style={styles.headerSubtitle}>Supplications for every occasion</Text>
      </View>

      {!selectedCategory ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.categoriesGrid}>
            {duaCategories.map((cat) => (
              <TouchableOpacity
                key={`dua-category-${cat.id}`}
                style={[styles.categoryCard, { backgroundColor: cat.color }]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <IconSymbol
                  ios_icon_name={cat.icon as any}
                  android_material_icon_name={cat.icon as any}
                  size={32}
                  color={colors.card}
                />
                <Text style={styles.categoryCardTitle}>{cat.title}</Text>
                <Text style={styles.categoryCardCount}>{cat.duas.length} duas</Text>
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
                <View style={[styles.categoryBanner, { backgroundColor: category.color }]}>
                  <IconSymbol
                    ios_icon_name={category.icon as any}
                    android_material_icon_name={category.icon as any}
                    size={36}
                    color={colors.card}
                  />
                  <View style={styles.categoryBannerText}>
                    <Text style={styles.categoryBannerTitle}>{category.title} Duas</Text>
                    <Text style={styles.categoryBannerSubtitle}>{category.duas.length} supplications</Text>
                  </View>
                </View>

                {category.duas.map((dua) => (
                  <View key={`dua-${dua.id}`} style={styles.duaCard}>
                    <View style={[styles.duaNumber, { backgroundColor: category.color }]}>
                      <Text style={styles.duaNumberText}>{category.duas.indexOf(dua) + 1}</Text>
                    </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    fontSize: 15,
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
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  categoryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginTop: 12,
    textAlign: 'center',
  },
  categoryCardCount: {
    fontSize: 13,
    color: colors.card,
    marginTop: 4,
    opacity: 0.9,
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
  categoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  categoryBannerText: {
    flex: 1,
  },
  categoryBannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 4,
  },
  categoryBannerSubtitle: {
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
