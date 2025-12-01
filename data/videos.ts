
export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  speaker: string;
  url: string;
}

export interface VideoCategory {
  id: string;
  title: string;
  icon: string;
  videos: Video[];
}

export interface Recitation {
  id: string;
  title: string;
  duration: string;
  reciter: string;
  url: string;
  thumbnail: string;
}

export interface RecitationCategory {
  id: string;
  title: string;
  icon: string;
  recitations: Recitation[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  difficulty: string;
  color: string;
}

export const videoCategories: VideoCategory[] = [
  {
    id: 'quran-tafsir',
    title: 'Quran & Tafsir',
    icon: 'book',
    videos: [
      {
        id: '1',
        title: 'Understanding Surah Al-Fatiha',
        duration: '15:30',
        thumbnail: 'https://img.youtube.com/vi/j-vhNhxwBjU/mqdefault.jpg',
        speaker: 'Nouman Ali Khan',
        url: 'https://www.youtube.com/watch?v=j-vhNhxwBjU',
      },
      {
        id: '2',
        title: 'Tafsir of Surah Yaseen',
        duration: '45:20',
        thumbnail: 'https://img.youtube.com/vi/8wXRH4COJe0/mqdefault.jpg',
        speaker: 'Mufti Menk',
        url: 'https://www.youtube.com/watch?v=8wXRH4COJe0',
      },
      {
        id: '3',
        title: 'Miracles in the Quran',
        duration: '22:15',
        thumbnail: 'https://img.youtube.com/vi/xZIqd_-1Zus/mqdefault.jpg',
        speaker: 'Zakir Naik',
        url: 'https://www.youtube.com/watch?v=xZIqd_-1Zus',
      },
      {
        id: '4',
        title: 'Surah Al-Kahf Explained',
        duration: '38:45',
        thumbnail: 'https://img.youtube.com/vi/Ow5d9tlQmXw/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        url: 'https://www.youtube.com/watch?v=Ow5d9tlQmXw',
      },
    ],
  },
  {
    id: 'seerah',
    title: 'Seerah',
    icon: 'person',
    videos: [
      {
        id: '5',
        title: 'Life of Prophet Muhammad ﷺ',
        duration: '60:00',
        thumbnail: 'https://img.youtube.com/vi/VOUp3ZZ9t3A/mqdefault.jpg',
        speaker: 'Yasir Qadhi',
        url: 'https://www.youtube.com/watch?v=VOUp3ZZ9t3A',
      },
      {
        id: '6',
        title: 'The Battle of Badr',
        duration: '35:45',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        url: 'https://www.youtube.com/watch?v=qsLCtMJZPGo',
      },
      {
        id: '7',
        title: 'The Night Journey',
        duration: '28:30',
        thumbnail: 'https://img.youtube.com/vi/Iq8LVJjIUy0/mqdefault.jpg',
        speaker: 'Mufti Menk',
        url: 'https://www.youtube.com/watch?v=Iq8LVJjIUy0',
      },
    ],
  },
  {
    id: 'aqeedah',
    title: 'Aqeedah',
    icon: 'star',
    videos: [
      {
        id: '8',
        title: 'The Six Pillars of Iman',
        duration: '28:30',
        thumbnail: 'https://img.youtube.com/vi/Ow_5LqammyE/mqdefault.jpg',
        speaker: 'Bilal Philips',
        url: 'https://www.youtube.com/watch?v=Ow_5LqammyE',
      },
      {
        id: '9',
        title: 'Understanding Tawheed',
        duration: '40:15',
        thumbnail: 'https://img.youtube.com/vi/nxXgAiVZRCM/mqdefault.jpg',
        speaker: 'Yasir Qadhi',
        url: 'https://www.youtube.com/watch?v=nxXgAiVZRCM',
      },
    ],
  },
  {
    id: 'fiqh',
    title: 'Fiqh',
    icon: 'gavel',
    videos: [
      {
        id: '10',
        title: 'How to Pray Correctly',
        duration: '25:15',
        thumbnail: 'https://img.youtube.com/vi/I206g-594xo/mqdefault.jpg',
        speaker: 'Assim Al-Hakeem',
        url: 'https://www.youtube.com/watch?v=I206g-594xo',
      },
      {
        id: '11',
        title: 'Fasting in Ramadan',
        duration: '32:40',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
        speaker: 'Mufti Menk',
        url: 'https://www.youtube.com/watch?v=qsLCtMJZPGo',
      },
    ],
  },
  {
    id: 'motivational',
    title: 'Motivational',
    icon: 'favorite',
    videos: [
      {
        id: '12',
        title: 'Never Give Up on Allah',
        duration: '12:45',
        thumbnail: 'https://img.youtube.com/vi/aZb7f9ln1K8/mqdefault.jpg',
        speaker: 'Mufti Menk',
        url: 'https://www.youtube.com/watch?v=aZb7f9ln1K8',
      },
      {
        id: '13',
        title: 'The Power of Dua',
        duration: '18:20',
        thumbnail: 'https://img.youtube.com/vi/Ow5d9tlQmXw/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        url: 'https://www.youtube.com/watch?v=Ow5d9tlQmXw',
      },
      {
        id: '14',
        title: 'Finding Peace in Islam',
        duration: '22:10',
        thumbnail: 'https://img.youtube.com/vi/aZb7f9ln1K8/mqdefault.jpg',
        speaker: 'Nouman Ali Khan',
        url: 'https://www.youtube.com/watch?v=aZb7f9ln1K8',
      },
    ],
  },
  {
    id: 'debates',
    title: 'Debates & Apologetics',
    icon: 'forum',
    videos: [
      {
        id: '15',
        title: 'Islam vs Atheism Debate',
        duration: '90:00',
        thumbnail: 'https://img.youtube.com/vi/xZIqd_-1Zus/mqdefault.jpg',
        speaker: 'Mohammed Hijab',
        url: 'https://www.youtube.com/watch?v=xZIqd_-1Zus',
      },
      {
        id: '16',
        title: 'Responding to Misconceptions',
        duration: '35:20',
        thumbnail: 'https://img.youtube.com/vi/j-vhNhxwBjU/mqdefault.jpg',
        speaker: 'Zakir Naik',
        url: 'https://www.youtube.com/watch?v=j-vhNhxwBjU',
      },
    ],
  },
  {
    id: 'youth',
    title: 'Youth Lectures',
    icon: 'school',
    videos: [
      {
        id: '17',
        title: 'Islam for Young Muslims',
        duration: '25:30',
        thumbnail: 'https://img.youtube.com/vi/VOUp3ZZ9t3A/mqdefault.jpg',
        speaker: 'Nouman Ali Khan',
        url: 'https://www.youtube.com/watch?v=VOUp3ZZ9t3A',
      },
      {
        id: '18',
        title: 'Dealing with Peer Pressure',
        duration: '18:45',
        thumbnail: 'https://img.youtube.com/vi/8wXRH4COJe0/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        url: 'https://www.youtube.com/watch?v=8wXRH4COJe0',
      },
    ],
  },
  {
    id: 'short-clips',
    title: 'Short Clips',
    icon: 'timer',
    videos: [
      {
        id: '19',
        title: 'The Importance of Salah',
        duration: '2:30',
        thumbnail: 'https://img.youtube.com/vi/Iq8LVJjIUy0/mqdefault.jpg',
        speaker: 'Mufti Menk',
        url: 'https://www.youtube.com/watch?v=Iq8LVJjIUy0',
      },
      {
        id: '20',
        title: 'Trust in Allah',
        duration: '3:15',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        url: 'https://www.youtube.com/watch?v=qsLCtMJZPGo',
      },
      {
        id: '21',
        title: 'Patience in Hardship',
        duration: '2:45',
        thumbnail: 'https://img.youtube.com/vi/nxXgAiVZRCM/mqdefault.jpg',
        speaker: 'Nouman Ali Khan',
        url: 'https://www.youtube.com/watch?v=nxXgAiVZRCM',
      },
    ],
  },
];

export const quranRecitations: RecitationCategory[] = [
  {
    id: 'short-surahs',
    title: 'Short Surahs',
    icon: 'music-note',
    recitations: [
      {
        id: 'r1',
        title: 'Surah Al-Fatiha',
        duration: '1:30',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=pbt1LhsI_Ek',
        thumbnail: 'https://img.youtube.com/vi/pbt1LhsI_Ek/mqdefault.jpg',
      },
      {
        id: 'r2',
        title: 'Surah Al-Ikhlas',
        duration: '0:45',
        reciter: 'Abdul Rahman Al-Sudais',
        url: 'https://www.youtube.com/watch?v=Ow5d9tlQmXw',
        thumbnail: 'https://img.youtube.com/vi/Ow5d9tlQmXw/mqdefault.jpg',
      },
      {
        id: 'r3',
        title: 'Surah Al-Falaq',
        duration: '0:50',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=8wXRH4COJe0',
        thumbnail: 'https://img.youtube.com/vi/8wXRH4COJe0/mqdefault.jpg',
      },
      {
        id: 'r4',
        title: 'Surah An-Nas',
        duration: '0:55',
        reciter: 'Abdul Rahman Al-Sudais',
        url: 'https://www.youtube.com/watch?v=j-vhNhxwBjU',
        thumbnail: 'https://img.youtube.com/vi/j-vhNhxwBjU/mqdefault.jpg',
      },
    ],
  },
  {
    id: 'long-surahs',
    title: 'Long Surahs',
    icon: 'library-music',
    recitations: [
      {
        id: 'r5',
        title: 'Surah Al-Baqarah',
        duration: '2:30:00',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=VOUp3ZZ9t3A',
        thumbnail: 'https://img.youtube.com/vi/VOUp3ZZ9t3A/mqdefault.jpg',
      },
      {
        id: 'r6',
        title: 'Surah Yaseen',
        duration: '18:45',
        reciter: 'Abdul Rahman Al-Sudais',
        url: 'https://www.youtube.com/watch?v=xZIqd_-1Zus',
        thumbnail: 'https://img.youtube.com/vi/xZIqd_-1Zus/mqdefault.jpg',
      },
      {
        id: 'r7',
        title: 'Surah Al-Kahf',
        duration: '35:20',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=Iq8LVJjIUy0',
        thumbnail: 'https://img.youtube.com/vi/Iq8LVJjIUy0/mqdefault.jpg',
      },
    ],
  },
  {
    id: 'beautiful',
    title: 'Beautiful Recitations',
    icon: 'favorite',
    recitations: [
      {
        id: 'r8',
        title: 'Surah Ar-Rahman',
        duration: '12:30',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=qsLCtMJZPGo',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
      },
      {
        id: 'r9',
        title: 'Surah Al-Mulk',
        duration: '10:15',
        reciter: 'Abdul Rahman Al-Sudais',
        url: 'https://www.youtube.com/watch?v=nxXgAiVZRCM',
        thumbnail: 'https://img.youtube.com/vi/nxXgAiVZRCM/mqdefault.jpg',
      },
      {
        id: 'r10',
        title: 'Surah Al-Waqiah',
        duration: '14:20',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=Ow_5LqammyE',
        thumbnail: 'https://img.youtube.com/vi/Ow_5LqammyE/mqdefault.jpg',
      },
    ],
  },
  {
    id: 'emotional',
    title: 'Emotional Recitations',
    icon: 'sentiment-satisfied',
    recitations: [
      {
        id: 'r11',
        title: 'Surah Maryam',
        duration: '16:40',
        reciter: 'Abdul Rahman Al-Sudais',
        url: 'https://www.youtube.com/watch?v=I206g-594xo',
        thumbnail: 'https://img.youtube.com/vi/I206g-594xo/mqdefault.jpg',
      },
      {
        id: 'r12',
        title: 'Surah Yusuf',
        duration: '28:30',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=aZb7f9ln1K8',
        thumbnail: 'https://img.youtube.com/vi/aZb7f9ln1K8/mqdefault.jpg',
      },
    ],
  },
  {
    id: 'juz-amma',
    title: 'Juz Amma',
    icon: 'collections-bookmark',
    recitations: [
      {
        id: 'r13',
        title: 'Juz 30 Complete',
        duration: '45:00',
        reciter: 'Mishary Rashid Alafasy',
        url: 'https://www.youtube.com/watch?v=VOUp3ZZ9t3A',
        thumbnail: 'https://img.youtube.com/vi/VOUp3ZZ9t3A/mqdefault.jpg',
      },
      {
        id: 'r14',
        title: 'Surah An-Naba',
        duration: '5:30',
        reciter: 'Abdul Rahman Al-Sudais',
        url: 'https://www.youtube.com/watch?v=8wXRH4COJe0',
        thumbnail: 'https://img.youtube.com/vi/8wXRH4COJe0/mqdefault.jpg',
      },
    ],
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Quran Knowledge',
    description: 'Test your knowledge of the Holy Quran',
    questions: 20,
    difficulty: 'Medium',
    color: '#4CAF50',
  },
  {
    id: 'q2',
    title: 'Seerah Quiz',
    description: 'Learn about the life of Prophet Muhammad ﷺ',
    questions: 15,
    difficulty: 'Easy',
    color: '#2196F3',
  },
  {
    id: 'q3',
    title: 'Islamic History',
    description: 'Explore the rich history of Islam',
    questions: 25,
    difficulty: 'Hard',
    color: '#FF9800',
  },
  {
    id: 'q4',
    title: 'Fiqh Basics',
    description: 'Understanding Islamic jurisprudence',
    questions: 18,
    difficulty: 'Medium',
    color: '#9C27B0',
  },
  {
    id: 'q5',
    title: 'Pillars of Islam',
    description: 'Test your knowledge of the five pillars',
    questions: 10,
    difficulty: 'Easy',
    color: '#F44336',
  },
  {
    id: 'q6',
    title: 'Prophets in Islam',
    description: 'Learn about the prophets mentioned in the Quran',
    questions: 22,
    difficulty: 'Medium',
    color: '#00BCD4',
  },
  {
    id: 'q7',
    title: 'Ramadan & Fasting',
    description: 'Everything about the blessed month',
    questions: 12,
    difficulty: 'Easy',
    color: '#8BC34A',
  },
  {
    id: 'q8',
    title: 'Hajj & Umrah',
    description: 'The pilgrimage to Makkah',
    questions: 16,
    difficulty: 'Medium',
    color: '#FF5722',
  },
];
