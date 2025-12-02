
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, ImageBackground, Modal, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'mental' | 'physical';
type EmotionType = 'anxious' | 'sad' | 'angry' | 'stressed' | 'grateful' | 'hopeful';

interface WaterTracker {
  date: string;
  glasses: number;
}

interface WorkoutTracker {
  date: string;
  workouts: string[];
  totalMinutes: number;
}

interface CardioTracker {
  date: string;
  minutes: number;
  activities: string[];
}

interface GratitudeEntry {
  id: string;
  entry_date: string;
  entry_text: string;
  prompt_used: string | null;
  created_at: string;
}

interface WorkoutStats {
  weeklyMinutes: number;
  weeklyGoal: number;
  streak: number;
}

interface CardioStats {
  weeklyMinutes: number;
  weeklyGoal: number;
  streak: number;
}

const gratitudePrompts = [
  'What made you smile today?',
  'Who are you grateful for and why?',
  'What blessing from Allah are you most thankful for today?',
  'What challenge helped you grow today?',
  'What act of kindness did you witness or receive?',
  'What aspect of your health are you grateful for?',
  'What opportunity are you thankful for?',
  'What lesson did you learn today?',
  'What comfort or ease did Allah provide you today?',
  'What relationship are you grateful for?',
  'What ability or skill are you thankful to have?',
  'What moment of peace did you experience today?',
];

const workoutTypes = [
  { name: 'Strength Training', icon: 'dumbbell', duration: 30 },
  { name: 'Bodyweight', icon: 'figure-strengthtraining-traditional', duration: 20 },
  { name: 'Yoga', icon: 'figure-yoga', duration: 30 },
  { name: 'Stretching', icon: 'figure-flexibility', duration: 15 },
];

const cardioTypes = [
  { name: 'Running', icon: 'figure-run', duration: 30 },
  { name: 'Walking', icon: 'figure-walk', duration: 30 },
  { name: 'Cycling', icon: 'bicycle', duration: 45 },
  { name: 'Swimming', icon: 'figure-pool-swim', duration: 30 },
];

export default function WellnessScreen() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabType>('mental');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showProphetStory, setShowProphetStory] = useState(false);
  const [showJournalHistory, setShowJournalHistory] = useState(false);
  const [journalEntries, setJournalEntries] = useState<GratitudeEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Physical trackers
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [workoutMinutes, setWorkoutMinutes] = useState(0);
  const [cardioMinutes, setCardioMinutes] = useState(0);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showCardioModal, setShowCardioModal] = useState(false);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({ weeklyMinutes: 0, weeklyGoal: 150, streak: 0 });
  const [cardioStats, setCardioStats] = useState<CardioStats>({ weeklyMinutes: 0, weeklyGoal: 150, streak: 0 });

  useEffect(() => {
    loadDailyProgress();
    loadTodayJournalEntry();
    generateRandomPrompt();
    loadWeeklyStats();
  }, []);

  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * gratitudePrompts.length);
    setCurrentPrompt(gratitudePrompts[randomIndex]);
  };

  const loadTodayJournalEntry = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (user && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('gratitude_journal')
          .select('*')
          .eq('user_id', user.id)
          .eq('entry_date', today)
          .single();

        if (data && !error) {
          setJournalEntry(data.entry_text);
          if (data.prompt_used) {
            setCurrentPrompt(data.prompt_used);
          }
        }
      } catch (error) {
        console.log('Error loading journal entry:', error);
      }
    } else {
      // Load from local storage if not logged in
      const savedEntry = await AsyncStorage.getItem(`@journal_${today}`);
      if (savedEntry) {
        setJournalEntry(savedEntry);
      }
    }
  };

  const saveJournalEntry = async () => {
    if (!journalEntry.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    setIsSaving(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      if (user && isSupabaseConfigured()) {
        const { error } = await supabase
          .from('gratitude_journal')
          .upsert({
            user_id: user.id,
            entry_date: today,
            entry_text: journalEntry,
            prompt_used: currentPrompt,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,entry_date'
          });

        if (error) {
          console.error('Error saving journal entry:', error);
          Alert.alert('Error', 'Failed to save your entry. Please try again.');
        } else {
          Alert.alert('Saved!', 'Your gratitude entry has been saved.');
        }
      } else {
        // Save to local storage if not logged in
        await AsyncStorage.setItem(`@journal_${today}`, journalEntry);
        Alert.alert('Saved!', 'Your gratitude entry has been saved locally.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadJournalHistory = async () => {
    if (!user || !isSupabaseConfigured()) {
      Alert.alert('Sign In Required', 'Please sign in to view your journal history.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gratitude_journal')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error loading journal history:', error);
        Alert.alert('Error', 'Failed to load journal history.');
      } else {
        setJournalEntries(data || []);
        setShowJournalHistory(true);
      }
    } catch (error) {
      console.error('Error loading journal history:', error);
      Alert.alert('Error', 'Failed to load journal history.');
    }
  };

  const loadDailyProgress = async () => {
    try {
      const today = new Date().toDateString();
      const waterData = await AsyncStorage.getItem('waterTracker');
      const workoutData = await AsyncStorage.getItem('workoutTracker');
      const cardioData = await AsyncStorage.getItem('cardioTracker');

      if (waterData) {
        const parsed: WaterTracker = JSON.parse(waterData);
        if (parsed.date === today) {
          setWaterGlasses(parsed.glasses);
        }
      }

      if (workoutData) {
        const parsed: WorkoutTracker = JSON.parse(workoutData);
        if (parsed.date === today) {
          setWorkoutMinutes(parsed.totalMinutes);
        }
      }

      if (cardioData) {
        const parsed: CardioTracker = JSON.parse(cardioData);
        if (parsed.date === today) {
          setCardioMinutes(parsed.minutes);
        }
      }
    } catch (error) {
      console.error('Error loading daily progress:', error);
    }
  };

  const loadWeeklyStats = async () => {
    try {
      // Calculate weekly workout minutes
      const workoutData = await AsyncStorage.getItem('workoutTracker');
      const cardioData = await AsyncStorage.getItem('cardioTracker');
      
      // For now, use today's data as weekly (you can expand this to track full week)
      if (workoutData) {
        const parsed: WorkoutTracker = JSON.parse(workoutData);
        setWorkoutStats(prev => ({ ...prev, weeklyMinutes: parsed.totalMinutes }));
      }
      
      if (cardioData) {
        const parsed: CardioTracker = JSON.parse(cardioData);
        setCardioStats(prev => ({ ...prev, weeklyMinutes: parsed.minutes }));
      }
    } catch (error) {
      console.error('Error loading weekly stats:', error);
    }
  };

  const addWaterGlass = async () => {
    const newCount = Math.min(waterGlasses + 1, 8);
    setWaterGlasses(newCount);
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('waterTracker', JSON.stringify({ date: today, glasses: newCount }));
    } catch (error) {
      console.error('Error saving water tracker:', error);
    }
  };

  const removeWaterGlass = async () => {
    const newCount = Math.max(waterGlasses - 1, 0);
    setWaterGlasses(newCount);
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('waterTracker', JSON.stringify({ date: today, glasses: newCount }));
    } catch (error) {
      console.error('Error saving water tracker:', error);
    }
  };

  const addWorkout = async (type: string, minutes: number) => {
    const newMinutes = workoutMinutes + minutes;
    setWorkoutMinutes(newMinutes);
    try {
      const today = new Date().toDateString();
      const workoutData = await AsyncStorage.getItem('workoutTracker');
      let workouts: string[] = [];
      let totalMinutes = 0;
      
      if (workoutData) {
        const parsed: WorkoutTracker = JSON.parse(workoutData);
        if (parsed.date === today) {
          workouts = parsed.workouts;
          totalMinutes = parsed.totalMinutes;
        }
      }
      
      workouts.push(`${type} - ${minutes} min`);
      totalMinutes += minutes;
      
      await AsyncStorage.setItem('workoutTracker', JSON.stringify({ 
        date: today, 
        workouts,
        totalMinutes 
      }));
      
      setWorkoutStats(prev => ({ ...prev, weeklyMinutes: prev.weeklyMinutes + minutes }));
    } catch (error) {
      console.error('Error saving workout tracker:', error);
    }
    setShowWorkoutModal(false);
  };

  const addCardio = async (type: string, minutes: number) => {
    const newMinutes = cardioMinutes + minutes;
    setCardioMinutes(newMinutes);
    try {
      const today = new Date().toDateString();
      const cardioData = await AsyncStorage.getItem('cardioTracker');
      let activities: string[] = [];
      let totalMinutes = 0;
      
      if (cardioData) {
        const parsed: CardioTracker = JSON.parse(cardioData);
        if (parsed.date === today) {
          activities = parsed.activities;
          totalMinutes = parsed.minutes;
        }
      }
      
      activities.push(`${type} - ${minutes} min`);
      totalMinutes += minutes;
      
      await AsyncStorage.setItem('cardioTracker', JSON.stringify({ 
        date: today, 
        minutes: totalMinutes,
        activities 
      }));
      
      setCardioStats(prev => ({ ...prev, weeklyMinutes: prev.weeklyMinutes + minutes }));
    } catch (error) {
      console.error('Error saving cardio tracker:', error);
    }
    setShowCardioModal(false);
  };

  const emotions = [
    { id: 'anxious' as EmotionType, label: 'Anxious', icon: 'exclamationmark.triangle', androidIcon: 'warning', color: '#FF9800' },
    { id: 'sad' as EmotionType, label: 'Sad', icon: 'cloud.rain', androidIcon: 'cloud', color: '#2196F3' },
    { id: 'angry' as EmotionType, label: 'Angry', icon: 'flame', androidIcon: 'local-fire-department', color: '#F44336' },
    { id: 'stressed' as EmotionType, label: 'Stressed', icon: 'bolt', androidIcon: 'flash-on', color: '#9C27B0' },
    { id: 'grateful' as EmotionType, label: 'Grateful', icon: 'heart.fill', androidIcon: 'favorite', color: '#E91E63' },
    { id: 'hopeful' as EmotionType, label: 'Hopeful', icon: 'sun.max', androidIcon: 'wb-sunny', color: '#4CAF50' },
  ];

  const getEmotionContent = (emotion: EmotionType) => {
    const content = {
      anxious: {
        title: 'Dealing with Anxiety',
        verses: [
          {
            arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
            translation: 'Verily, in the remembrance of Allah do hearts find rest.',
            reference: 'Quran 13:28'
          }
        ],
        hadiths: [
          {
            text: 'If any distress befalls a Muslim and he says: "Inna lillahi wa inna ilayhi raji\'un, Allahumma ujurni fi musibati wakhluf li khayran minha (Truly, to Allah we belong and truly, to Him we shall return. O Allah, reward me for my affliction and compensate me with something better)", Allah will compensate him with something better.',
            reference: 'Sahih Muslim 918'
          }
        ],
        tips: [
          'Perform Wudu - it brings calmness',
          'Pray two Rakats of Salat al-Hajah',
          'Recite Ayat al-Kursi',
          'Make Dhikr: "La ilaha illa Allah"',
          'Trust in Allah\'s plan (Tawakkul)'
        ]
      },
      sad: {
        title: 'Overcoming Sadness',
        verses: [
          {
            arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
            translation: 'For indeed, with hardship comes ease.',
            reference: 'Quran 94:5-6'
          }
        ],
        hadiths: [
          {
            text: 'The Prophet ﷺ said: "How wonderful is the affair of the believer, for his affairs are all good. If something good happens to him, he gives thanks for it and that is good for him; if something bad happens to him, he bears it with patience, and that is good for him."',
            reference: 'Sahih Muslim 2999'
          }
        ],
        tips: [
          'Remember that sadness is temporary',
          'Connect with family and friends',
          'Engage in acts of worship',
          'Help others - it brings joy',
          'Reflect on Allah\'s blessings'
        ]
      },
      angry: {
        title: 'Managing Anger',
        verses: [
          {
            arabic: 'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ',
            translation: 'Those who restrain their anger and pardon people - Allah loves the doers of good.',
            reference: 'Quran 3:134'
          }
        ],
        hadiths: [
          {
            text: 'The Prophet ﷺ said: "The strong person is not the one who can overpower others, rather the strong person is the one who controls himself when he is angry."',
            reference: 'Sahih al-Bukhari 6114'
          },
          {
            text: 'A man said to the Prophet ﷺ: "Advise me." He said: "Do not get angry." The man repeated his request several times, and he said: "Do not get angry."',
            reference: 'Sahih al-Bukhari 6116'
          }
        ],
        tips: [
          'Seek refuge in Allah from Shaytan',
          'Change your position (sit if standing)',
          'Perform Wudu',
          'Stay silent',
          'Leave the situation if possible'
        ]
      },
      stressed: {
        title: 'Relieving Stress',
        verses: [
          {
            arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
            translation: 'Allah does not burden a soul beyond that it can bear.',
            reference: 'Quran 2:286'
          }
        ],
        hadiths: [
          {
            text: 'The Prophet ﷺ used to say when distressed: "La ilaha illa Allah al-Azim al-Halim, la ilaha illa Allah Rabb al-\'arsh al-azim, la ilaha illa Allah Rabb as-samawat wa Rabb al-ard wa Rabb al-\'arsh al-karim."',
            reference: 'Sahih al-Bukhari 6345'
          }
        ],
        tips: [
          'Break tasks into smaller steps',
          'Prioritize what\'s important',
          'Take breaks for prayer',
          'Practice deep breathing',
          'Delegate when possible'
        ]
      },
      grateful: {
        title: 'Expressing Gratitude',
        verses: [
          {
            arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
            translation: 'If you are grateful, I will surely increase you [in favor].',
            reference: 'Quran 14:7'
          }
        ],
        hadiths: [
          {
            text: 'The Prophet ﷺ said: "He who does not thank people, does not thank Allah."',
            reference: 'Sunan Abi Dawud 4811'
          }
        ],
        tips: [
          'Keep a gratitude journal',
          'Say Alhamdulillah often',
          'Thank people around you',
          'Reflect on your blessings',
          'Give Sadaqah as thanks'
        ]
      },
      hopeful: {
        title: 'Maintaining Hope',
        verses: [
          {
            arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
            translation: 'And do not despair of the mercy of Allah.',
            reference: 'Quran 12:87'
          }
        ],
        hadiths: [
          {
            text: 'The Prophet ﷺ said: "Allah says: \'I am as My servant thinks I am.\'"',
            reference: 'Sahih al-Bukhari 7405'
          }
        ],
        tips: [
          'Make Dua with certainty',
          'Remember Allah\'s past favors',
          'Read stories of the Prophets',
          'Surround yourself with positive people',
          'Set achievable goals'
        ]
      }
    };

    return content[emotion];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ImageBackground
      source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2FsbGlncmFwaHkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjgwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtinINmE2YTZhzwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjI1MCIgZm9udC1zaXplPSI2MCIgb3BhY2l0eT0iMC4wMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmaWxsPSIjMDAwMDAwIj7Yp9mE2K3ZhdivINmE2YTZhzwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMzUwIiBmb250LXNpemU9IjcwIiBvcGFjaXR5PSIwLjAzIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiMwMDAwMDAiPtiz2KjYrdin2YY8L3RleHQ+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNjYWxsaWdyYXBoeSkiLz48L3N2Zz4=' }}
      style={styles.container}
      imageStyle={styles.backgroundImageStyle}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness</Text>
        <Text style={styles.headerSubtitle}>Nurture your mind and body</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'mental' && styles.tabActive]}
          onPress={() => setSelectedTab('mental')}
        >
          <IconSymbol
            ios_icon_name="brain.head.profile"
            android_material_icon_name="psychology"
            size={20}
            color={selectedTab === 'mental' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'mental' && styles.tabTextActive]}>
            Mental
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'physical' && styles.tabActive]}
          onPress={() => setSelectedTab('physical')}
        >
          <IconSymbol
            ios_icon_name="figure.walk"
            android_material_icon_name="directions-run"
            size={20}
            color={selectedTab === 'physical' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, selectedTab === 'physical' && styles.tabTextActive]}>
            Physical
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {selectedTab === 'mental' && (
          <React.Fragment>
            {/* Prophet Muhammad's Mental Health - MOVED TO TOP */}
            <TouchableOpacity 
              style={styles.prophetCard}
              onPress={() => setShowProphetStory(true)}
            >
              <View style={styles.prophetCardHeader}>
                <IconSymbol
                  ios_icon_name="book.closed.fill"
                  android_material_icon_name="menu-book"
                  size={32}
                  color={colors.primary}
                />
                <View style={styles.prophetCardText}>
                  <Text style={styles.prophetCardTitle}>
                    The Prophet ﷺ and Mental Health
                  </Text>
                  <Text style={styles.prophetCardSubtitle}>
                    Learn how the Prophet ﷺ dealt with hardships
                  </Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron-right"
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {/* Emotion Selector */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="face.smiling"
                  android_material_icon_name="sentiment-satisfied"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.cardTitle}>How are you feeling?</Text>
              </View>
              <Text style={styles.cardDescription}>
                Select an emotion to get Islamic guidance and support
              </Text>
              <View style={styles.emotionsGrid}>
                {emotions.map((emotion, index) => (
                  <TouchableOpacity
                    key={`emotion-${index}`}
                    style={[
                      styles.emotionButton,
                      selectedEmotion === emotion.id && { backgroundColor: emotion.color, borderColor: emotion.color }
                    ]}
                    onPress={() => setSelectedEmotion(emotion.id)}
                  >
                    <IconSymbol
                      ios_icon_name={emotion.icon}
                      android_material_icon_name={emotion.androidIcon}
                      size={24}
                      color={selectedEmotion === emotion.id ? colors.card : emotion.color}
                    />
                    <Text style={[
                      styles.emotionLabel,
                      selectedEmotion === emotion.id && { color: colors.card }
                    ]}>
                      {emotion.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Emotion-specific content */}
            {selectedEmotion && (
              <View style={styles.card}>
                <Text style={styles.emotionContentTitle}>
                  {getEmotionContent(selectedEmotion).title}
                </Text>
                
                {/* Quranic Verses */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Quranic Guidance</Text>
                  {getEmotionContent(selectedEmotion).verses.map((verse, index) => (
                    <View key={`verse-${index}`} style={styles.verseCard}>
                      <Text style={styles.verseArabic}>{verse.arabic}</Text>
                      <Text style={styles.verseTranslation}>{verse.translation}</Text>
                      <Text style={styles.verseReference}>{verse.reference}</Text>
                    </View>
                  ))}
                </View>

                {/* Hadiths */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Prophetic Wisdom</Text>
                  {getEmotionContent(selectedEmotion).hadiths.map((hadith, index) => (
                    <View key={`hadith-${index}`} style={styles.hadithCard}>
                      <Text style={styles.hadithText}>{hadith.text}</Text>
                      <Text style={styles.hadithReference}>{hadith.reference}</Text>
                    </View>
                  ))}
                </View>

                {/* Practical Tips */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Practical Steps</Text>
                  {getEmotionContent(selectedEmotion).tips.map((tip, index) => (
                    <View key={`tip-${index}`} style={styles.tipItem}>
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={20}
                        color={colors.success}
                      />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Enhanced Gratitude Journal */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="heart.fill"
                  android_material_icon_name="favorite"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.cardTitle}>Gratitude Journal</Text>
              </View>
              <Text style={styles.cardDescription}>
                Reflect on your blessings and express gratitude to Allah
              </Text>

              {/* Prompt Section */}
              <View style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <IconSymbol
                    ios_icon_name="lightbulb.fill"
                    android_material_icon_name="lightbulb"
                    size={20}
                    color={colors.warning}
                  />
                  <Text style={styles.promptLabel}>Today&apos;s Prompt:</Text>
                  <TouchableOpacity onPress={generateRandomPrompt}>
                    <IconSymbol
                      ios_icon_name="arrow.clockwise"
                      android_material_icon_name="refresh"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.promptText}>{currentPrompt}</Text>
              </View>

              <TextInput
                style={styles.textInput}
                placeholder="Write your gratitude entry here..."
                placeholderTextColor={colors.textSecondary}
                value={journalEntry}
                onChangeText={setJournalEntry}
                multiline
                numberOfLines={6}
              />

              <View style={styles.journalActions}>
                <TouchableOpacity 
                  style={styles.journalButton}
                  onPress={saveJournalEntry}
                  disabled={isSaving}
                >
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.card}
                  />
                  <Text style={styles.journalButtonText}>
                    {isSaving ? 'Saving...' : 'Save Entry'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.journalButtonSecondary}
                  onPress={loadJournalHistory}
                >
                  <IconSymbol
                    ios_icon_name="book.fill"
                    android_material_icon_name="history"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.journalButtonSecondaryText}>View History</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.journalTip}>
                <IconSymbol
                  ios_icon_name="info.circle"
                  android_material_icon_name="info"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.journalTipText}>
                  {user ? 'Your entries are saved to your profile' : 'Sign in to sync entries across devices'}
                </Text>
              </View>
            </View>

            {/* Stress Relief Dhikr */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="leaf.fill"
                  android_material_icon_name="spa"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.cardTitle}>Stress Relief Dhikr</Text>
              </View>
              <View style={styles.dhikrList}>
                <View style={styles.dhikrItem}>
                  <Text style={styles.dhikrArabic}>لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ</Text>
                  <Text style={styles.dhikrTranslation}>
                    There is no deity except You; exalted are You
                  </Text>
                </View>
                <View style={styles.dhikrItem}>
                  <Text style={styles.dhikrArabic}>حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ</Text>
                  <Text style={styles.dhikrTranslation}>
                    Allah is sufficient for me, and He is the best Disposer of affairs
                  </Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        )}

        {selectedTab === 'physical' && (
          <React.Fragment>
            {/* Water Tracker */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="drop.fill"
                  android_material_icon_name="water-drop"
                  size={24}
                  color={colors.accent}
                />
                <Text style={styles.cardTitle}>Water Tracker</Text>
              </View>
              <Text style={styles.cardDescription}>
                Stay hydrated throughout the day. Goal: 8 glasses
              </Text>
              <View style={styles.trackerProgress}>
                <Text style={styles.trackerCount}>{waterGlasses} / 8 glasses</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${(waterGlasses / 8) * 100}%` }]} />
                </View>
              </View>
              <View style={styles.waterTracker}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass, index) => (
                  <TouchableOpacity
                    key={`water-${index}`}
                    style={[
                      styles.waterGlass,
                      index < waterGlasses && styles.waterGlassFilled
                    ]}
                    onPress={() => {
                      if (index < waterGlasses) {
                        removeWaterGlass();
                      } else {
                        addWaterGlass();
                      }
                    }}
                  >
                    <IconSymbol
                      ios_icon_name={index < waterGlasses ? 'drop.fill' : 'drop'}
                      android_material_icon_name="water-drop"
                      size={24}
                      color={index < waterGlasses ? colors.card : colors.accent}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Enhanced Workout Tracker */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="figure.strengthtraining.traditional"
                  android_material_icon_name="fitness-center"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.cardTitle}>Workout Tracker</Text>
              </View>
              <Text style={styles.cardDescription}>
                Track your strength training and exercises
              </Text>
              
              {/* Weekly Progress */}
              <View style={styles.weeklyStatsCard}>
                <View style={styles.weeklyStatRow}>
                  <Text style={styles.weeklyStatLabel}>This Week</Text>
                  <Text style={styles.weeklyStatValue}>{workoutStats.weeklyMinutes} / {workoutStats.weeklyGoal} min</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${Math.min((workoutStats.weeklyMinutes / workoutStats.weeklyGoal) * 100, 100)}%`, backgroundColor: colors.primary }]} />
                </View>
                <View style={styles.weeklyStatRow}>
                  <View style={styles.streakBadge}>
                    <IconSymbol
                      ios_icon_name="flame.fill"
                      android_material_icon_name="local-fire-department"
                      size={16}
                      color={colors.warning}
                    />
                    <Text style={styles.streakText}>{workoutStats.streak} day streak</Text>
                  </View>
                </View>
              </View>

              <View style={styles.trackerProgress}>
                <Text style={styles.trackerCount}>{workoutMinutes} minutes today</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowWorkoutModal(true)}
              >
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={24}
                  color={colors.card}
                />
                <Text style={styles.addButtonText}>Log Workout</Text>
              </TouchableOpacity>
            </View>

            {/* Enhanced Cardio Tracker */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="heart.fill"
                  android_material_icon_name="favorite"
                  size={24}
                  color={colors.error}
                />
                <Text style={styles.cardTitle}>Cardio Tracker</Text>
              </View>
              <Text style={styles.cardDescription}>
                Track your cardio activities (running, walking, cycling)
              </Text>
              
              {/* Weekly Progress */}
              <View style={styles.weeklyStatsCard}>
                <View style={styles.weeklyStatRow}>
                  <Text style={styles.weeklyStatLabel}>This Week</Text>
                  <Text style={styles.weeklyStatValue}>{cardioStats.weeklyMinutes} / {cardioStats.weeklyGoal} min</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${Math.min((cardioStats.weeklyMinutes / cardioStats.weeklyGoal) * 100, 100)}%`, backgroundColor: colors.error }]} />
                </View>
                <View style={styles.weeklyStatRow}>
                  <View style={styles.streakBadge}>
                    <IconSymbol
                      ios_icon_name="flame.fill"
                      android_material_icon_name="local-fire-department"
                      size={16}
                      color={colors.warning}
                    />
                    <Text style={styles.streakText}>{cardioStats.streak} day streak</Text>
                  </View>
                </View>
              </View>

              <View style={styles.trackerProgress}>
                <Text style={styles.trackerCount}>{cardioMinutes} minutes today</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowCardioModal(true)}
              >
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={24}
                  color={colors.card}
                />
                <Text style={styles.addButtonText}>Log Cardio</Text>
              </TouchableOpacity>
            </View>

            {/* Islamic Perspective on Physical Health */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="book.fill"
                  android_material_icon_name="menu-book"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.cardTitle}>Islamic Perspective</Text>
              </View>
              <View style={styles.hadithCard}>
                <Text style={styles.hadithText}>
                  The Prophet ﷺ said: &quot;Your body has a right over you.&quot;
                </Text>
                <Text style={styles.hadithReference}>Sahih al-Bukhari 5199</Text>
              </View>
              <View style={styles.hadithCard}>
                <Text style={styles.hadithText}>
                  &quot;A strong believer is better and more beloved to Allah than a weak believer, while there is good in both.&quot;
                </Text>
                <Text style={styles.hadithReference}>Sahih Muslim 2664</Text>
              </View>
            </View>

            {/* Sleep & Rest */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol
                  ios_icon_name="moon.zzz.fill"
                  android_material_icon_name="bedtime"
                  size={24}
                  color={colors.secondary}
                />
                <Text style={styles.cardTitle}>Sleep & Rest</Text>
              </View>
              <Text style={styles.cardDescription}>
                Quality sleep is essential for physical and spiritual well-being
              </Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle"
                    android_material_icon_name="check-circle-outline"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Sleep early and wake for Fajr</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle"
                    android_material_icon_name="check-circle-outline"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Recite Ayat al-Kursi before sleep</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle"
                    android_material_icon_name="check-circle-outline"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Avoid screens 1 hour before bed</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle"
                    android_material_icon_name="check-circle-outline"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Make wudu before sleeping</Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        )}
      </ScrollView>

      {/* Prophet Story Modal */}
      <Modal
        visible={showProphetStory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProphetStory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>The Prophet ﷺ and Mental Health</Text>
              <TouchableOpacity onPress={() => setShowProphetStory(false)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalSectionTitle}>The Prophet&apos;s Struggles</Text>
              <Text style={styles.modalText}>
                The Prophet Muhammad ﷺ faced immense hardships throughout his life. He lost his parents at a young age, endured persecution in Makkah, lost his beloved wife Khadijah and uncle Abu Talib in the Year of Sorrow, and faced the loss of his children. Despite these trials, he remained steadfast and showed us how to cope with grief and hardship.
              </Text>

              <Text style={styles.modalSectionTitle}>Quranic Comfort</Text>
              <View style={styles.verseCard}>
                <Text style={styles.verseArabic}>أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ</Text>
                <Text style={styles.verseTranslation}>
                  Have We not expanded for you your breast? And We removed from you your burden which had weighed upon your back.
                </Text>
                <Text style={styles.verseReference}>Quran 94:1-3</Text>
              </View>

              <Text style={styles.modalSectionTitle}>Prophetic Guidance</Text>
              <View style={styles.hadithCard}>
                <Text style={styles.hadithText}>
                  When the Prophet ﷺ was distressed, he would say: &quot;O Ever-Living, O Sustainer, by Your mercy I seek help.&quot;
                </Text>
                <Text style={styles.hadithReference}>Sunan al-Tirmidhi 3524</Text>
              </View>

              <View style={styles.hadithCard}>
                <Text style={styles.hadithText}>
                  The Prophet ﷺ said: &quot;No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.&quot;
                </Text>
                <Text style={styles.hadithReference}>Sahih al-Bukhari 5641</Text>
              </View>

              <Text style={styles.modalSectionTitle}>Lessons for Us</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>It&apos;s okay to feel sad and grieve</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Turn to Allah in times of distress</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Seek support from loved ones</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Remember that hardship is temporary</Text>
                </View>
                <View style={styles.tipItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={styles.tipText}>Professional help is encouraged in Islam</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Journal History Modal */}
      <Modal
        visible={showJournalHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJournalHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Journal History</Text>
              <TouchableOpacity onPress={() => setShowJournalHistory(false)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {journalEntries.length === 0 ? (
                <Text style={styles.emptyText}>No journal entries yet. Start writing today!</Text>
              ) : (
                journalEntries.map((entry, index) => (
                  <View key={`entry-${index}`} style={styles.historyEntry}>
                    <Text style={styles.historyDate}>{formatDate(entry.entry_date)}</Text>
                    {entry.prompt_used && (
                      <Text style={styles.historyPrompt}>Prompt: {entry.prompt_used}</Text>
                    )}
                    <Text style={styles.historyText}>{entry.entry_text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Enhanced Workout Modal */}
      <Modal
        visible={showWorkoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWorkoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quickModal}>
            <Text style={styles.quickModalTitle}>Log Workout</Text>
            <Text style={styles.quickModalSubtitle}>Select workout type</Text>
            <View style={styles.quickModalButtons}>
              {workoutTypes.map((workout, index) => (
                <TouchableOpacity
                  key={`workout-${index}`}
                  style={styles.workoutTypeButton}
                  onPress={() => addWorkout(workout.name, workout.duration)}
                >
                  <IconSymbol
                    ios_icon_name={workout.icon as any}
                    android_material_icon_name="fitness-center"
                    size={24}
                    color={colors.primary}
                  />
                  <View style={styles.workoutTypeText}>
                    <Text style={styles.workoutTypeName}>{workout.name}</Text>
                    <Text style={styles.workoutTypeDuration}>{workout.duration} min</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.quickModalCancel}
              onPress={() => setShowWorkoutModal(false)}
            >
              <Text style={styles.quickModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Enhanced Cardio Modal */}
      <Modal
        visible={showCardioModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCardioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quickModal}>
            <Text style={styles.quickModalTitle}>Log Cardio</Text>
            <Text style={styles.quickModalSubtitle}>Select activity type</Text>
            <View style={styles.quickModalButtons}>
              {cardioTypes.map((cardio, index) => (
                <TouchableOpacity
                  key={`cardio-${index}`}
                  style={styles.workoutTypeButton}
                  onPress={() => addCardio(cardio.name, cardio.duration)}
                >
                  <IconSymbol
                    ios_icon_name={cardio.icon as any}
                    android_material_icon_name="directions-run"
                    size={24}
                    color={colors.error}
                  />
                  <View style={styles.workoutTypeText}>
                    <Text style={styles.workoutTypeName}>{cardio.name}</Text>
                    <Text style={styles.workoutTypeDuration}>{cardio.duration} min</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.quickModalCancel}
              onPress={() => setShowCardioModal(false)}
            >
              <Text style={styles.quickModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  emotionContentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  verseCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  verseArabic: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  verseTranslation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  verseReference: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  hadithCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  hadithText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  hadithReference: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  prophetCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  prophetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prophetCardText: {
    flex: 1,
  },
  prophetCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  prophetCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  promptCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  promptLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  promptText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  journalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  journalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  journalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
  },
  journalButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  journalButtonSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  journalTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  journalTipText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  dhikrList: {
    gap: 16,
  },
  dhikrItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  dhikrArabic: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  dhikrTranslation: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  trackerProgress: {
    marginBottom: 16,
  },
  trackerCount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  waterTracker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  waterGlass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  waterGlassFilled: {
    backgroundColor: colors.accent,
  },
  weeklyStatsCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  weeklyStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  weeklyStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 40,
    fontStyle: 'italic',
  },
  historyEntry: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  historyPrompt: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  quickModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  quickModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  quickModalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  quickModalButtons: {
    gap: 12,
    marginBottom: 16,
  },
  workoutTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutTypeText: {
    flex: 1,
  },
  workoutTypeName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  workoutTypeDuration: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quickModalCancel: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickModalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
