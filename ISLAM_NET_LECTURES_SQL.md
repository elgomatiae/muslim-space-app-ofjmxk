
# Islam Net Lectures - SQL Insert Script

## Instructions

1. Search for each video on YouTube using the title + "Islam Net"
2. Extract the video ID from the URL
3. Replace `VIDEO_ID_HERE` with the actual video ID in the SQL below
4. Run the SQL in Supabase SQL Editor

## Example

If you find this video: `https://www.youtube.com/watch?v=ABC123xyz`
Replace `VIDEO_ID_HERE` with `ABC123xyz`

## SQL Script

```sql
-- Clear existing lectures (optional)
-- DELETE FROM lectures;

-- Insert Islam Net Lectures
INSERT INTO lectures (category_id, title, speaker, duration, video_url, thumbnail_url, order_index)
VALUES
  -- 1. Convincing Atheists Of God's Existence
  ('debates', 'Convincing Atheists Of God''s Existence', 'Muhammad Hijab', '20:23', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 0),
  
  -- 2. It's time to get strong!
  ('motivational', 'It''s time to get strong! Mohammed Hijab Khutbah at Norway Masjid', 'Mohammed Hijab', '34:57', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 1),
  
  -- 3. Powerful Khutbah
  ('motivational', 'Powerful Khutbah By Mohammed Hijab In The Heart Of Norway', 'Mohammed Hijab', '26:12', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 2),
  
  -- 4. Embrace Allah's Blessings
  ('motivational', 'Embrace Allah''s Blessings: A Guide to Gratitude', 'Abdullahi Umar', '8:46', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 3),
  
  -- 5. The Awakening of the Soul
  ('aqeedah', 'The Awakening of the Soul', 'Sh. Alaa Elsayed', '43:51', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 4),
  
  -- 6. MOHAMMED HIJAB DEFEND'S FEMALE SPEAKERS
  ('debates', 'MOHAMMED HIJAB DEFEND''S FEMALE SPEAKERS TO SH. HAITHAM AL-HADDAD', 'Mohammed Hijab', '30:51', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 5),
  
  -- 7. In Search of Allah
  ('aqeedah', 'In Search of Allah', 'Sh. Alaa Elsayed', '44:19', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 6),
  
  -- 8. DANGERS of marrying TOO YOUNG
  ('fiqh', 'WATCH OUT: DANGERS of marrying TOO YOUNG!', 'Sh. Haitham al-Haddad', '7:22', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 7),
  
  -- 9. The Neglected Truth
  ('aqeedah', 'The Neglected Truth: Journey through the Hereafter', 'Sh Riad Ourzazi', '47:42', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 8),
  
  -- 10. Ambassadors of Islam
  ('motivational', 'Ambassadors of Islam', 'Imam Siraj Wahhaj', '33:33', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 9),
  
  -- 11. Islam VS Liberalism
  ('debates', 'Islam VS Liberalism', 'Mohammed Hijab', '34:15', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 10),
  
  -- 12. Let the Quran Enter Your Life
  ('quran-tafsir', 'Let the Quran Enter Your Life', 'Sh. Dr. Ali Mohammed Salah', '33:08', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 11),
  
  -- 13. Why I rejected NBA
  ('motivational', 'Why I as a Muslim rejected NBA', 'Ibrahim Jaaber', '45:53', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 12),
  
  -- 14. The Justice of Islam
  ('fiqh', 'The Justice of Islam', 'Sh. Dr. Haitham al-Haddad', '41:50', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 13),
  
  -- 15. From Music to Nasheeds
  ('motivational', 'From Music to Nasheeds', 'Omar Esa', '41:59', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 14),
  
  -- 16. Challenges Facing Muslims in the West
  ('debates', 'Challenges Facing Muslims in the West', 'Adnan Rashid', '1:04:13', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 15),
  
  -- 17. The Modern Challenges of Faith
  ('aqeedah', 'The Modern Challenges of Faith', 'Sh. Dr. Haitham al-Haddad', '51:06', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 16),
  
  -- 18. Have Our Leaders Forsaken The Ummah?
  ('motivational', 'Have Our Leaders Forsaken The Ummah?', 'Sh. Hussain Yee', '1:01:20', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 17),
  
  -- 19. From Jahiliyya to Islam
  ('motivational', 'From Jahiliyya to Islam', 'Omar Esa', '20:25', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 18),
  
  -- 20. The Best in the Sight of Allah
  ('aqeedah', 'The Best in the Sight of Allah', 'Sh. Dr. Ali Mohammed Salah', '44:47', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 19),
  
  -- 21. Remember Me and I Shall Remember You
  ('motivational', 'Remember Me and I Shall Remember You', 'Sh. Riad Ouarzazi', '54:41', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 20),
  
  -- 22. How to Have Halal Fun
  ('youth', 'How to Have Halal Fun', 'Sh. Hussain Yee', '40:33', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 21),
  
  -- 23. Fall in Love with Allah
  ('motivational', 'Fall in Love with Allah', 'Sh. Dr. Haitham al Haddad', '34:25', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 22),
  
  -- 24. Islam Today: Holding on to Burning Ember
  ('aqeedah', 'Islam Today: Holding on to Burning Ember', 'Yusha Evans', '1:06:47', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 23),
  
  -- 25. Purification by the Remembrance of Allah
  ('motivational', 'Purification by the Remembrance of Allah', 'Sh. Riad Ouarzazi', '1:15:00', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 24),
  
  -- 26. Jesus Part 2
  ('debates', 'Jesus: The Man and His Message | Part 2', 'Yusha Evans', '1:01:29', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 25),
  
  -- 27. Jesus Part 1
  ('debates', 'Jesus: The Man and His Message | Part 1', 'Yusha Evans', '56:28', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 26),
  
  -- 28. Medicine of the Heart
  ('motivational', 'Medicine of the Heart', 'Sh. Dr. Haitham al Haddad', '1:03:28', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 27),
  
  -- 29. After the Blowing of Resurrection
  ('aqeedah', 'After the Blowing of Resurrection', 'Sh. Shady Alsuleiman', '48:37', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 28),
  
  -- 30. The Mercy of Allah
  ('motivational', 'The Mercy of Allah', 'Yusha Evans', '50:50', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 29),
  
  -- 31. Streets of Jahiliyyah
  ('motivational', 'Streets of Jahiliyyah to the Mosques of Allah', 'Imam Siraj Wahhaj', '48:01', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 30),
  
  -- 32. The Sky is the Limit
  ('motivational', 'The Sky is the Limit', 'Imam Siraj Wahhaj', '59:38', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 31),
  
  -- 33. Torments of the Grave
  ('aqeedah', 'Torments of the Grave', 'Sh. Shady Alsuleiman', '54:26', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 32),
  
  -- 34. Happy Marriage
  ('fiqh', 'How to Maintain a Happy Marriage', 'Sh. Dr. Haitham al-Haddad', '49:55', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 33),
  
  -- 35. Muhammad: Role Model
  ('seerah', 'Muhammad: The Role Model for the West', 'Yusha Evans', '1:07:40', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 34),
  
  -- 36. Black Magic Protection
  ('fiqh', 'This Is How You Can Protect Yourself from Black Magic', 'Sh. Dr. Ali Mohammed Salah', '48:40', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 35),
  
  -- 37. Better Worshiper
  ('aqeedah', 'How to Become a Better Worshiper of Allah', 'Sh. Dr. Haitham al-Haddad', '1:47:48', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 36),
  
  -- 38. Live the Quran
  ('quran-tafsir', 'How to Live the Quran?', 'Sh. Dr. Haitham al-Haddad', '52:23', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 37),
  
  -- 39. Where is Her Grave?
  ('seerah', 'Where is Her Grave?', 'Sh. Riad Ouarzazi', '30:58', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 38),
  
  -- 40. Enter Jannah
  ('motivational', 'Let Me Just Enter Jannah', 'Mohammad Hoblos', '46:24', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 39),
  
  -- 41. Islamic Reform
  ('aqeedah', 'Islamic Reform: Healthy or Destructive?', 'Sh. Dr. Haitham al-Haddad', '59:13', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 40),
  
  -- 42. Ikthilaf Among Scholars
  ('fiqh', 'Dealing With Ikthilaf Among Scholars', 'Sh. Dr. Haitham al-Haddad', '39:34', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 41),
  
  -- 43. Unite The Ummah
  ('motivational', 'How to Unite The Ummah?', 'Sh. Dr. Ali Mohammed Salah', '44:44', 
   'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/VIDEO_ID_HERE/hqdefault.jpg', 42);

-- Verify the insert
SELECT COUNT(*) as total_lectures FROM lectures;
SELECT category_id, COUNT(*) as count FROM lectures GROUP BY category_id ORDER BY category_id;
```

## Quick Search Guide

To find each video quickly:

1. Go to YouTube
2. Search: `"[Title]" Islam Net`
3. Look for videos from the "Islam Net" channel
4. Copy the video ID from the URL

## Thumbnail Quality Options

You can use different thumbnail qualities:

- `hqdefault.jpg` - High quality (recommended)
- `mqdefault.jpg` - Medium quality
- `maxresdefault.jpg` - Maximum quality (may not exist for all videos)
- `sddefault.jpg` - Standard quality

## After Running the Script

1. Check the Learning tab in your app
2. Verify thumbnails are displaying
3. Test that videos open correctly in YouTube
4. If any video doesn't work, search for it again and update the video ID
