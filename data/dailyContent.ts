
export interface DailyHadith {
  id: string;
  arabic: string;
  translation: string;
  reference: string;
  date: string;
}

export interface DailyVerse {
  id: string;
  arabic: string;
  translation: string;
  reference: string;
  date: string;
}

const hadiths: DailyHadith[] = [
  {
    id: '1',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions, and every person will be rewarded according to their intention.',
    reference: 'Sahih Bukhari 1',
    date: '2024-01-01',
  },
  {
    id: '2',
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
    reference: 'Sahih Bukhari 10',
    date: '2024-01-02',
  },
  {
    id: '3',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it.',
    reference: 'Sahih Bukhari 5027',
    date: '2024-01-03',
  },
  {
    id: '4',
    arabic: 'الدِّينُ النَّصِيحَةُ',
    translation: 'Religion is sincerity and sincere advice.',
    reference: 'Sahih Muslim 55',
    date: '2024-01-04',
  },
  {
    id: '5',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    reference: 'Sahih Bukhari 6018',
    date: '2024-01-05',
  },
  {
    id: '6',
    arabic: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا',
    translation: 'The believer to another believer is like a building whose different parts enforce each other.',
    reference: 'Sahih Bukhari 481',
    date: '2024-01-06',
  },
  {
    id: '7',
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
    reference: 'Sahih Bukhari 13',
    date: '2024-01-07',
  },
];

const verses: DailyVerse[] = [
  {
    id: '1',
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    translation: 'And I did not create the jinn and mankind except to worship Me.',
    reference: 'Quran 51:56',
    date: '2024-01-01',
  },
  {
    id: '2',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    reference: 'Quran 2:152',
    date: '2024-01-02',
  },
  {
    id: '3',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    reference: 'Quran 94:6',
    date: '2024-01-03',
  },
  {
    id: '4',
    arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
    translation: 'And do not despair of the mercy of Allah.',
    reference: 'Quran 12:87',
    date: '2024-01-04',
  },
  {
    id: '5',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship will be ease.',
    reference: 'Quran 94:5',
    date: '2024-01-05',
  },
  {
    id: '6',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'And whoever relies upon Allah - then He is sufficient for him.',
    reference: 'Quran 65:3',
    date: '2024-01-06',
  },
  {
    id: '7',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
    translation: 'Our Lord, give us in this world good and in the Hereafter good.',
    reference: 'Quran 2:201',
    date: '2024-01-07',
  },
];

export function getDailyHadith(): DailyHadith {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % hadiths.length;
  return hadiths[index];
}

export function getDailyVerse(): DailyVerse {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % verses.length;
  return verses[index];
}
