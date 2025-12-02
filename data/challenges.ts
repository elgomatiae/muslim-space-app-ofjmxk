
export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'prayers' | 'dhikr' | 'quran' | 'learning' | 'dawah' | 'wellness' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: 'daily' | 'weekly';
  requirement: {
    type: 'complete' | 'count' | 'streak' | 'time';
    value: number;
    metric: string;
  };
  reward: {
    points: number;
    badge?: string;
  };
  startDate?: string;
  endDate?: string;
  progress: number;
  completed: boolean;
}

export const generateDailyChallenges = (): Challenge[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  const allChallenges: Challenge[] = [
    {
      id: 'daily-prayers-all',
      title: 'Complete All Prayers',
      description: 'Pray all 5 daily prayers on time',
      icon: 'hands-sparkles',
      category: 'prayers',
      difficulty: 'medium',
      duration: 'daily',
      requirement: { type: 'complete', value: 5, metric: 'prayers' },
      reward: { points: 50 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-dhikr-300',
      title: 'Dhikr Master',
      description: 'Complete 300 dhikr counts today',
      icon: 'beads',
      category: 'dhikr',
      difficulty: 'easy',
      duration: 'daily',
      requirement: { type: 'count', value: 300, metric: 'dhikr' },
      reward: { points: 30 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-quran-5-pages',
      title: 'Quran Reader',
      description: 'Read 5 pages of the Quran',
      icon: 'book',
      category: 'quran',
      difficulty: 'medium',
      duration: 'daily',
      requirement: { type: 'count', value: 5, metric: 'quran-pages' },
      reward: { points: 40 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-memorize-3-verses',
      title: 'Verse Memorizer',
      description: 'Memorize 3 verses today',
      icon: 'brain',
      category: 'quran',
      difficulty: 'hard',
      duration: 'daily',
      requirement: { type: 'count', value: 3, metric: 'quran-verses' },
      reward: { points: 60 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-lecture',
      title: 'Knowledge Seeker',
      description: 'Watch 1 Islamic lecture',
      icon: 'video',
      category: 'learning',
      difficulty: 'easy',
      duration: 'daily',
      requirement: { type: 'count', value: 1, metric: 'lectures' },
      reward: { points: 25 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-quiz',
      title: 'Test Your Knowledge',
      description: 'Complete 1 quiz with 80% or higher',
      icon: 'question-circle',
      category: 'learning',
      difficulty: 'medium',
      duration: 'daily',
      requirement: { type: 'count', value: 1, metric: 'quizzes' },
      reward: { points: 35 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-workout',
      title: 'Physical Fitness',
      description: 'Complete a 20-minute workout',
      icon: 'dumbbell',
      category: 'wellness',
      difficulty: 'medium',
      duration: 'daily',
      requirement: { type: 'time', value: 20, metric: 'workout' },
      reward: { points: 30 },
      progress: 0,
      completed: false,
    },
    {
      id: 'daily-fajr-on-time',
      title: 'Early Riser',
      description: 'Pray Fajr on time',
      icon: 'sunrise',
      category: 'prayers',
      difficulty: 'hard',
      duration: 'daily',
      requirement: { type: 'complete', value: 1, metric: 'fajr' },
      reward: { points: 70 },
      progress: 0,
      completed: false,
    },
  ];

  const selectedChallenges: Challenge[] = [];
  const categories = ['prayers', 'dhikr', 'quran', 'learning', 'wellness'];
  
  categories.forEach(category => {
    const categoryChallenge = allChallenges.find(c => c.category === category);
    if (categoryChallenge) {
      selectedChallenges.push(categoryChallenge);
    }
  });

  if (dayOfWeek === 5) {
    selectedChallenges.push(allChallenges.find(c => c.id === 'daily-fajr-on-time')!);
  }

  return selectedChallenges.slice(0, 5);
};

export const generateWeeklyChallenges = (): Challenge[] => {
  return [
    {
      id: 'weekly-prayer-streak',
      title: 'Weekly Prayer Warrior',
      description: 'Complete all 5 prayers every day this week',
      icon: 'trophy',
      category: 'prayers',
      difficulty: 'hard',
      duration: 'weekly',
      requirement: { type: 'streak', value: 7, metric: 'prayers' },
      reward: { points: 200, badge: 'prayer-streak-7' },
      progress: 0,
      completed: false,
    },
    {
      id: 'weekly-quran-35-pages',
      title: 'Weekly Quran Goal',
      description: 'Read 35 pages of Quran this week',
      icon: 'book-open',
      category: 'quran',
      difficulty: 'medium',
      duration: 'weekly',
      requirement: { type: 'count', value: 35, metric: 'quran-pages' },
      reward: { points: 150 },
      progress: 0,
      completed: false,
    },
    {
      id: 'weekly-lectures-5',
      title: 'Knowledge Week',
      description: 'Watch 5 lectures this week',
      icon: 'graduation-cap',
      category: 'learning',
      difficulty: 'medium',
      duration: 'weekly',
      requirement: { type: 'count', value: 5, metric: 'lectures' },
      reward: { points: 120 },
      progress: 0,
      completed: false,
    },
    {
      id: 'weekly-wellness',
      title: 'Fitness Week',
      description: 'Exercise for at least 20 minutes, 5 days this week',
      icon: 'heart',
      category: 'wellness',
      difficulty: 'medium',
      duration: 'weekly',
      requirement: { type: 'count', value: 5, metric: 'workouts' },
      reward: { points: 130 },
      progress: 0,
      completed: false,
    },
  ];
};
