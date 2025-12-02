
export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'prayers' | 'dhikr' | 'quran' | 'learning' | 'dawah' | 'wellness' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: 'weekly';
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
      id: 'weekly-dhikr-2000',
      title: 'Dhikr Champion',
      description: 'Complete 2000 dhikr counts this week',
      icon: 'beads',
      category: 'dhikr',
      difficulty: 'medium',
      duration: 'weekly',
      requirement: { type: 'count', value: 2000, metric: 'dhikr' },
      reward: { points: 140 },
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
