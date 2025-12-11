
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface DailyHadith {
  id: string;
  arabic: string;
  translation: string;
  reference: string;
}

export interface DailyVerse {
  id: string;
  arabic: string;
  translation: string;
  reference: string;
}

interface DailyContentResponse {
  verse: DailyVerse;
  hadith: DailyHadith;
  date: string;
}

// Fallback data in case the database is not available
const fallbackHadiths: DailyHadith[] = [
  {
    id: '1',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions, and every person will be rewarded according to their intention.',
    reference: 'Sahih Bukhari 1',
  },
  {
    id: '2',
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
    reference: 'Sahih Bukhari 10',
  },
  {
    id: '3',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best among you are those who learn the Quran and teach it.',
    reference: 'Sahih Bukhari 5027',
  },
];

const fallbackVerses: DailyVerse[] = [
  {
    id: '1',
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    translation: 'And I did not create the jinn and mankind except to worship Me.',
    reference: 'Quran 51:56',
  },
  {
    id: '2',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    reference: 'Quran 2:152',
  },
  {
    id: '3',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    reference: 'Quran 94:6',
  },
];

// Cache for daily content
let cachedContent: DailyContentResponse | null = null;
let cachedDate: string | null = null;

function getFallbackContent(today: string): DailyContentResponse {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return {
    verse: fallbackVerses[dayOfYear % fallbackVerses.length],
    hadith: fallbackHadiths[dayOfYear % fallbackHadiths.length],
    date: today,
  };
}

export async function getDailyContent(): Promise<DailyContentResponse> {
  const today = new Date().toISOString().split('T')[0];

  // Return cached content if it's for today
  if (cachedContent && cachedDate === today) {
    console.log('Returning cached daily content');
    return cachedContent;
  }

  // If Supabase is not configured, use fallback data
  if (!isSupabaseConfigured() || !supabase) {
    console.log('Supabase not configured, using fallback daily content');
    return getFallbackContent(today);
  }

  try {
    console.log('Fetching daily content from Edge Function...');
    
    // Use Supabase client's functions.invoke which automatically includes auth headers
    const { data, error } = await supabase.functions.invoke('get-daily-content', {
      method: 'GET',
    });

    if (error) {
      console.log('Edge Function error:', error);
      throw error;
    }

    // Validate the response data
    if (!data || !data.verse || !data.hadith) {
      console.log('Invalid data structure from Edge Function, using fallback');
      return getFallbackContent(today);
    }

    console.log('Successfully fetched daily content from database');

    // Cache the content
    cachedContent = data;
    cachedDate = today;

    return data;
  } catch (error) {
    console.log('Error fetching daily content, using fallback:', error instanceof Error ? error.message : String(error));
    
    // Use fallback data
    return getFallbackContent(today);
  }
}

export function getDailyHadith(): DailyHadith {
  // This is kept for backward compatibility but will use cached data
  if (cachedContent) {
    return cachedContent.hadith;
  }
  
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return fallbackHadiths[dayOfYear % fallbackHadiths.length];
}

export function getDailyVerse(): DailyVerse {
  // This is kept for backward compatibility but will use cached data
  if (cachedContent) {
    return cachedContent.verse;
  }
  
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return fallbackVerses[dayOfYear % fallbackVerses.length];
}
