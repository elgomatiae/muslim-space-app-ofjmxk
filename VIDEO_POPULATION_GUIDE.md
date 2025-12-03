
# Islam Net Lectures - Video Population Guide

## Problem
The lectures in the database don't have valid YouTube URLs and thumbnails aren't displaying.

## Solution Options

### Option 1: Manual Entry (Recommended for Accuracy)

To add the Islam Net lectures with accurate video URLs, you need to:

1. **Find each video on YouTube** by searching for the title + "Islam Net"
2. **Extract the video ID** from the URL
   - Example: `https://www.youtube.com/watch?v=ABC123xyz` → Video ID is `ABC123xyz`
3. **Use the SQL script below** to insert the videos

#### How to Extract Video IDs

1. Go to YouTube and search: `"Convincing Atheists Of God's Existence" Islam Net`
2. Click on the video
3. Copy the URL from your browser
4. The video ID is the part after `v=` in the URL

Example URLs:
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → ID: `dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ` → ID: `dQw4w9WgXcQ`

#### SQL Template

Once you have the video IDs, use this format:

```sql
INSERT INTO lectures (category_id, title, speaker, duration, video_url, thumbnail_url, order_index)
VALUES
  ('debates', 'Convincing Atheists Of God''s Existence', 'Muhammad Hijab', '20:23', 
   'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE', 
   'https://i.ytimg.com/vi/YOUR_VIDEO_ID_HERE/hqdefault.jpg', 0),
  -- Add more videos here...
```

### Option 2: Use YouTube Data API (Automated)

If you want to automate this process:

1. **Get a YouTube Data API key** from Google Cloud Console
2. **Use the Edge Function** we can create to search and populate videos automatically
3. **Set the API key** as an environment variable in Supabase

#### Steps to Get YouTube API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. Copy the API key

#### Add API Key to Supabase:

```bash
# In Supabase Dashboard:
# Settings → Edge Functions → Add Secret
# Name: YOUTUBE_API_KEY
# Value: Your API key
```

### Option 3: Bulk Import from CSV

Create a CSV file with the following columns:
```
title,speaker,duration,video_id,category_id
"Convincing Atheists Of God's Existence","Muhammad Hijab","20:23","ABC123xyz","debates"
```

Then use the Supabase dashboard to import the CSV into the `lectures` table.

## Video List to Populate

Here are all 43 Islam Net lectures that need to be added:

1. Convincing Atheists Of God's Existence | Muhammad Hijab (20:23) - debates
2. It's time to get strong! Mohammed Hijab Khutbah (34:57) - motivational
3. Powerful Khutbah By Mohammed Hijab (26:12) - motivational
4. Embrace Allah's Blessings: A Guide to Gratitude | Abdullahi Umar (8:46) - motivational
5. The Awakening of the Soul | Sh. Alaa Elsayed (43:51) - aqeedah
6. MOHAMMED HIJAB DEFEND'S FEMALE SPEAKERS (30:51) - debates
7. In Search of Allah | Sh. Alaa Elsayed (44:19) - aqeedah
8. WATCH OUT: DANGERS of marrying TOO YOUNG! (7:22) - fiqh
9. The Neglected Truth: Journey through the Hereafter (47:42) - aqeedah
10. Ambassadors of Islam | Imam Siraj Wahhaj (33:33) - motivational
11. Islam VS Liberalism | Mohammed Hijab (34:15) - debates
12. Let the Quran Enter Your Life (33:08) - quran-tafsir
13. Why I as a Muslim rejected NBA | Ibrahim Jaaber (45:53) - motivational
14. The Justice of Islam (41:50) - fiqh
15. From Music to Nasheeds | Omar Esa (41:59) - motivational
16. Challenges Facing Muslims in the West (1:04:13) - debates
17. The Modern Challenges of Faith (51:06) - aqeedah
18. Have Our Leaders Forsaken The Ummah? (1:01:20) - motivational
19. From Jahiliyya to Islam | Omar Esa (20:25) - motivational
20. The Best in the Sight of Allah (44:47) - aqeedah
21. Remember Me and I Shall Remember You (54:41) - motivational
22. How to Have Halal Fun | Sh. Hussain Yee (40:33) - youth
23. Fall in Love with Allah (34:25) - motivational
24. Islam Today: Holding on to Burning Ember (1:06:47) - aqeedah
25. Purification by the Remembrance of Allah (1:15:00) - motivational
26. Jesus: The Man and His Message | Part 2 (1:01:29) - debates
27. Jesus: The Man and His Message | Part 1 (56:28) - debates
28. Medicine of the Heart (1:03:28) - motivational
29. After the Blowing of Resurrection (48:37) - aqeedah
30. The Mercy of Allah | Yusha Evans (50:50) - motivational
31. Streets of Jahiliyyah to the Mosques of Allah (48:01) - motivational
32. The Sky is the Limit | Imam Siraj Wahhaj (59:38) - motivational
33. Torments of the Grave (54:26) - aqeedah
34. How to Maintain a Happy Marriage (49:55) - fiqh
35. Muhammad: The Role Model for the West (1:07:40) - seerah
36. This Is How You Can Protect Yourself from Black Magic (48:40) - fiqh
37. How to Become a Better Worshiper of Allah (1:47:48) - aqeedah
38. How to Live the Quran? (52:23) - quran-tafsir
39. Where is Her Grave? | Sh. Riad Ouarzazi (30:58) - seerah
40. Let Me Just Enter Jannah | Mohammad Hoblos (46:24) - motivational
41. Islamic Reform: Healthy or Destructive? (59:13) - aqeedah
42. Dealing With Ikthilaf Among Scholars (39:34) - fiqh
43. How to Unite The Ummah? (44:44) - motivational

## Thumbnail URL Format

YouTube thumbnails follow this pattern:
- High Quality: `https://i.ytimg.com/vi/{VIDEO_ID}/hqdefault.jpg`
- Max Quality: `https://i.ytimg.com/vi/{VIDEO_ID}/maxresdefault.jpg`
- Medium Quality: `https://i.ytimg.com/vi/{VIDEO_ID}/mqdefault.jpg`

We recommend using `hqdefault.jpg` for consistent quality across all videos.

## Testing

After adding videos, test by:
1. Opening the Learning tab in the app
2. Clicking on a lecture card
3. Verifying it opens the correct YouTube video
4. Checking that thumbnails display properly

## Troubleshooting

**Thumbnails not showing:**
- Verify the video ID is correct
- Check that the video is public (not private or unlisted)
- Try using a different thumbnail quality (hqdefault, mqdefault, maxresdefault)

**Videos not playing:**
- Ensure the video URL format is: `https://www.youtube.com/watch?v={VIDEO_ID}`
- Verify the video hasn't been deleted or made private
- Check that the video ID is correct
