
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: 'quran1',
    title: 'Quran Basics',
    category: 'Quran',
    icon: 'book',
    color: '#3F51B5',
    questions: [
      {
        id: 'q1',
        question: 'How many Surahs are in the Quran?',
        options: ['100', '114', '120', '99'],
        correctAnswer: 1,
        explanation: 'The Quran contains 114 Surahs (chapters).',
      },
      {
        id: 'q2',
        question: 'What is the longest Surah in the Quran?',
        options: ['Al-Fatiha', 'Al-Baqarah', 'Yaseen', 'Al-Kahf'],
        correctAnswer: 1,
        explanation: 'Surah Al-Baqarah is the longest Surah with 286 verses.',
      },
      {
        id: 'q3',
        question: 'Which Surah is known as the heart of the Quran?',
        options: ['Al-Fatiha', 'Yaseen', 'Al-Mulk', 'Ar-Rahman'],
        correctAnswer: 1,
        explanation: 'Surah Yaseen is often referred to as the heart of the Quran.',
      },
      {
        id: 'q4',
        question: 'What is the first Surah revealed to Prophet Muhammad ﷺ?',
        options: ['Al-Fatiha', 'Al-Alaq', 'Al-Muddaththir', 'Al-Baqarah'],
        correctAnswer: 1,
        explanation: 'Surah Al-Alaq (The Clot) was the first revelation.',
      },
      {
        id: 'q5',
        question: 'How many times is Prophet Muhammad ﷺ mentioned by name in the Quran?',
        options: ['2', '4', '7', '10'],
        correctAnswer: 1,
        explanation: 'Prophet Muhammad ﷺ is mentioned by name 4 times in the Quran.',
      },
    ],
  },
  {
    id: 'history1',
    title: 'Islamic History',
    category: 'History',
    icon: 'history',
    color: '#E91E63',
    questions: [
      {
        id: 'h1',
        question: 'In which year did the Hijrah (migration to Madinah) occur?',
        options: ['610 CE', '622 CE', '630 CE', '632 CE'],
        correctAnswer: 1,
        explanation: 'The Hijrah occurred in 622 CE, marking the beginning of the Islamic calendar.',
      },
      {
        id: 'h2',
        question: 'Who was the first Caliph after Prophet Muhammad ﷺ?',
        options: ['Umar ibn Al-Khattab', 'Uthman ibn Affan', 'Abu Bakr As-Siddiq', 'Ali ibn Abi Talib'],
        correctAnswer: 2,
        explanation: 'Abu Bakr As-Siddiq was the first Caliph of Islam.',
      },
      {
        id: 'h3',
        question: 'Which battle is known as the first major battle in Islamic history?',
        options: ['Battle of Uhud', 'Battle of Badr', 'Battle of Khandaq', 'Battle of Hunayn'],
        correctAnswer: 1,
        explanation: 'The Battle of Badr (624 CE) was the first major battle in Islamic history.',
      },
      {
        id: 'h4',
        question: 'Who compiled the Quran into a single book?',
        options: ['Prophet Muhammad ﷺ', 'Abu Bakr', 'Uthman ibn Affan', 'Ali ibn Abi Talib'],
        correctAnswer: 2,
        explanation: 'Uthman ibn Affan compiled the Quran into a standardized single book.',
      },
      {
        id: 'h5',
        question: 'What was the name of the Prophet&apos;s ﷺ wife who was a successful businesswoman?',
        options: ['Aisha', 'Khadijah', 'Hafsa', 'Zainab'],
        correctAnswer: 1,
        explanation: 'Khadijah bint Khuwaylid was a successful businesswoman and the first wife of the Prophet ﷺ.',
      },
    ],
  },
  {
    id: 'seerah1',
    title: 'Life of the Prophet ﷺ',
    category: 'Seerah',
    icon: 'person',
    color: '#03A9F4',
    questions: [
      {
        id: 's1',
        question: 'In which city was Prophet Muhammad ﷺ born?',
        options: ['Madinah', 'Makkah', 'Taif', 'Jerusalem'],
        correctAnswer: 1,
        explanation: 'Prophet Muhammad ﷺ was born in Makkah in 570 CE.',
      },
      {
        id: 's2',
        question: 'What was the Prophet&apos;s ﷺ occupation before prophethood?',
        options: ['Farmer', 'Merchant', 'Teacher', 'Soldier'],
        correctAnswer: 1,
        explanation: 'The Prophet ﷺ was known as a trustworthy merchant.',
      },
      {
        id: 's3',
        question: 'How old was the Prophet ﷺ when he received the first revelation?',
        options: ['30', '35', '40', '45'],
        correctAnswer: 2,
        explanation: 'Prophet Muhammad ﷺ was 40 years old when he received the first revelation.',
      },
      {
        id: 's4',
        question: 'What was the name of the cave where the Prophet ﷺ received the first revelation?',
        options: ['Cave of Thawr', 'Cave of Hira', 'Cave of Uhud', 'Cave of Badr'],
        correctAnswer: 1,
        explanation: 'The first revelation came to the Prophet ﷺ in the Cave of Hira.',
      },
      {
        id: 's5',
        question: 'Who was the first person to accept Islam?',
        options: ['Abu Bakr', 'Khadijah', 'Ali', 'Umar'],
        correctAnswer: 1,
        explanation: 'Khadijah, the Prophet&apos;s wife, was the first person to accept Islam.',
      },
    ],
  },
  {
    id: 'pillars1',
    title: 'Five Pillars of Islam',
    category: 'Pillars',
    icon: 'star',
    color: '#4CAF50',
    questions: [
      {
        id: 'p1',
        question: 'What is the first pillar of Islam?',
        options: ['Salah', 'Shahada', 'Zakat', 'Hajj'],
        correctAnswer: 1,
        explanation: 'The Shahada (declaration of faith) is the first pillar of Islam.',
      },
      {
        id: 'p2',
        question: 'How many times a day do Muslims pray?',
        options: ['3', '5', '7', '10'],
        correctAnswer: 1,
        explanation: 'Muslims pray five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
      },
      {
        id: 'p3',
        question: 'What percentage of wealth is given as Zakat?',
        options: ['1.5%', '2.5%', '5%', '10%'],
        correctAnswer: 1,
        explanation: 'Zakat is 2.5% of one&apos;s wealth given to those in need.',
      },
      {
        id: 'p4',
        question: 'In which month do Muslims fast?',
        options: ['Muharram', 'Rajab', 'Ramadan', 'Shawwal'],
        correctAnswer: 2,
        explanation: 'Muslims fast during the month of Ramadan.',
      },
      {
        id: 'p5',
        question: 'Where do Muslims perform Hajj?',
        options: ['Madinah', 'Makkah', 'Jerusalem', 'Cairo'],
        correctAnswer: 1,
        explanation: 'Hajj is performed in Makkah, Saudi Arabia.',
      },
    ],
  },
  {
    id: 'prophets1',
    title: 'Prophets in Islam',
    category: 'Prophets',
    icon: 'people',
    color: '#FF9800',
    questions: [
      {
        id: 'pr1',
        question: 'Who was the first prophet in Islam?',
        options: ['Noah', 'Adam', 'Abraham', 'Moses'],
        correctAnswer: 1,
        explanation: 'Adam (peace be upon him) was the first prophet and the first human.',
      },
      {
        id: 'pr2',
        question: 'Which prophet built the Kaaba?',
        options: ['Adam', 'Noah', 'Abraham', 'Moses'],
        correctAnswer: 2,
        explanation: 'Prophet Abraham (Ibrahim) and his son Ismail built the Kaaba.',
      },
      {
        id: 'pr3',
        question: 'Which prophet was swallowed by a whale?',
        options: ['Jonah', 'Moses', 'Joseph', 'Solomon'],
        correctAnswer: 0,
        explanation: 'Prophet Jonah (Yunus) was swallowed by a whale.',
      },
      {
        id: 'pr4',
        question: 'Which prophet could speak to animals?',
        options: ['David', 'Solomon', 'Moses', 'Jesus'],
        correctAnswer: 1,
        explanation: 'Prophet Solomon (Sulaiman) was given the ability to speak to animals.',
      },
      {
        id: 'pr5',
        question: 'Who is known as the friend of Allah?',
        options: ['Moses', 'Abraham', 'Noah', 'Muhammad'],
        correctAnswer: 1,
        explanation: 'Prophet Abraham (Ibrahim) is known as Khalilullah (the friend of Allah).',
      },
    ],
  },
];
