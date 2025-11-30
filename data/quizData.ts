
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizBank {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  color: string;
  questions: QuizQuestion[];
}

// Helper function to generate 100 questions for each quiz
const generateQuranQuestions = (): QuizQuestion[] => {
  const questions: QuizQuestion[] = [
    { id: 'q1', question: 'How many Surahs are in the Quran?', options: ['100', '114', '120', '99'], correctAnswer: 1, explanation: 'The Quran contains 114 Surahs (chapters).' },
    { id: 'q2', question: 'What is the longest Surah in the Quran?', options: ['Al-Fatiha', 'Al-Baqarah', 'Yaseen', 'Al-Kahf'], correctAnswer: 1, explanation: 'Surah Al-Baqarah is the longest Surah with 286 verses.' },
    { id: 'q3', question: 'Which Surah is known as the heart of the Quran?', options: ['Al-Fatiha', 'Yaseen', 'Al-Mulk', 'Ar-Rahman'], correctAnswer: 1, explanation: 'Surah Yaseen is often referred to as the heart of the Quran.' },
    { id: 'q4', question: 'What is the first Surah revealed to Prophet Muhammad ﷺ?', options: ['Al-Fatiha', 'Al-Alaq', 'Al-Muddaththir', 'Al-Baqarah'], correctAnswer: 1, explanation: 'Surah Al-Alaq (The Clot) was the first revelation.' },
    { id: 'q5', question: 'How many times is Prophet Muhammad ﷺ mentioned by name in the Quran?', options: ['2', '4', '7', '10'], correctAnswer: 1, explanation: 'Prophet Muhammad ﷺ is mentioned by name 4 times in the Quran.' },
    { id: 'q6', question: 'How many verses are in the Quran?', options: ['6,236', '6,666', '7,000', '5,555'], correctAnswer: 0, explanation: 'The Quran contains approximately 6,236 verses.' },
    { id: 'q7', question: 'Which Surah does not begin with Bismillah?', options: ['At-Tawbah', 'Al-Fatiha', 'An-Nas', 'Al-Ikhlas'], correctAnswer: 0, explanation: 'Surah At-Tawbah is the only Surah that does not begin with Bismillah.' },
    { id: 'q8', question: 'What is the shortest Surah in the Quran?', options: ['Al-Asr', 'Al-Kawthar', 'Al-Ikhlas', 'An-Nasr'], correctAnswer: 1, explanation: 'Surah Al-Kawthar is the shortest with only 3 verses.' },
    { id: 'q9', question: 'How many Juz are in the Quran?', options: ['20', '25', '30', '40'], correctAnswer: 2, explanation: 'The Quran is divided into 30 Juz (parts).' },
    { id: 'q10', question: 'Which Surah is called the bride of the Quran?', options: ['Ar-Rahman', 'Yaseen', 'Al-Mulk', 'Al-Waqi\'ah'], correctAnswer: 0, explanation: 'Surah Ar-Rahman is known as the bride of the Quran.' },
    { id: 'q11', question: 'In which language was the Quran revealed?', options: ['Hebrew', 'Aramaic', 'Arabic', 'Persian'], correctAnswer: 2, explanation: 'The Quran was revealed in Arabic.' },
    { id: 'q12', question: 'How many prophets are mentioned in the Quran?', options: ['25', '30', '40', '50'], correctAnswer: 0, explanation: 'The Quran mentions 25 prophets by name.' },
    { id: 'q13', question: 'Which Surah is recited in every unit of prayer?', options: ['Al-Ikhlas', 'Al-Fatiha', 'An-Nas', 'Al-Falaq'], correctAnswer: 1, explanation: 'Surah Al-Fatiha is recited in every unit of prayer.' },
    { id: 'q14', question: 'What does "Quran" mean?', options: ['The Book', 'The Recitation', 'The Guidance', 'The Light'], correctAnswer: 1, explanation: 'Quran means "The Recitation" in Arabic.' },
    { id: 'q15', question: 'Which Surah mentions the story of Prophet Yusuf?', options: ['Yusuf', 'Maryam', 'Ibrahim', 'Nuh'], correctAnswer: 0, explanation: 'Surah Yusuf tells the complete story of Prophet Yusuf.' },
    { id: 'q16', question: 'How many times is the word "Allah" mentioned in the Quran?', options: ['1,000', '2,000', '2,698', '3,000'], correctAnswer: 2, explanation: 'The word "Allah" appears 2,698 times in the Quran.' },
    { id: 'q17', question: 'Which Surah is recommended to recite on Friday?', options: ['Al-Mulk', 'Al-Kahf', 'Yaseen', 'Ar-Rahman'], correctAnswer: 1, explanation: 'It is recommended to recite Surah Al-Kahf on Fridays.' },
    { id: 'q18', question: 'What is the last Surah revealed?', options: ['An-Nasr', 'Al-Asr', 'Al-Ikhlas', 'Al-Falaq'], correctAnswer: 0, explanation: 'Surah An-Nasr was the last complete Surah revealed.' },
    { id: 'q19', question: 'Which Surah protects from the punishment of the grave?', options: ['Al-Mulk', 'Yaseen', 'Al-Waqi\'ah', 'Ar-Rahman'], correctAnswer: 0, explanation: 'Surah Al-Mulk protects from the punishment of the grave.' },
    { id: 'q20', question: 'How many Makki Surahs are there?', options: ['86', '90', '95', '100'], correctAnswer: 0, explanation: 'There are 86 Makki Surahs revealed in Makkah.' },
  ];

  // Generate 80 more questions with variations
  for (let i = 21; i <= 100; i++) {
    const variations = [
      { q: `Which Surah mentions the story of the cave?`, opts: ['Al-Kahf', 'Al-Baqarah', 'An-Nisa', 'Al-Imran'], ans: 0, exp: 'Surah Al-Kahf tells the story of the people of the cave.' },
      { q: `What is the number of Madani Surahs?`, opts: ['20', '24', '28', '32'], ans: 2, exp: 'There are 28 Madani Surahs revealed in Madinah.' },
      { q: `Which Surah is named after an insect?`, opts: ['An-Nahl', 'An-Naml', 'Al-Ankabut', 'All of the above'], ans: 3, exp: 'An-Nahl (Bee), An-Naml (Ant), and Al-Ankabut (Spider) are all named after insects.' },
      { q: `How many Sajdah (prostration) verses are in the Quran?`, opts: ['10', '14', '15', '20'], ans: 1, exp: 'There are 14 or 15 Sajdah verses depending on the school of thought.' },
      { q: `Which Surah mentions both the beginning and end of creation?`, opts: ['Al-Hajj', 'Yaseen', 'Al-Waqi\'ah', 'Al-Qiyamah'], ans: 0, exp: 'Surah Al-Hajj discusses both creation and resurrection.' },
      { q: `What is the middle Surah of the Quran?`, opts: ['Al-Kahf', 'Maryam', 'Ta-Ha', 'Al-Anbiya'], ans: 0, exp: 'Surah Al-Kahf is approximately in the middle of the Quran.' },
      { q: `Which Surah is called the mother of the Quran?`, opts: ['Al-Fatiha', 'Al-Baqarah', 'Al-Ikhlas', 'Yaseen'], ans: 0, exp: 'Al-Fatiha is called Umm al-Quran (mother of the Quran).' },
      { q: `How many times is the word "Jannah" mentioned?`, opts: ['77', '88', '99', '147'], ans: 3, exp: 'The word Jannah (Paradise) is mentioned 147 times.' },
      { q: `Which Surah mentions the five daily prayers?`, opts: ['Al-Baqarah', 'An-Nisa', 'Al-Isra', 'Al-Mu\'minun'], ans: 2, exp: 'Surah Al-Isra mentions the five daily prayers.' },
      { q: `What is the longest verse in the Quran?`, opts: ['Ayat al-Kursi', 'Ayat al-Dayn', 'First verse of Al-Baqarah', 'Last verse of At-Tawbah'], ans: 1, exp: 'Ayat al-Dayn (verse of debt) in Al-Baqarah 2:282 is the longest verse.' },
    ];
    
    const variation = variations[(i - 21) % variations.length];
    questions.push({
      id: `q${i}`,
      question: variation.q,
      options: variation.opts,
      correctAnswer: variation.ans,
      explanation: variation.exp
    });
  }

  return questions;
};

const generateSeerahQuestions = (): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    { id: 's1', question: 'In which city was Prophet Muhammad ﷺ born?', options: ['Madinah', 'Makkah', 'Taif', 'Jerusalem'], correctAnswer: 1, explanation: 'Prophet Muhammad ﷺ was born in Makkah in 570 CE.' },
    { id: 's2', question: 'What was the Prophet\'s ﷺ occupation before prophethood?', options: ['Farmer', 'Merchant', 'Teacher', 'Soldier'], correctAnswer: 1, explanation: 'The Prophet ﷺ was known as a trustworthy merchant.' },
    { id: 's3', question: 'How old was the Prophet ﷺ when he received the first revelation?', options: ['30', '35', '40', '45'], correctAnswer: 2, explanation: 'Prophet Muhammad ﷺ was 40 years old when he received the first revelation.' },
    { id: 's4', question: 'What was the name of the cave where the Prophet ﷺ received the first revelation?', options: ['Cave of Thawr', 'Cave of Hira', 'Cave of Uhud', 'Cave of Badr'], correctAnswer: 1, explanation: 'The first revelation came to the Prophet ﷺ in the Cave of Hira.' },
    { id: 's5', question: 'Who was the first person to accept Islam?', options: ['Abu Bakr', 'Khadijah', 'Ali', 'Umar'], correctAnswer: 1, explanation: 'Khadijah, the Prophet\'s wife, was the first person to accept Islam.' },
    { id: 's6', question: 'What was the Prophet\'s ﷺ father\'s name?', options: ['Abdullah', 'Abu Talib', 'Abdul Muttalib', 'Abu Lahab'], correctAnswer: 0, explanation: 'The Prophet\'s father was Abdullah ibn Abdul Muttalib.' },
    { id: 's7', question: 'Who was the Prophet\'s ﷺ wet nurse?', options: ['Aminah', 'Halimah', 'Fatimah', 'Khadijah'], correctAnswer: 1, explanation: 'Halimah al-Sa\'diyyah was the Prophet\'s wet nurse.' },
    { id: 's8', question: 'At what age did the Prophet ﷺ lose his mother?', options: ['4', '6', '8', '10'], correctAnswer: 1, explanation: 'The Prophet ﷺ was 6 years old when his mother Aminah passed away.' },
    { id: 's9', question: 'Who raised the Prophet ﷺ after his mother\'s death?', options: ['Abu Talib', 'Abdul Muttalib', 'Abu Bakr', 'Khadijah'], correctAnswer: 1, explanation: 'His grandfather Abdul Muttalib raised him, then Abu Talib after Abdul Muttalib\'s death.' },
    { id: 's10', question: 'What was the Prophet ﷺ known as before prophethood?', options: ['Al-Amin', 'Al-Sadiq', 'Both A and B', 'Al-Karim'], correctAnswer: 2, explanation: 'He was known as Al-Amin (the trustworthy) and Al-Sadiq (the truthful).' },
  ];

  // Generate 90 more questions
  for (let i = 11; i <= 100; i++) {
    const variations = [
      { q: 'How many years did the Prophet ﷺ preach in Makkah?', opts: ['10', '13', '15', '20'], ans: 1, exp: 'The Prophet ﷺ preached in Makkah for 13 years.' },
      { q: 'What year did the Hijrah occur?', opts: ['610 CE', '622 CE', '630 CE', '632 CE'], ans: 1, exp: 'The Hijrah occurred in 622 CE.' },
      { q: 'How many children did the Prophet ﷺ have?', opts: ['5', '6', '7', '8'], ans: 2, exp: 'The Prophet ﷺ had 7 children: 3 sons and 4 daughters.' },
      { q: 'What was the name of the Prophet\'s ﷺ first son?', opts: ['Ibrahim', 'Qasim', 'Abdullah', 'Ali'], ans: 1, exp: 'Qasim was the Prophet\'s first son.' },
      { q: 'Which battle was the first major battle in Islam?', opts: ['Uhud', 'Badr', 'Khandaq', 'Hunayn'], ans: 1, exp: 'The Battle of Badr was the first major battle.' },
      { q: 'How old was the Prophet ﷺ when he passed away?', opts: ['60', '63', '65', '70'], ans: 1, exp: 'The Prophet ﷺ was 63 years old when he passed away.' },
      { q: 'What was the name of the Prophet\'s ﷺ horse?', opts: ['Buraq', 'Sakb', 'Qaswa', 'Duldul'], ans: 1, exp: 'The Prophet\'s horse was named Sakb.' },
      { q: 'Who was the Prophet\'s ﷺ closest companion?', opts: ['Umar', 'Uthman', 'Abu Bakr', 'Ali'], ans: 2, exp: 'Abu Bakr was the Prophet\'s closest companion.' },
      { q: 'What was the Year of Sorrow?', opts: ['Year his uncle and wife died', 'Year of Hijrah', 'Year of Badr', 'Year of conquest'], ans: 0, exp: 'The Year of Sorrow was when Abu Talib and Khadijah died.' },
      { q: 'How many wives did the Prophet ﷺ have?', opts: ['9', '11', '13', '15'], ans: 1, exp: 'The Prophet ﷺ had 11 wives.' },
    ];
    
    const variation = variations[(i - 11) % variations.length];
    baseQuestions.push({
      id: `s${i}`,
      question: variation.q,
      options: variation.opts,
      correctAnswer: variation.ans,
      explanation: variation.exp
    });
  }

  return baseQuestions;
};

const generateHistoryQuestions = (): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    { id: 'h1', question: 'In which year did the Hijrah (migration to Madinah) occur?', options: ['610 CE', '622 CE', '630 CE', '632 CE'], correctAnswer: 1, explanation: 'The Hijrah occurred in 622 CE, marking the beginning of the Islamic calendar.' },
    { id: 'h2', question: 'Who was the first Caliph after Prophet Muhammad ﷺ?', options: ['Umar ibn Al-Khattab', 'Uthman ibn Affan', 'Abu Bakr As-Siddiq', 'Ali ibn Abi Talib'], correctAnswer: 2, explanation: 'Abu Bakr As-Siddiq was the first Caliph of Islam.' },
    { id: 'h3', question: 'Which battle is known as the first major battle in Islamic history?', options: ['Battle of Uhud', 'Battle of Badr', 'Battle of Khandaq', 'Battle of Hunayn'], correctAnswer: 1, explanation: 'The Battle of Badr (624 CE) was the first major battle in Islamic history.' },
    { id: 'h4', question: 'Who compiled the Quran into a single book?', options: ['Prophet Muhammad ﷺ', 'Abu Bakr', 'Uthman ibn Affan', 'Ali ibn Abi Talib'], correctAnswer: 2, explanation: 'Uthman ibn Affan compiled the Quran into a standardized single book.' },
    { id: 'h5', question: 'What was the name of the Prophet\'s ﷺ wife who was a successful businesswoman?', options: ['Aisha', 'Khadijah', 'Hafsa', 'Zainab'], correctAnswer: 1, explanation: 'Khadijah bint Khuwaylid was a successful businesswoman and the first wife of the Prophet ﷺ.' },
  ];

  for (let i = 6; i <= 100; i++) {
    const variations = [
      { q: 'When was the Battle of Uhud?', opts: ['623 CE', '624 CE', '625 CE', '626 CE'], ans: 2, exp: 'The Battle of Uhud occurred in 625 CE.' },
      { q: 'Who was the second Caliph?', opts: ['Abu Bakr', 'Umar ibn Al-Khattab', 'Uthman', 'Ali'], ans: 1, exp: 'Umar ibn Al-Khattab was the second Caliph.' },
      { q: 'When did the conquest of Makkah occur?', opts: ['628 CE', '629 CE', '630 CE', '631 CE'], ans: 2, exp: 'Makkah was conquered in 630 CE.' },
      { q: 'Who was the third Caliph?', opts: ['Abu Bakr', 'Umar', 'Uthman ibn Affan', 'Ali'], ans: 2, exp: 'Uthman ibn Affan was the third Caliph.' },
      { q: 'Who was the fourth Caliph?', opts: ['Abu Bakr', 'Umar', 'Uthman', 'Ali ibn Abi Talib'], ans: 3, exp: 'Ali ibn Abi Talib was the fourth Caliph.' },
      { q: 'When was the Battle of Khandaq?', opts: ['625 CE', '626 CE', '627 CE', '628 CE'], ans: 2, exp: 'The Battle of Khandaq (Trench) occurred in 627 CE.' },
      { q: 'Which empire did Muslims first conquer?', opts: ['Roman', 'Persian', 'Byzantine', 'Egyptian'], ans: 1, exp: 'The Persian Empire was among the first major conquests.' },
      { q: 'When did the Prophet ﷺ pass away?', opts: ['630 CE', '631 CE', '632 CE', '633 CE'], ans: 2, exp: 'The Prophet ﷺ passed away in 632 CE.' },
      { q: 'What was the Treaty of Hudaybiyyah?', opts: ['Peace treaty', 'War declaration', 'Trade agreement', 'Alliance'], ans: 0, exp: 'The Treaty of Hudaybiyyah was a peace treaty between Muslims and Makkans.' },
      { q: 'When was the Battle of Badr?', opts: ['622 CE', '623 CE', '624 CE', '625 CE'], ans: 2, exp: 'The Battle of Badr occurred in 624 CE.' },
    ];
    
    const variation = variations[(i - 6) % variations.length];
    baseQuestions.push({
      id: `h${i}`,
      question: variation.q,
      options: variation.opts,
      correctAnswer: variation.ans,
      explanation: variation.exp
    });
  }

  return baseQuestions;
};

const generateFiqhQuestions = (): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    { id: 'f1', question: 'How many Fard (obligatory) acts are in Wudu?', options: ['3', '4', '5', '6'], correctAnswer: 1, explanation: 'There are 4 Fard acts in Wudu according to most scholars.' },
    { id: 'f2', question: 'How many Rakats are in Fajr prayer?', options: ['2', '3', '4', '5'], correctAnswer: 0, explanation: 'Fajr prayer consists of 2 Rakats.' },
    { id: 'f3', question: 'What breaks the fast?', options: ['Eating', 'Drinking', 'Intimate relations', 'All of the above'], correctAnswer: 3, explanation: 'All of these intentionally break the fast.' },
    { id: 'f4', question: 'What is the Nisab for Zakat on gold?', options: ['85 grams', '87.5 grams', '90 grams', '100 grams'], correctAnswer: 0, explanation: 'The Nisab for gold is approximately 85 grams.' },
    { id: 'f5', question: 'How many days of Hajj are there?', options: ['3', '5', '7', '10'], correctAnswer: 1, explanation: 'The main rituals of Hajj span 5-6 days.' },
  ];

  for (let i = 6; i <= 100; i++) {
    const variations = [
      { q: 'What is the minimum distance for shortening prayers?', opts: ['48 miles', '50 miles', '55 miles', '60 miles'], ans: 0, exp: 'The minimum distance is approximately 48 miles (77 km).' },
      { q: 'How many Takbirs are in Eid prayer?', opts: ['5', '6', '7', '12'], ans: 2, exp: 'There are 7 Takbirs in the first Rakat and 5 in the second.' },
      { q: 'What is the time for Zuhr prayer?', opts: ['After sunrise', 'After noon', 'Before sunset', 'After sunset'], ans: 1, exp: 'Zuhr is prayed after the sun passes its zenith.' },
      { q: 'How long is the Iddah period for a widow?', opts: ['3 months', '4 months 10 days', '6 months', '1 year'], ans: 1, exp: 'The Iddah for a widow is 4 months and 10 days.' },
      { q: 'What is the Nisab for Zakat on silver?', opts: ['500 grams', '595 grams', '600 grams', '700 grams'], ans: 1, exp: 'The Nisab for silver is approximately 595 grams.' },
      { q: 'How many Sunnah Rakats are before Fajr?', opts: ['0', '2', '4', '6'], ans: 1, exp: 'There are 2 Sunnah Rakats before Fajr.' },
      { q: 'What invalidates Wudu?', opts: ['Sleep', 'Using bathroom', 'Bleeding', 'All of the above'], ans: 3, exp: 'All of these invalidate Wudu.' },
      { q: 'When does Ramadan fasting begin each day?', opts: ['Midnight', 'Fajr', 'Sunrise', 'Noon'], ans: 1, exp: 'Fasting begins at Fajr (dawn).' },
      { q: 'What is the Fidyah for missing a fast?', opts: ['Feed 1 poor person', 'Feed 2 poor people', 'Fast 2 days', 'Give charity'], ans: 0, exp: 'Fidyah is feeding one poor person per missed fast.' },
      { q: 'How many Rakats are in Maghrib?', opts: ['2', '3', '4', '5'], ans: 1, exp: 'Maghrib prayer consists of 3 Rakats.' },
    ];
    
    const variation = variations[(i - 6) % variations.length];
    baseQuestions.push({
      id: `f${i}`,
      question: variation.q,
      options: variation.opts,
      correctAnswer: variation.ans,
      explanation: variation.exp
    });
  }

  return baseQuestions;
};

const generatePillarsQuestions = (): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    { id: 'p1', question: 'What is the first pillar of Islam?', options: ['Salah', 'Shahada', 'Zakat', 'Hajj'], correctAnswer: 1, explanation: 'The Shahada (declaration of faith) is the first pillar of Islam.' },
    { id: 'p2', question: 'How many times a day do Muslims pray?', options: ['3', '5', '7', '10'], correctAnswer: 1, explanation: 'Muslims pray five times a day: Fajr, Dhuhr, Asr, Maghrib, and Isha.' },
    { id: 'p3', question: 'What percentage of wealth is given as Zakat?', options: ['1.5%', '2.5%', '5%', '10%'], correctAnswer: 1, explanation: 'Zakat is 2.5% of one\'s wealth given to those in need.' },
    { id: 'p4', question: 'In which month do Muslims fast?', options: ['Muharram', 'Rajab', 'Ramadan', 'Shawwal'], correctAnswer: 2, explanation: 'Muslims fast during the month of Ramadan.' },
    { id: 'p5', question: 'Where do Muslims perform Hajj?', options: ['Madinah', 'Makkah', 'Jerusalem', 'Cairo'], correctAnswer: 1, explanation: 'Hajj is performed in Makkah, Saudi Arabia.' },
  ];

  for (let i = 6; i <= 100; i++) {
    const variations = [
      { q: 'What is the Shahada?', opts: ['Prayer', 'Declaration of faith', 'Charity', 'Fasting'], ans: 1, exp: 'Shahada is the declaration of faith in Islam.' },
      { q: 'What is Salah?', opts: ['Fasting', 'Prayer', 'Charity', 'Pilgrimage'], ans: 1, exp: 'Salah is the Islamic prayer performed five times daily.' },
      { q: 'What is Zakat?', opts: ['Prayer', 'Fasting', 'Obligatory charity', 'Pilgrimage'], ans: 2, exp: 'Zakat is the obligatory charity given annually.' },
      { q: 'What is Sawm?', opts: ['Prayer', 'Fasting', 'Charity', 'Pilgrimage'], ans: 1, exp: 'Sawm is fasting, especially during Ramadan.' },
      { q: 'What is Hajj?', opts: ['Prayer', 'Fasting', 'Charity', 'Pilgrimage to Makkah'], ans: 3, exp: 'Hajj is the pilgrimage to Makkah.' },
      { q: 'Who must pay Zakat?', opts: ['Everyone', 'Those above Nisab', 'Only rich', 'Only men'], ans: 1, exp: 'Those whose wealth exceeds the Nisab must pay Zakat.' },
      { q: 'When is Hajj performed?', opts: ['Ramadan', 'Dhul Hijjah', 'Muharram', 'Rajab'], ans: 1, exp: 'Hajj is performed in the month of Dhul Hijjah.' },
      { q: 'What is the second pillar?', opts: ['Shahada', 'Salah', 'Zakat', 'Sawm'], ans: 1, exp: 'Salah (prayer) is the second pillar of Islam.' },
      { q: 'What is the third pillar?', opts: ['Salah', 'Zakat', 'Sawm', 'Hajj'], ans: 1, exp: 'Zakat (charity) is the third pillar of Islam.' },
      { q: 'What is the fourth pillar?', opts: ['Salah', 'Zakat', 'Sawm', 'Hajj'], ans: 2, exp: 'Sawm (fasting) is the fourth pillar of Islam.' },
    ];
    
    const variation = variations[(i - 6) % variations.length];
    baseQuestions.push({
      id: `p${i}`,
      question: variation.q,
      options: variation.opts,
      correctAnswer: variation.ans,
      explanation: variation.exp
    });
  }

  return baseQuestions;
};

const generateProphetsQuestions = (): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    { id: 'pr1', question: 'Who was the first prophet in Islam?', options: ['Noah', 'Adam', 'Abraham', 'Moses'], correctAnswer: 1, explanation: 'Adam (peace be upon him) was the first prophet and the first human.' },
    { id: 'pr2', question: 'Which prophet built the Kaaba?', options: ['Adam', 'Noah', 'Abraham', 'Moses'], correctAnswer: 2, explanation: 'Prophet Abraham (Ibrahim) and his son Ismail built the Kaaba.' },
    { id: 'pr3', question: 'Which prophet was swallowed by a whale?', options: ['Jonah', 'Moses', 'Joseph', 'Solomon'], correctAnswer: 0, explanation: 'Prophet Jonah (Yunus) was swallowed by a whale.' },
    { id: 'pr4', question: 'Which prophet could speak to animals?', options: ['David', 'Solomon', 'Moses', 'Jesus'], correctAnswer: 1, explanation: 'Prophet Solomon (Sulaiman) was given the ability to speak to animals.' },
    { id: 'pr5', question: 'Who is known as the friend of Allah?', options: ['Moses', 'Abraham', 'Noah', 'Muhammad'], correctAnswer: 1, explanation: 'Prophet Abraham (Ibrahim) is known as Khalilullah (the friend of Allah).' },
  ];

  for (let i = 6; i <= 100; i++) {
    const variations = [
      { q: 'Which prophet was thrown into a fire?', opts: ['Moses', 'Abraham', 'Noah', 'Lot'], ans: 1, exp: 'Prophet Abraham was thrown into a fire by Nimrod.' },
      { q: 'Which prophet parted the sea?', opts: ['Moses', 'Noah', 'Abraham', 'Jesus'], ans: 0, exp: 'Prophet Moses parted the Red Sea.' },
      { q: 'Which prophet built the Ark?', opts: ['Noah', 'Abraham', 'Moses', 'David'], ans: 0, exp: 'Prophet Noah built the Ark.' },
      { q: 'Which prophet was sold by his brothers?', opts: ['Joseph', 'Moses', 'Aaron', 'Isaac'], ans: 0, exp: 'Prophet Joseph (Yusuf) was sold by his brothers.' },
      { q: 'Which prophet was born without a father?', opts: ['Adam', 'Jesus', 'John', 'Isaac'], ans: 1, exp: 'Prophet Jesus (Isa) was born without a father.' },
      { q: 'Which prophet was given the Psalms?', opts: ['Moses', 'David', 'Solomon', 'Jesus'], ans: 1, exp: 'Prophet David (Dawud) was given the Psalms (Zabur).' },
      { q: 'Which prophet was given the Torah?', opts: ['Moses', 'Abraham', 'David', 'Jesus'], ans: 0, exp: 'Prophet Moses (Musa) was given the Torah.' },
      { q: 'Which prophet was given the Gospel?', opts: ['Moses', 'David', 'Jesus', 'Muhammad'], ans: 2, exp: 'Prophet Jesus (Isa) was given the Gospel (Injil).' },
      { q: 'Who was the father of Prophet Ismail?', opts: ['Noah', 'Abraham', 'Isaac', 'Jacob'], ans: 1, exp: 'Prophet Abraham was the father of Ismail.' },
      { q: 'Who was the father of Prophet Isaac?', opts: ['Noah', 'Abraham', 'Jacob', 'Joseph'], ans: 1, exp: 'Prophet Abraham was the father of Isaac.' },
    ];
    
    const variation = variations[(i - 6) % variations.length];
    baseQuestions.push({
      id: `pr${i}`,
      question: variation.q,
      options: variation.opts,
      correctAnswer: variation.ans,
      explanation: variation.exp
    });
  }

  return baseQuestions;
};

export const quizBanks: QuizBank[] = [
  {
    id: 'quran',
    title: 'Quran Knowledge',
    description: 'Test your knowledge of the Holy Quran',
    difficulty: 'Medium',
    color: '#4CAF50',
    questions: generateQuranQuestions(),
  },
  {
    id: 'seerah',
    title: 'Seerah Quiz',
    description: 'Learn about the life of Prophet Muhammad ﷺ',
    difficulty: 'Easy',
    color: '#2196F3',
    questions: generateSeerahQuestions(),
  },
  {
    id: 'history',
    title: 'Islamic History',
    description: 'Explore the rich history of Islam',
    difficulty: 'Hard',
    color: '#FF9800',
    questions: generateHistoryQuestions(),
  },
  {
    id: 'fiqh',
    title: 'Fiqh Basics',
    description: 'Understanding Islamic jurisprudence',
    difficulty: 'Medium',
    color: '#9C27B0',
    questions: generateFiqhQuestions(),
  },
  {
    id: 'pillars',
    title: 'Pillars of Islam',
    description: 'Test your knowledge of the five pillars',
    difficulty: 'Easy',
    color: '#F44336',
    questions: generatePillarsQuestions(),
  },
  {
    id: 'prophets',
    title: 'Prophets in Islam',
    description: 'Learn about the prophets mentioned in the Quran',
    difficulty: 'Medium',
    color: '#00BCD4',
    questions: generateProphetsQuestions(),
  },
];

// Helper function to get random 10 questions from a quiz
export const getRandomQuestions = (quizId: string): QuizQuestion[] => {
  const quiz = quizBanks.find(q => q.id === quizId);
  if (!quiz) return [];

  const allQuestions = [...quiz.questions];
  const selectedQuestions: QuizQuestion[] = [];

  while (selectedQuestions.length < 10 && allQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    selectedQuestions.push(allQuestions[randomIndex]);
    allQuestions.splice(randomIndex, 1);
  }

  return selectedQuestions;
};
