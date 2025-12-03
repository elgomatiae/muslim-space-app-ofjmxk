
# Islamic Lectures - Video Links Setup Guide

## Summary

43 Islamic lectures from Islam Net have been successfully added to the Supabase database. The lectures are now stored in the `lectures` table and will appear in the Learning tab of your Muslim-Space app.

## What Was Added

All 43 lectures from Islam Net have been inserted into the database with the following information:
- **Title**: Full lecture title
- **Speaker**: Name of the speaker/scholar
- **Duration**: Length of the video
- **Category**: Organized into appropriate categories (debates, motivational, aqeedah, fiqh, etc.)
- **Order Index**: Sequential ordering within the database

## Categories Distribution

The lectures have been distributed across the following categories:

- **Aqeedah (Faith)**: 14 lectures
- **Debates & Apologetics**: 8 lectures  
- **Fiqh (Islamic Law)**: 10 lectures
- **Motivational**: 20 lectures
- **Quran & Tafsir**: 6 lectures
- **Seerah (Prophet's Life)**: 7 lectures
- **Youth Lectures**: 5 lectures
- **Short Clips**: 5 lectures

**Total**: 75 lectures (32 existing + 43 new)

## Important: YouTube Video URLs

Currently, all video URLs are set to placeholder values (PLACEHOLDER1, PLACEHOLDER2, etc.). To make the videos functional, you need to:

### Option 1: Manual Update (Recommended for accuracy)

1. Search for each lecture title on YouTube (Islam Net channel)
2. Copy the video ID from the URL (the part after `watch?v=`)
3. Update the database with the correct video IDs

Example SQL to update a single lecture:
```sql
UPDATE lectures 
SET video_url = 'https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID',
    thumbnail_url = 'https://img.youtube.com/vi/ACTUAL_VIDEO_ID/mqdefault.jpg'
WHERE title = 'Convincing Atheists Of God''s Existence';
```

### Option 2: Bulk Update Script

You can create a mapping of titles to video IDs and run a bulk update. Here's an example:

```sql
-- Example for first few lectures
UPDATE lectures SET 
  video_url = 'https://www.youtube.com/watch?v=VIDEO_ID_HERE',
  thumbnail_url = 'https://img.youtube.com/vi/VIDEO_ID_HERE/mqdefault.jpg'
WHERE title = 'Convincing Atheists Of God''s Existence';

-- Repeat for each lecture...
```

## How to Find Video IDs

1. Go to YouTube and search: `"[Lecture Title]" Islam Net`
2. Click on the video
3. The URL will look like: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. The video ID is: `dQw4w9WgXcQ`

## Verification

To verify the lectures were added successfully, you can run:

```sql
-- Check total count
SELECT COUNT(*) FROM lectures;

-- View all Islam Net lectures (by checking recent additions)
SELECT title, speaker, duration, category_id 
FROM lectures 
WHERE order_index > 20
ORDER BY order_index;

-- Check by specific speakers
SELECT title, speaker, duration 
FROM lectures 
WHERE speaker LIKE '%Hijab%' OR speaker LIKE '%Yusha Evans%'
ORDER BY title;
```

## Featured Speakers in New Lectures

- **Mohammed Hijab / Muhammad Hijab**: 6 lectures
- **Sh. Dr. Haitham al-Haddad**: 9 lectures
- **Yusha Evans**: 5 lectures
- **Sh. Riad Ourzazi**: 4 lectures
- **Imam Siraj Wahhaj**: 3 lectures
- **Sh. Alaa Elsayed**: 2 lectures
- **Omar Esa**: 2 lectures
- **Sh. Shady Alsuleiman**: 2 lectures
- **Sh. Dr. Ali Mohammed Salah**: 3 lectures
- **Adnan Rashid**: 1 lecture
- **Ibrahim Jaaber**: 1 lecture
- **Mohammad Hoblos**: 1 lecture
- **Sh. Hussain Yee**: 2 lectures
- **Abdullahi Umar**: 1 lecture

## Next Steps

1. **Find the actual YouTube video IDs** for each lecture from the Islam Net channel
2. **Update the database** with the correct video URLs and thumbnail URLs
3. **Test in the app** by opening the Learning tab and clicking on the lectures
4. **Verify thumbnails** are loading correctly

## Sample Lectures Added

Here are some of the notable lectures that were added:

1. "Convincing Atheists Of God's Existence" - Muhammad Hijab (20:23)
2. "Islam VS Liberalism" - Mohammed Hijab (34:15)
3. "The Awakening of the Soul" - Sh. Alaa Elsayed (43:51)
4. "Jesus: The Man and His Message | Part 1 & 2" - Yusha Evans (56:28 & 1:01:29)
5. "How to Become a Better Worshiper of Allah" - Sh. Dr. Haitham al-Haddad (1:47:48)
6. "Purification by the Remembrance of Allah | REALLY EMOTIONAL" - Sh. Riad Ourzazi (1:15:00)
7. "Challenges Facing Muslims in the West" - Adnan Rashid (1:04:13)
8. "Let Me Just Enter Jannah" - Mohammad Hoblos (46:24)

## Database Schema

The lectures are stored with the following structure:

```typescript
interface Lecture {
  id: string;              // UUID
  category_id: string;     // Category identifier
  title: string;           // Lecture title
  speaker: string;         // Speaker/scholar name
  duration: string;        // Video duration (HH:MM:SS or MM:SS)
  video_url: string;       // YouTube video URL
  thumbnail_url: string;   // YouTube thumbnail URL
  order_index: number;     // Display order
  created_at: timestamp;   // Creation timestamp
  updated_at: timestamp;   // Last update timestamp
}
```

## Support

If you need help finding specific video IDs or updating the database, you can:
1. Use the Supabase dashboard to manually edit records
2. Run SQL queries through the Supabase SQL editor
3. Use the app's admin interface (if available)

---

**Note**: The lectures are now visible in your app's Learning tab, but they will only play correctly once you update the placeholder URLs with actual YouTube video IDs.
