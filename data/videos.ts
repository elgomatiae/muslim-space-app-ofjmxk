
export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  speaker: string;
  youtubeId: string;
}

export interface VideoCategory {
  id: string;
  title: string;
  icon: string;
  videos: Video[];
}

export const lectureCategories: VideoCategory[] = [
  {
    id: '1',
    title: 'Quran & Tafsir',
    icon: 'book',
    videos: [
      {
        id: '1',
        title: 'Understanding Surah Al-Fatiha',
        duration: '15:30',
        thumbnail: 'https://img.youtube.com/vi/j-vhNhxwBjU/mqdefault.jpg',
        speaker: 'Nouman Ali Khan',
        youtubeId: 'j-vhNhxwBjU',
      },
      {
        id: '2',
        title: 'Tafsir of Surah Yaseen',
        duration: '45:20',
        thumbnail: 'https://img.youtube.com/vi/8wXRH4COJe0/mqdefault.jpg',
        speaker: 'Mufti Menk',
        youtubeId: '8wXRH4COJe0',
      },
      {
        id: '3',
        title: 'Miracles in the Quran',
        duration: '22:15',
        thumbnail: 'https://img.youtube.com/vi/xZIqd_-1Zus/mqdefault.jpg',
        speaker: 'Zakir Naik',
        youtubeId: 'xZIqd_-1Zus',
      },
      {
        id: '4',
        title: 'Surah Al-Kahf Explained',
        duration: '38:45',
        thumbnail: 'https://img.youtube.com/vi/Ow5d9tlQmXw/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        youtubeId: 'Ow5d9tlQmXw',
      },
    ],
  },
  {
    id: '2',
    title: 'Seerah',
    icon: 'person',
    videos: [
      {
        id: '5',
        title: 'Life of Prophet Muhammad ﷺ',
        duration: '60:00',
        thumbnail: 'https://img.youtube.com/vi/VOUp3ZZ9t3A/mqdefault.jpg',
        speaker: 'Yasir Qadhi',
        youtubeId: 'VOUp3ZZ9t3A',
      },
      {
        id: '6',
        title: 'The Battle of Badr',
        duration: '35:45',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        youtubeId: 'qsLCtMJZPGo',
      },
      {
        id: '7',
        title: 'The Night Journey',
        duration: '28:30',
        thumbnail: 'https://img.youtube.com/vi/Iq8LVJjIUy0/mqdefault.jpg',
        speaker: 'Mufti Menk',
        youtubeId: 'Iq8LVJjIUy0',
      },
    ],
  },
  {
    id: '3',
    title: 'Aqeedah',
    icon: 'star',
    videos: [
      {
        id: '8',
        title: 'The Six Pillars of Iman',
        duration: '28:30',
        thumbnail: 'https://img.youtube.com/vi/Ow_5LqammyE/mqdefault.jpg',
        speaker: 'Bilal Philips',
        youtubeId: 'Ow_5LqammyE',
      },
      {
        id: '9',
        title: 'Understanding Tawheed',
        duration: '40:15',
        thumbnail: 'https://img.youtube.com/vi/nxXgAiVZRCM/mqdefault.jpg',
        speaker: 'Yasir Qadhi',
        youtubeId: 'nxXgAiVZRCM',
      },
    ],
  },
  {
    id: '4',
    title: 'Fiqh',
    icon: 'gavel',
    videos: [
      {
        id: '10',
        title: 'How to Pray Correctly',
        duration: '25:15',
        thumbnail: 'https://img.youtube.com/vi/I206g-594xo/mqdefault.jpg',
        speaker: 'Assim Al-Hakeem',
        youtubeId: 'I206g-594xo',
      },
      {
        id: '11',
        title: 'Fasting in Ramadan',
        duration: '32:40',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
        speaker: 'Mufti Menk',
        youtubeId: 'qsLCtMJZPGo',
      },
    ],
  },
  {
    id: '5',
    title: 'Motivational',
    icon: 'favorite',
    videos: [
      {
        id: '12',
        title: 'Never Give Up on Allah',
        duration: '12:45',
        thumbnail: 'https://img.youtube.com/vi/aZb7f9ln1K8/mqdefault.jpg',
        speaker: 'Mufti Menk',
        youtubeId: 'aZb7f9ln1K8',
      },
      {
        id: '13',
        title: 'The Power of Dua',
        duration: '18:20',
        thumbnail: 'https://img.youtube.com/vi/Ow5d9tlQmXw/mqdefault.jpg',
        speaker: 'Omar Suleiman',
        youtubeId: 'Ow5d9tlQmXw',
      },
      {
        id: '14',
        title: 'Finding Peace in Islam',
        duration: '22:10',
        thumbnail: 'https://img.youtube.com/vi/aZb7f9ln1K8/mqdefault.jpg',
        speaker: 'Nouman Ali Khan',
        youtubeId: 'aZb7f9ln1K8',
      },
    ],
  },
];

export const recitationCategories: VideoCategory[] = [
  {
    id: 'short',
    title: 'Short Surahs',
    icon: 'music-note',
    videos: [
      {
        id: 'r1',
        title: 'Surah Al-Fatiha',
        duration: '1:30',
        thumbnail: 'https://img.youtube.com/vi/pbt1LhsI_Ek/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: 'pbt1LhsI_Ek',
      },
      {
        id: 'r2',
        title: 'Surah Al-Ikhlas',
        duration: '0:45',
        thumbnail: 'https://img.youtube.com/vi/Ow5d9tlQmXw/mqdefault.jpg',
        speaker: 'Abdul Rahman Al-Sudais',
        youtubeId: 'Ow5d9tlQmXw',
      },
      {
        id: 'r3',
        title: 'Surah Al-Falaq',
        duration: '0:50',
        thumbnail: 'https://img.youtube.com/vi/8wXRH4COJe0/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: '8wXRH4COJe0',
      },
      {
        id: 'r4',
        title: 'Surah An-Nas',
        duration: '0:55',
        thumbnail: 'https://img.youtube.com/vi/j-vhNhxwBjU/mqdefault.jpg',
        speaker: 'Abdul Rahman Al-Sudais',
        youtubeId: 'j-vhNhxwBjU',
      },
    ],
  },
  {
    id: 'long',
    title: 'Long Surahs',
    icon: 'library-music',
    videos: [
      {
        id: 'r5',
        title: 'Surah Al-Baqarah',
        duration: '2:30:00',
        thumbnail: 'https://img.youtube.com/vi/VOUp3ZZ9t3A/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: 'VOUp3ZZ9t3A',
      },
      {
        id: 'r6',
        title: 'Surah Yaseen',
        duration: '18:45',
        thumbnail: 'https://img.youtube.com/vi/xZIqd_-1Zus/mqdefault.jpg',
        speaker: 'Abdul Rahman Al-Sudais',
        youtubeId: 'xZIqd_-1Zus',
      },
      {
        id: 'r7',
        title: 'Surah Al-Kahf',
        duration: '35:20',
        thumbnail: 'https://img.youtube.com/vi/Iq8LVJjIUy0/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: 'Iq8LVJjIUy0',
      },
    ],
  },
  {
    id: 'beautiful',
    title: 'Beautiful Recitations',
    icon: 'favorite',
    videos: [
      {
        id: 'r8',
        title: 'Surah Ar-Rahman',
        duration: '12:30',
        thumbnail: 'https://img.youtube.com/vi/qsLCtMJZPGo/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: 'qsLCtMJZPGo',
      },
      {
        id: 'r9',
        title: 'Surah Al-Mulk',
        duration: '10:15',
        thumbnail: 'https://img.youtube.com/vi/nxXgAiVZRCM/mqdefault.jpg',
        speaker: 'Abdul Rahman Al-Sudais',
        youtubeId: 'nxXgAiVZRCM',
      },
      {
        id: 'r10',
        title: 'Surah Al-Waqiah',
        duration: '14:20',
        thumbnail: 'https://img.youtube.com/vi/Ow_5LqammyE/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: 'Ow_5LqammyE',
      },
    ],
  },
  {
    id: 'emotional',
    title: 'Emotional Recitations',
    icon: 'sentiment-satisfied',
    videos: [
      {
        id: 'r11',
        title: 'Surah Maryam',
        duration: '16:40',
        thumbnail: 'https://img.youtube.com/vi/I206g-594xo/mqdefault.jpg',
        speaker: 'Abdul Rahman Al-Sudais',
        youtubeId: 'I206g-594xo',
      },
      {
        id: 'r12',
        title: 'Surah Yusuf',
        duration: '28:30',
        thumbnail: 'https://img.youtube.com/vi/aZb7f9ln1K8/mqdefault.jpg',
        speaker: 'Mishary Rashid Alafasy',
        youtubeId: 'aZb7f9ln1K8',
      },
    ],
  },
];
