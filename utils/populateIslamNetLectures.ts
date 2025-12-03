
import { supabase } from '@/lib/supabase';

/**
 * Islam Net Lectures Data
 * 
 * To use this file:
 * 1. Search for each video on YouTube: "Title" + "Islam Net"
 * 2. Extract the video ID from the URL
 * 3. Replace the placeholder IDs below with actual video IDs
 * 4. Call populateIslamNetLectures() from your app
 */

interface LectureData {
  title: string;
  speaker: string;
  duration: string;
  videoId: string; // Replace with actual YouTube video ID
  category: string;
}

// IMPORTANT: Replace all videoId values with actual YouTube video IDs
// Search YouTube for: "Title Islam Net" to find each video
const islamNetLectures: LectureData[] = [
  {
    title: 'Convincing Atheists Of God\'s Existence',
    speaker: 'Muhammad Hijab',
    duration: '20:23',
    videoId: 'REPLACE_WITH_ACTUAL_ID', // Search: "Convincing Atheists Of God's Existence Islam Net"
    category: 'debates'
  },
  {
    title: 'It\'s time to get strong! Mohammed Hijab Khutbah at Norway Masjid',
    speaker: 'Mohammed Hijab',
    duration: '34:57',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Powerful Khutbah By Mohammed Hijab In The Heart Of Norway',
    speaker: 'Mohammed Hijab',
    duration: '26:12',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Embrace Allah\'s Blessings: A Guide to Gratitude',
    speaker: 'Abdullahi Umar',
    duration: '8:46',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'The Awakening of the Soul',
    speaker: 'Sh. Alaa Elsayed',
    duration: '43:51',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'MOHAMMED HIJAB DEFEND\'S FEMALE SPEAKERS TO SH. HAITHAM AL-HADDAD',
    speaker: 'Mohammed Hijab',
    duration: '30:51',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'debates'
  },
  {
    title: 'In Search of Allah',
    speaker: 'Sh. Alaa Elsayed',
    duration: '44:19',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'WATCH OUT: DANGERS of marrying TOO YOUNG!',
    speaker: 'Sh. Haitham al-Haddad',
    duration: '7:22',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'fiqh'
  },
  {
    title: 'The Neglected Truth: Journey through the Hereafter',
    speaker: 'Sh Riad Ourzazi',
    duration: '47:42',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'Ambassadors of Islam',
    speaker: 'Imam Siraj Wahhaj',
    duration: '33:33',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Islam VS Liberalism',
    speaker: 'Mohammed Hijab',
    duration: '34:15',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'debates'
  },
  {
    title: 'Let the Quran Enter Your Life',
    speaker: 'Sh. Dr. Ali Mohammed Salah',
    duration: '33:08',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'quran-tafsir'
  },
  {
    title: 'Why I as a Muslim rejected NBA',
    speaker: 'Ibrahim Jaaber',
    duration: '45:53',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'The Justice of Islam',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '41:50',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'fiqh'
  },
  {
    title: 'From Music to Nasheeds',
    speaker: 'Omar Esa',
    duration: '41:59',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Challenges Facing Muslims in the West',
    speaker: 'Adnan Rashid',
    duration: '1:04:13',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'debates'
  },
  {
    title: 'The Modern Challenges of Faith',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '51:06',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'Have Our Leaders Forsaken The Ummah?',
    speaker: 'Sh. Hussain Yee',
    duration: '1:01:20',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'From Jahiliyya to Islam',
    speaker: 'Omar Esa',
    duration: '20:25',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'The Best in the Sight of Allah',
    speaker: 'Sh. Dr. Ali Mohammed Salah',
    duration: '44:47',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'Remember Me and I Shall Remember You',
    speaker: 'Sh. Riad Ouarzazi',
    duration: '54:41',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'How to Have Halal Fun',
    speaker: 'Sh. Hussain Yee',
    duration: '40:33',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'youth'
  },
  {
    title: 'Fall in Love with Allah',
    speaker: 'Sh. Dr. Haitham al Haddad',
    duration: '34:25',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Islam Today: Holding on to Burning Ember',
    speaker: 'Yusha Evans',
    duration: '1:06:47',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'Purification by the Remembrance of Allah',
    speaker: 'Sh. Riad Ouarzazi',
    duration: '1:15:00',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Jesus: The Man and His Message | Part 2',
    speaker: 'Yusha Evans',
    duration: '1:01:29',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'debates'
  },
  {
    title: 'Jesus: The Man and His Message | Part 1',
    speaker: 'Yusha Evans',
    duration: '56:28',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'debates'
  },
  {
    title: 'Medicine of the Heart',
    speaker: 'Sh. Dr. Haitham al Haddad',
    duration: '1:03:28',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'After the Blowing of Resurrection',
    speaker: 'Sh. Shady Alsuleiman',
    duration: '48:37',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'The Mercy of Allah',
    speaker: 'Yusha Evans',
    duration: '50:50',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Streets of Jahiliyyah to the Mosques of Allah',
    speaker: 'Imam Siraj Wahhaj',
    duration: '48:01',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'The Sky is the Limit',
    speaker: 'Imam Siraj Wahhaj',
    duration: '59:38',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Torments of the Grave',
    speaker: 'Sh. Shady Alsuleiman',
    duration: '54:26',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'How to Maintain a Happy Marriage',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '49:55',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'fiqh'
  },
  {
    title: 'Muhammad: The Role Model for the West',
    speaker: 'Yusha Evans',
    duration: '1:07:40',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'seerah'
  },
  {
    title: 'This Is How You Can Protect Yourself from Black Magic',
    speaker: 'Sh. Dr. Ali Mohammed Salah',
    duration: '48:40',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'fiqh'
  },
  {
    title: 'How to Become a Better Worshiper of Allah',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '1:47:48',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'How to Live the Quran?',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '52:23',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'quran-tafsir'
  },
  {
    title: 'Where is Her Grave?',
    speaker: 'Sh. Riad Ouarzazi',
    duration: '30:58',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'seerah'
  },
  {
    title: 'Let Me Just Enter Jannah',
    speaker: 'Mohammad Hoblos',
    duration: '46:24',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  },
  {
    title: 'Islamic Reform: Healthy or Destructive?',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '59:13',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'aqeedah'
  },
  {
    title: 'Dealing With Ikthilaf Among Scholars',
    speaker: 'Sh. Dr. Haitham al-Haddad',
    duration: '39:34',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'fiqh'
  },
  {
    title: 'How to Unite The Ummah?',
    speaker: 'Sh. Dr. Ali Mohammed Salah',
    duration: '44:44',
    videoId: 'REPLACE_WITH_ACTUAL_ID',
    category: 'motivational'
  }
];

/**
 * Populate the lectures table with Islam Net videos
 * 
 * IMPORTANT: Before running this function, replace all 'REPLACE_WITH_ACTUAL_ID' 
 * values in the islamNetLectures array above with actual YouTube video IDs.
 * 
 * @returns Object with success status and message
 */
export async function populateIslamNetLectures(): Promise<{
  success: boolean;
  message: string;
  count?: number;
  error?: string;
}> {
  try {
    console.log('Starting to populate Islam Net lectures...');

    // Check if any video IDs are still placeholders
    const hasPlaceholders = islamNetLectures.some(
      lecture => lecture.videoId === 'REPLACE_WITH_ACTUAL_ID'
    );

    if (hasPlaceholders) {
      return {
        success: false,
        message: 'Please replace all placeholder video IDs with actual YouTube video IDs before running this function.',
        error: 'Placeholder IDs detected'
      };
    }

    // Transform data for database insertion
    const lecturesData = islamNetLectures.map((lecture, index) => ({
      category_id: lecture.category,
      title: lecture.title,
      speaker: lecture.speaker,
      duration: lecture.duration,
      video_url: `https://www.youtube.com/watch?v=${lecture.videoId}`,
      thumbnail_url: `https://i.ytimg.com/vi/${lecture.videoId}/hqdefault.jpg`,
      order_index: index
    }));

    // Insert into database
    const { data, error } = await supabase
      .from('lectures')
      .insert(lecturesData)
      .select();

    if (error) {
      console.error('Error inserting lectures:', error);
      return {
        success: false,
        message: 'Failed to insert lectures into database',
        error: error.message
      };
    }

    console.log(`Successfully inserted ${data.length} lectures`);
    return {
      success: true,
      message: `Successfully populated ${data.length} Islam Net lectures`,
      count: data.length
    };
  } catch (error) {
    console.error('Exception during population:', error);
    return {
      success: false,
      message: 'An error occurred while populating lectures',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Clear all existing lectures from the database
 * Use with caution!
 */
export async function clearAllLectures(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from('lectures')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      return {
        success: false,
        message: 'Failed to clear lectures',
      };
    }

    return {
      success: true,
      message: 'All lectures cleared successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while clearing lectures'
    };
  }
}

/**
 * Validate that a YouTube video ID is correct
 * @param videoId The YouTube video ID to validate
 * @returns true if valid, false otherwise
 */
export function validateYouTubeVideoId(videoId: string): boolean {
  // YouTube video IDs are typically 11 characters long
  // and contain alphanumeric characters, hyphens, and underscores
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdRegex.test(videoId);
}

/**
 * Extract video ID from a YouTube URL
 * @param url The YouTube URL
 * @returns The video ID or null if not found
 */
export function extractVideoIdFromUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
