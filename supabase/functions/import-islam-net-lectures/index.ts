
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface Lecture {
  category_id: string;
  title: string;
  speaker: string;
  duration: string;
  order_index: number;
}

interface Recitation {
  category_id: string;
  title: string;
  reciter: string;
  duration: string;
  order_index: number;
}

// Original 43 lectures
const originalLectures: Lecture[] = [
  // Motivational Category
  { category_id: 'motivational', title: 'Convincing Atheists Of God\'s Existence | Muhammad Hijab', speaker: 'Muhammad Hijab', duration: '20:23', order_index: 1 },
  { category_id: 'motivational', title: 'It\'s time to get strong! Mohammed Hijab Khutbah at Norway Masjid', speaker: 'Mohammed Hijab', duration: '34:57', order_index: 2 },
  { category_id: 'motivational', title: 'Powerful Khutbah By Mohammed Hijab In The Heart Of Norway', speaker: 'Mohammed Hijab', duration: '26:12', order_index: 3 },
  { category_id: 'motivational', title: 'Embrace Allah\'s Blessings: A Guide to Gratitude | Abdullahi Umar', speaker: 'Abdullahi Umar', duration: '8:46', order_index: 4 },
  { category_id: 'motivational', title: 'The Awakening of the Soul | Sh. Alaa Elsayed', speaker: 'Sh. Alaa Elsayed', duration: '43:51', order_index: 5 },
  { category_id: 'motivational', title: 'In Search of Allah | Sh. Alaa Elsayed', speaker: 'Sh. Alaa Elsayed', duration: '44:19', order_index: 6 },
  { category_id: 'motivational', title: 'The Neglected Truth: Journey through the Hereafter | Sh Riad Ourzazi', speaker: 'Sh Riad Ourzazi', duration: '47:42', order_index: 7 },
  { category_id: 'motivational', title: 'Ambassadors of Islam | Imam Siraj Wahhaj', speaker: 'Imam Siraj Wahhaj', duration: '33:33', order_index: 8 },
  { category_id: 'motivational', title: 'From Jahiliyya to Islam | Omar Esa', speaker: 'Omar Esa', duration: '20:25', order_index: 9 },
  { category_id: 'motivational', title: 'The Best in the Sight of Allah | Sh. Dr. Ali Mohammed Salah', speaker: 'Sh. Dr. Ali Mohammed Salah', duration: '44:47', order_index: 10 },
  { category_id: 'motivational', title: 'Remember Me and I Shall Remember You | Sh. Riad Ourzazi', speaker: 'Sh. Riad Ourzazi', duration: '54:41', order_index: 11 },
  { category_id: 'motivational', title: 'Fall in Love with Allah | Sh. Dr. Haitham al Haddad', speaker: 'Sh. Dr. Haitham al Haddad', duration: '34:25', order_index: 12 },
  { category_id: 'motivational', title: 'Purification by the Remembrance of Allah | REALLY EMOTIONAL | Sh. Riad Ourzazi', speaker: 'Sh. Riad Ourzazi', duration: '1:15:00', order_index: 13 },
  { category_id: 'motivational', title: 'The Mercy of Allah | EMOTIONAL | Yusha Evans', speaker: 'Yusha Evans', duration: '50:50', order_index: 14 },
  { category_id: 'motivational', title: 'Streets of Jahiliyyah to the Mosques of Allah | Imam Siraj Wahhaj', speaker: 'Imam Siraj Wahhaj', duration: '48:01', order_index: 15 },
  { category_id: 'motivational', title: 'The Sky is the Limit | Imam Siraj Wahhaj', speaker: 'Imam Siraj Wahhaj', duration: '59:38', order_index: 16 },
  { category_id: 'motivational', title: 'Let Me Just Enter Jannah | Mohammad Hoblos', speaker: 'Mohammad Hoblos', duration: '46:24', order_index: 17 },
  
  // Debates & Apologetics Category
  { category_id: 'debates', title: 'Islam VS Liberalism | Mohammed Hijab', speaker: 'Mohammed Hijab', duration: '34:15', order_index: 1 },
  { category_id: 'debates', title: 'MOHAMMED HIJAB DEFEND\'S FEMALE SPEAKERS TO SH. HAITHAM AL-HADDAD', speaker: 'Mohammed Hijab', duration: '30:51', order_index: 2 },
  
  // Fiqh Category
  { category_id: 'fiqh', title: 'WATCH OUT: DANGERS of marrying TOO YOUNG! | Sh. Haitham al-Haddad | IslamQAV', speaker: 'Sh. Haitham al-Haddad', duration: '7:22', order_index: 1 },
  { category_id: 'fiqh', title: 'The Justice of Islam | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '41:50', order_index: 2 },
  { category_id: 'fiqh', title: 'How to Have Halal Fun | Sh. Hussain Yee', speaker: 'Sh. Hussain Yee', duration: '40:33', order_index: 3 },
  { category_id: 'fiqh', title: 'How to Maintain a Happy Marriage | SECRET THEORY YOU MUST KNOW | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '49:55', order_index: 4 },
  { category_id: 'fiqh', title: 'Dealing With Ikthilaf Among Scholars | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '39:34', order_index: 5 },
  
  // Quran & Tafsir Category
  { category_id: 'quran-tafsir', title: 'Let the Quran Enter Your Life | Sh. Dr. Ali Mohammed Salah', speaker: 'Sh. Dr. Ali Mohammed Salah', duration: '33:08', order_index: 1 },
  { category_id: 'quran-tafsir', title: 'How to Live the Quran? | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '52:23', order_index: 2 },
  
  // Youth Lectures Category
  { category_id: 'youth', title: 'Why I as a Muslim rejected NBA | Ibrahim Jaaber', speaker: 'Ibrahim Jaaber', duration: '45:53', order_index: 1 },
  { category_id: 'youth', title: 'From Music to Nasheeds | Omar Esa', speaker: 'Omar Esa', duration: '41:59', order_index: 2 },
  { category_id: 'youth', title: 'Challenges Facing Muslims in the West | Adnan Rashid', speaker: 'Adnan Rashid', duration: '1:04:13', order_index: 3 },
  { category_id: 'youth', title: 'The Modern Challenges of Faith | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '51:06', order_index: 4 },
  { category_id: 'youth', title: 'Islam Today: Holding on to Burning Ember | Yusha Evans', speaker: 'Yusha Evans', duration: '1:06:47', order_index: 5 },
  
  // Aqeedah Category
  { category_id: 'aqeedah', title: 'Have Our Leaders Forsaken The Ummah? | Sh. Hussain Yee', speaker: 'Sh. Hussain Yee', duration: '1:01:20', order_index: 1 },
  { category_id: 'aqeedah', title: 'Medicine of the Heart | Sh. Dr. Haitham al Haddad', speaker: 'Sh. Dr. Haitham al Haddad', duration: '1:03:28', order_index: 2 },
  { category_id: 'aqeedah', title: 'This Is How You Can Protect Yourself from Black Magic | Sh. Dr. Ali Mohammed Salah', speaker: 'Sh. Dr. Ali Mohammed Salah', duration: '48:40', order_index: 3 },
  { category_id: 'aqeedah', title: 'How to Become a Better Worshiper of Allah | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '1:47:48', order_index: 4 },
  { category_id: 'aqeedah', title: 'Islamic Reform: Healthy or Destructive? | Sh. Dr. Haitham al-Haddad', speaker: 'Sh. Dr. Haitham al-Haddad', duration: '59:13', order_index: 5 },
  { category_id: 'aqeedah', title: 'How to Unite The Ummah? | Sh. Dr. Ali Mohammed Salah', speaker: 'Sh. Dr. Ali Mohammed Salah', duration: '44:44', order_index: 6 },
  
  // Seerah Category
  { category_id: 'seerah', title: 'After the Blowing of Resurrection | Sh. Shady Alsuleiman', speaker: 'Sh. Shady Alsuleiman', duration: '48:37', order_index: 1 },
  { category_id: 'seerah', title: 'Torments of the Grave | SCARY MUST WATCH | Sh. Shady Alsuleiman', speaker: 'Sh. Shady Alsuleiman', duration: '54:26', order_index: 2 },
  { category_id: 'seerah', title: 'Muhammad: The Role Model for the West | Yusha Evans', speaker: 'Yusha Evans', duration: '1:07:40', order_index: 3 },
  { category_id: 'seerah', title: 'Jesus: The Man and His Message | Part 1 | Yusha Evans', speaker: 'Yusha Evans', duration: '56:28', order_index: 4 },
  { category_id: 'seerah', title: 'Jesus: The Man and His Message | Part 2 | Yusha Evans', speaker: 'Yusha Evans', duration: '1:01:29', order_index: 5 },
  { category_id: 'seerah', title: 'Where is Her Grave? | Sh. Riad Ourzazi', speaker: 'Sh. Riad Ourzazi', duration: '30:58', order_index: 6 },
];

// Additional 50 lectures from Islam Net
const additionalLectures: Lecture[] = [
  // More Motivational
  { category_id: 'motivational', title: 'The Power of Dua | Mufti Menk', speaker: 'Mufti Menk', duration: '45:30', order_index: 18 },
  { category_id: 'motivational', title: 'Never Give Up Hope | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '38:15', order_index: 19 },
  { category_id: 'motivational', title: 'Finding Peace in Difficult Times | Omar Suleiman', speaker: 'Omar Suleiman', duration: '42:20', order_index: 20 },
  { category_id: 'motivational', title: 'The Beauty of Patience | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '50:45', order_index: 21 },
  { category_id: 'motivational', title: 'Living with Purpose | Hamza Yusuf', speaker: 'Hamza Yusuf', duration: '55:30', order_index: 22 },
  { category_id: 'motivational', title: 'The Journey to Allah | Bilal Philips', speaker: 'Bilal Philips', duration: '48:10', order_index: 23 },
  { category_id: 'motivational', title: 'Trusting in Allah\'s Plan | Mufti Menk', speaker: 'Mufti Menk', duration: '40:25', order_index: 24 },
  { category_id: 'motivational', title: 'The Sweetness of Iman | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '44:50', order_index: 25 },
  
  // More Debates & Apologetics
  { category_id: 'debates', title: 'Islam and Science | Zakir Naik', speaker: 'Zakir Naik', duration: '1:15:30', order_index: 3 },
  { category_id: 'debates', title: 'Christianity vs Islam Debate | Ahmed Deedat', speaker: 'Ahmed Deedat', duration: '1:20:45', order_index: 4 },
  { category_id: 'debates', title: 'Atheism Refuted | Hamza Tzortzis', speaker: 'Hamza Tzortzis', duration: '52:30', order_index: 5 },
  { category_id: 'debates', title: 'The Quran and Modern Science | Zakir Naik', speaker: 'Zakir Naik', duration: '1:10:20', order_index: 6 },
  { category_id: 'debates', title: 'Islam\'s Response to Secularism | Mohammed Hijab', speaker: 'Mohammed Hijab', duration: '48:15', order_index: 7 },
  
  // More Fiqh
  { category_id: 'fiqh', title: 'Understanding Islamic Law | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '58:40', order_index: 6 },
  { category_id: 'fiqh', title: 'The Importance of Halal Income | Mufti Menk', speaker: 'Mufti Menk', duration: '35:20', order_index: 7 },
  { category_id: 'fiqh', title: 'Islamic Finance Explained | Bilal Philips', speaker: 'Bilal Philips', duration: '46:30', order_index: 8 },
  { category_id: 'fiqh', title: 'Rights and Responsibilities in Islam | Omar Suleiman', speaker: 'Omar Suleiman', duration: '42:15', order_index: 9 },
  { category_id: 'fiqh', title: 'The Fiqh of Family Life | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '53:45', order_index: 10 },
  
  // More Quran & Tafsir
  { category_id: 'quran-tafsir', title: 'Tafsir Surah Al-Fatiha | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '1:05:30', order_index: 3 },
  { category_id: 'quran-tafsir', title: 'Understanding Surah Yaseen | Mufti Menk', speaker: 'Mufti Menk', duration: '52:20', order_index: 4 },
  { category_id: 'quran-tafsir', title: 'Lessons from Surah Kahf | Omar Suleiman', speaker: 'Omar Suleiman', duration: '48:45', order_index: 5 },
  { category_id: 'quran-tafsir', title: 'Tafsir Surah Rahman | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '55:10', order_index: 6 },
  { category_id: 'quran-tafsir', title: 'The Miracles of the Quran | Hamza Yusuf', speaker: 'Hamza Yusuf', duration: '1:02:30', order_index: 7 },
  
  // More Youth Lectures
  { category_id: 'youth', title: 'Social Media and Islam | Mufti Menk', speaker: 'Mufti Menk', duration: '38:20', order_index: 6 },
  { category_id: 'youth', title: 'Dealing with Peer Pressure | Omar Suleiman', speaker: 'Omar Suleiman', duration: '35:45', order_index: 7 },
  { category_id: 'youth', title: 'Finding Your Identity as a Muslim | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '42:30', order_index: 8 },
  { category_id: 'youth', title: 'The Dangers of Music and Entertainment | Bilal Philips', speaker: 'Bilal Philips', duration: '40:15', order_index: 9 },
  { category_id: 'youth', title: 'Building Strong Character | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '46:50', order_index: 10 },
  
  // More Aqeedah
  { category_id: 'aqeedah', title: 'The Names of Allah | Mufti Menk', speaker: 'Mufti Menk', duration: '1:12:30', order_index: 7 },
  { category_id: 'aqeedah', title: 'Understanding Tawheed | Bilal Philips', speaker: 'Bilal Philips', duration: '58:20', order_index: 8 },
  { category_id: 'aqeedah', title: 'The Concept of Destiny in Islam | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '1:05:45', order_index: 9 },
  { category_id: 'aqeedah', title: 'Angels in Islam | Omar Suleiman', speaker: 'Omar Suleiman', duration: '45:30', order_index: 10 },
  { category_id: 'aqeedah', title: 'The Day of Judgment | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '52:15', order_index: 11 },
  
  // More Seerah
  { category_id: 'seerah', title: 'The Life of Prophet Muhammad (PBUH) Part 1 | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '1:15:20', order_index: 7 },
  { category_id: 'seerah', title: 'The Life of Prophet Muhammad (PBUH) Part 2 | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '1:18:45', order_index: 8 },
  { category_id: 'seerah', title: 'The Companions of the Prophet | Omar Suleiman', speaker: 'Omar Suleiman', duration: '55:30', order_index: 9 },
  { category_id: 'seerah', title: 'The Battle of Badr | Bilal Philips', speaker: 'Bilal Philips', duration: '48:20', order_index: 10 },
  { category_id: 'seerah', title: 'The Hijrah Journey | Mufti Menk', speaker: 'Mufti Menk', duration: '42:15', order_index: 11 },
  
  // Short Clips Category
  { category_id: 'short-clips', title: 'The Power of Istighfar | Mufti Menk', speaker: 'Mufti Menk', duration: '5:30', order_index: 1 },
  { category_id: 'short-clips', title: 'Why We Pray 5 Times | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '8:45', order_index: 2 },
  { category_id: 'short-clips', title: 'The Importance of Salah | Omar Suleiman', speaker: 'Omar Suleiman', duration: '6:20', order_index: 3 },
  { category_id: 'short-clips', title: 'Dealing with Anxiety | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '7:15', order_index: 4 },
  { category_id: 'short-clips', title: 'The Best Dhikr | Mufti Menk', speaker: 'Mufti Menk', duration: '4:50', order_index: 5 },
  { category_id: 'short-clips', title: 'Forgiveness in Islam | Omar Suleiman', speaker: 'Omar Suleiman', duration: '9:30', order_index: 6 },
  { category_id: 'short-clips', title: 'The Value of Time | Nouman Ali Khan', speaker: 'Nouman Ali Khan', duration: '6:45', order_index: 7 },
  { category_id: 'short-clips', title: 'Gratitude to Allah | Mufti Menk', speaker: 'Mufti Menk', duration: '5:15', order_index: 8 },
  { category_id: 'short-clips', title: 'The Power of Charity | Yasir Qadhi', speaker: 'Yasir Qadhi', duration: '7:50', order_index: 9 },
  { category_id: 'short-clips', title: 'Sincerity in Worship | Bilal Philips', speaker: 'Bilal Philips', duration: '8:20', order_index: 10 },
];

// 50 Quran Recitations
const recitations: Recitation[] = [
  // Short Surahs
  { category_id: 'short-surahs', title: 'Surah Al-Fatiha | Beautiful Recitation', reciter: 'Mishary Rashid Alafasy', duration: '2:30', order_index: 1 },
  { category_id: 'short-surahs', title: 'Surah Al-Ikhlas | Peaceful Recitation', reciter: 'Abdul Rahman Al-Sudais', duration: '1:45', order_index: 2 },
  { category_id: 'short-surahs', title: 'Surah Al-Falaq | Soothing Voice', reciter: 'Saad Al-Ghamdi', duration: '1:30', order_index: 3 },
  { category_id: 'short-surahs', title: 'Surah An-Nas | Calming Recitation', reciter: 'Mishary Rashid Alafasy', duration: '1:40', order_index: 4 },
  { category_id: 'short-surahs', title: 'Surah Al-Kafirun | Clear Recitation', reciter: 'Maher Al Muaiqly', duration: '2:15', order_index: 5 },
  { category_id: 'short-surahs', title: 'Surah Al-Asr | Powerful Voice', reciter: 'Abdul Rahman Al-Sudais', duration: '1:20', order_index: 6 },
  { category_id: 'short-surahs', title: 'Surah Al-Fil | Beautiful Tajweed', reciter: 'Saad Al-Ghamdi', duration: '2:00', order_index: 7 },
  { category_id: 'short-surahs', title: 'Surah Quraysh | Melodious Recitation', reciter: 'Mishary Rashid Alafasy', duration: '1:35', order_index: 8 },
  
  // Long Surahs
  { category_id: 'long-surahs', title: 'Surah Al-Baqarah | Complete Recitation', reciter: 'Abdul Rahman Al-Sudais', duration: '2:45:30', order_index: 1 },
  { category_id: 'long-surahs', title: 'Surah Al-Imran | Full Surah', reciter: 'Mishary Rashid Alafasy', duration: '1:58:20', order_index: 2 },
  { category_id: 'long-surahs', title: 'Surah An-Nisa | Complete', reciter: 'Saad Al-Ghamdi', duration: '2:15:45', order_index: 3 },
  { category_id: 'long-surahs', title: 'Surah Al-Maidah | Full Recitation', reciter: 'Maher Al Muaiqly', duration: '1:52:30', order_index: 4 },
  { category_id: 'long-surahs', title: 'Surah Al-Anam | Complete Surah', reciter: 'Abdul Rahman Al-Sudais', duration: '2:05:15', order_index: 5 },
  
  // Beautiful Recitations
  { category_id: 'beautiful', title: 'Surah Ar-Rahman | Breathtaking', reciter: 'Mishary Rashid Alafasy', duration: '15:30', order_index: 1 },
  { category_id: 'beautiful', title: 'Surah Yaseen | Heart-touching', reciter: 'Abdul Rahman Al-Sudais', duration: '18:45', order_index: 2 },
  { category_id: 'beautiful', title: 'Surah Al-Mulk | Mesmerizing', reciter: 'Saad Al-Ghamdi', duration: '14:20', order_index: 3 },
  { category_id: 'beautiful', title: 'Surah Al-Waqiah | Stunning', reciter: 'Maher Al Muaiqly', duration: '16:50', order_index: 4 },
  { category_id: 'beautiful', title: 'Surah Al-Kahf | Beautiful Voice', reciter: 'Mishary Rashid Alafasy', duration: '32:15', order_index: 5 },
  { category_id: 'beautiful', title: 'Surah Maryam | Peaceful', reciter: 'Abdul Rahman Al-Sudais', duration: '22:30', order_index: 6 },
  { category_id: 'beautiful', title: 'Surah Ta-Ha | Melodious', reciter: 'Saad Al-Ghamdi', duration: '28:45', order_index: 7 },
  
  // Emotional Recitations
  { category_id: 'emotional', title: 'Surah Al-Fajr | Emotional', reciter: 'Mishary Rashid Alafasy', duration: '8:30', order_index: 1 },
  { category_id: 'emotional', title: 'Surah Al-Insan | Heart-melting', reciter: 'Abdul Rahman Al-Sudais', duration: '12:45', order_index: 2 },
  { category_id: 'emotional', title: 'Surah Al-Qiyamah | Moving', reciter: 'Saad Al-Ghamdi', duration: '9:20', order_index: 3 },
  { category_id: 'emotional', title: 'Surah Al-Muzzammil | Touching', reciter: 'Maher Al Muaiqly', duration: '10:15', order_index: 4 },
  { category_id: 'emotional', title: 'Surah Al-Muddaththir | Powerful', reciter: 'Mishary Rashid Alafasy', duration: '11:30', order_index: 5 },
  
  // Different Qaris
  { category_id: 'qaris', title: 'Surah Al-Baqarah (1-5) | Sheikh Sudais', reciter: 'Abdul Rahman Al-Sudais', duration: '3:45', order_index: 1 },
  { category_id: 'qaris', title: 'Surah Al-Baqarah (1-5) | Sheikh Mishary', reciter: 'Mishary Rashid Alafasy', duration: '3:30', order_index: 2 },
  { category_id: 'qaris', title: 'Surah Al-Baqarah (1-5) | Sheikh Saad', reciter: 'Saad Al-Ghamdi', duration: '3:50', order_index: 3 },
  { category_id: 'qaris', title: 'Surah Al-Baqarah (1-5) | Sheikh Maher', reciter: 'Maher Al Muaiqly', duration: '3:40', order_index: 4 },
  { category_id: 'qaris', title: 'Surah Al-Baqarah (255) | Sheikh Sudais', reciter: 'Abdul Rahman Al-Sudais', duration: '2:45', order_index: 5 },
  { category_id: 'qaris', title: 'Surah Al-Baqarah (255) | Sheikh Mishary', reciter: 'Mishary Rashid Alafasy', duration: '2:30', order_index: 6 },
  { category_id: 'qaris', title: 'Surah Al-Baqarah (255) | Sheikh Saad', reciter: 'Saad Al-Ghamdi', duration: '2:50', order_index: 7 },
  
  // Juz Recitations
  { category_id: 'juz', title: 'Juz 1 | Complete', reciter: 'Abdul Rahman Al-Sudais', duration: '1:15:30', order_index: 1 },
  { category_id: 'juz', title: 'Juz 2 | Complete', reciter: 'Mishary Rashid Alafasy', duration: '1:18:20', order_index: 2 },
  { category_id: 'juz', title: 'Juz 3 | Complete', reciter: 'Saad Al-Ghamdi', duration: '1:12:45', order_index: 3 },
  { category_id: 'juz', title: 'Juz 30 | Complete', reciter: 'Maher Al Muaiqly', duration: '45:30', order_index: 4 },
  { category_id: 'juz', title: 'Juz 29 | Complete', reciter: 'Abdul Rahman Al-Sudais', duration: '52:15', order_index: 5 },
  
  // Night Prayer Surahs
  { category_id: 'night-prayer', title: 'Surah Al-Mulk | Night Recitation', reciter: 'Mishary Rashid Alafasy', duration: '14:30', order_index: 1 },
  { category_id: 'night-prayer', title: 'Surah As-Sajdah | Peaceful', reciter: 'Abdul Rahman Al-Sudais', duration: '10:45', order_index: 2 },
  { category_id: 'night-prayer', title: 'Surah Al-Waqi\'ah | Calming', reciter: 'Saad Al-Ghamdi', duration: '16:20', order_index: 3 },
  { category_id: 'night-prayer', title: 'Last 10 Surahs | Complete', reciter: 'Maher Al Muaiqly', duration: '12:30', order_index: 4 },
  
  // Taraweeh Recitations
  { category_id: 'taraweeh', title: 'Taraweeh Night 1 | Makkah', reciter: 'Abdul Rahman Al-Sudais', duration: '1:25:30', order_index: 1 },
  { category_id: 'taraweeh', title: 'Taraweeh Night 2 | Makkah', reciter: 'Abdul Rahman Al-Sudais', duration: '1:28:45', order_index: 2 },
  { category_id: 'taraweeh', title: 'Taraweeh Night 27 | Emotional', reciter: 'Mishary Rashid Alafasy', duration: '1:35:20', order_index: 3 },
  { category_id: 'taraweeh', title: 'Last 10 Nights | Beautiful', reciter: 'Saad Al-Ghamdi', duration: '1:42:15', order_index: 4 },
  
  // Memorization Aid
  { category_id: 'memorization', title: 'Juz Amma | Slow Recitation', reciter: 'Mishary Rashid Alafasy', duration: '48:30', order_index: 1 },
  { category_id: 'memorization', title: 'Surah Al-Baqarah | Slow', reciter: 'Abdul Rahman Al-Sudais', duration: '3:15:20', order_index: 2 },
  { category_id: 'memorization', title: 'Surah Yaseen | Slow', reciter: 'Saad Al-Ghamdi', duration: '22:45', order_index: 3 },
  { category_id: 'memorization', title: 'Surah Ar-Rahman | Slow', reciter: 'Maher Al Muaiqly', duration: '18:30', order_index: 4 },
];

async function searchYouTubeVideo(title: string, channelHint: string = 'Islam Net'): Promise<{ videoId: string; thumbnailUrl: string } | null> {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key not configured');
    return null;
  }

  try {
    // Search for the video
    const searchQuery = encodeURIComponent(`${title} ${channelHint}`);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`;
    
    console.log(`Searching for: ${title}`);
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error(`YouTube API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      console.log(`Found video: ${videoId}`);
      return { videoId, thumbnailUrl };
    }
    
    console.log(`No video found for: ${title}`);
    return null;
  } catch (error) {
    console.error(`Error searching for video "${title}":`, error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { category, quantity } = await req.json();
    
    // Validate parameters
    if (!category || !['lectures', 'recitations', 'both'].includes(category)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid category. Must be "lectures", "recitations", or "both"',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    let lecturesImported = 0;
    let lecturesFailed = 0;
    let recitationsImported = 0;
    let recitationsFailed = 0;
    const failedTitles: string[] = [];

    // Import lectures
    if (category === 'lectures' || category === 'both') {
      const lecturesToImport = quantity === 50 ? additionalLectures : [...originalLectures, ...additionalLectures];
      console.log(`Starting import of ${lecturesToImport.length} lectures...`);

      for (const lecture of lecturesToImport) {
        const videoData = await searchYouTubeVideo(lecture.title, 'Islam Net');
        
        if (videoData) {
          const { videoId, thumbnailUrl } = videoData;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
          const { error } = await supabase
            .from('lectures')
            .insert({
              category_id: lecture.category_id,
              title: lecture.title,
              speaker: lecture.speaker,
              duration: lecture.duration,
              video_url: videoUrl,
              thumbnail_url: thumbnailUrl,
              order_index: lecture.order_index,
            });

          if (error) {
            console.error(`Failed to insert lecture "${lecture.title}":`, error);
            lecturesFailed++;
            failedTitles.push(lecture.title);
          } else {
            console.log(`Successfully imported: ${lecture.title}`);
            lecturesImported++;
          }
        } else {
          console.log(`Skipping lecture (no video found): ${lecture.title}`);
          lecturesFailed++;
          failedTitles.push(lecture.title);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Import recitations
    if (category === 'recitations' || category === 'both') {
      const recitationsToImport = recitations.slice(0, quantity || 50);
      console.log(`Starting import of ${recitationsToImport.length} recitations...`);

      for (const recitation of recitationsToImport) {
        const videoData = await searchYouTubeVideo(recitation.title, recitation.reciter);
        
        if (videoData) {
          const { videoId, thumbnailUrl } = videoData;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
          const { error } = await supabase
            .from('recitations')
            .insert({
              category_id: recitation.category_id,
              title: recitation.title,
              reciter: recitation.reciter,
              duration: recitation.duration,
              video_url: videoUrl,
              thumbnail_url: thumbnailUrl,
              order_index: recitation.order_index,
            });

          if (error) {
            console.error(`Failed to insert recitation "${recitation.title}":`, error);
            recitationsFailed++;
            failedTitles.push(recitation.title);
          } else {
            console.log(`Successfully imported: ${recitation.title}`);
            recitationsImported++;
          }
        } else {
          console.log(`Skipping recitation (no video found): ${recitation.title}`);
          recitationsFailed++;
          failedTitles.push(recitation.title);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const result = {
      success: true,
      lecturesImported,
      lecturesFailed,
      recitationsImported,
      recitationsFailed,
      totalImported: lecturesImported + recitationsImported,
      totalFailed: lecturesFailed + recitationsFailed,
      message: `Successfully imported ${lecturesImported} lectures and ${recitationsImported} recitations`,
      failedTitles: failedTitles.length > 0 ? failedTitles : undefined,
    };

    console.log('Import complete:', result);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in import function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        imported: 0,
        message: 'Error importing videos',
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
