
# Video Links Setup Guide

This guide explains how to fix broken video links in the Muslim-Space app and ensure all YouTube URLs are valid.

## Problem

The app currently has placeholder YouTube URLs in the `lectures` and `recitations` tables that may not point to valid videos. When users try to watch these videos, they see "This video isn't available anymore" messages.

## Solution

The app includes an automated system to import fresh, validated YouTube videos directly from YouTube's API. This ensures all video links are working and point to real Islamic content.

## Prerequisites

### 1. YouTube Data API v3 Setup

You need a YouTube Data API key to import videos. Follow these steps:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Name it something like "Muslim-Space-Videos"

2. **Enable YouTube Data API v3**
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
   - (Optional) Restrict the key to only YouTube Data API v3 for security

4. **Set API Key in Supabase**
   - Go to your Supabase project dashboard
   - Navigate to "Edge Functions" > "Manage secrets"
   - Add a new secret:
     - Name: `YOUTUBE_API_KEY`
     - Value: Your YouTube API key from step 3

## How to Import Videos

### Using the Admin Panel

1. **Open the Profile Screen**
   - Navigate to the Profile tab in the app
   - Tap the "Profile" header text 7 times quickly
   - The Admin Panel will appear

2. **Import Options**
   
   **Option A: Import Islamic Lectures**
   - Fetches 100 Islamic lecture videos from YouTube
   - Automatically categorizes them (Quran & Tafsir, Seerah, Aqeedah, Fiqh, etc.)
   - Validates each video URL before importing
   - Takes 2-5 minutes

   **Option B: Import Quran Recitations**
   - Fetches 100 Quran recitation videos from YouTube
   - Automatically categorizes them (Short Surahs, Long Surahs, Famous Qaris, etc.)
   - Validates each video URL before importing
   - Takes 2-5 minutes

   **Option C: Import All Videos**
   - Imports both lectures and recitations (up to 200 videos total)
   - Takes 5-10 minutes
   - Recommended for initial setup

3. **Clean Up Broken Videos**
   - Use the "Clean Up Broken Videos" button to scan and remove invalid URLs
   - This checks each video URL and removes any that are no longer available
   - Useful if you notice broken links after some time

## How the Import System Works

### 1. Video Search
The Edge Function searches YouTube using specific queries:
- **Lectures**: "Islamic lectures full lecture english"
- **Recitations**: "Quran recitation full surah beautiful"

### 2. Video Validation
Each video is validated to ensure:
- The video is public and embeddable
- The video is processed and available
- The video URL is accessible
- The video has proper metadata (title, duration, thumbnail)

### 3. Automatic Categorization
Videos are automatically categorized based on their titles:

**Lecture Categories:**
- `quran-tafsir`: Quran explanations and Tafsir
- `seerah`: Prophet Muhammad's biography
- `aqeedah`: Islamic beliefs and creed
- `fiqh`: Islamic jurisprudence and rulings
- `motivational`: Inspirational Islamic content
- `debates`: Islamic apologetics and debates
- `youth`: Content for young Muslims
- `short-clips`: Short Islamic reminders
- `general`: Other Islamic lectures

**Recitation Categories:**
- `short-surahs`: Short chapters of the Quran
- `long-surahs`: Long chapters of the Quran
- `emotional`: Emotional and heart-touching recitations
- `famous-qaris`: Recitations by famous Qaris
- `beautiful`: Beautiful recitations
- `general`: Other Quran recitations

### 4. Database Update
- Clears existing videos from the target table
- Inserts validated videos in batches
- Preserves proper ordering and metadata

## Troubleshooting

### "YouTube API key not configured"
- Make sure you've added `YOUTUBE_API_KEY` to Supabase Edge Function secrets
- Verify the API key is correct and hasn't been restricted too much
- Check that YouTube Data API v3 is enabled in your Google Cloud project

### "No videos found"
- The search query might be too specific
- Try importing again - YouTube's search results can vary
- Check your YouTube API quota (10,000 units per day by default)

### "Failed to import videos"
- Check the Supabase Edge Function logs for detailed error messages
- Verify your internet connection
- Ensure the Supabase project is active and not paused

### Videos still showing as broken
- Use the "Clean Up Broken Videos" button to remove invalid URLs
- Re-import videos using the import buttons
- Some videos may become unavailable over time - periodic re-imports are recommended

## API Quota Management

YouTube Data API v3 has a daily quota limit (10,000 units by default):
- Each search request costs ~100 units
- Each video details request costs ~1 unit per video
- Importing 100 videos uses approximately 200-300 units
- You can import videos multiple times per day without hitting the quota

To check your quota usage:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Dashboard"
3. Click on "YouTube Data API v3"
4. View the "Quotas" tab

## Best Practices

1. **Initial Setup**
   - Import all videos when first setting up the app
   - This ensures users have fresh, working content from day one

2. **Regular Maintenance**
   - Re-import videos every 1-3 months to keep content fresh
   - Use the cleanup tool to remove broken links periodically

3. **Content Quality**
   - The import system prioritizes embeddable, public videos
   - Videos are automatically filtered for appropriate content
   - Manual review of imported content is still recommended

4. **User Experience**
   - Inform users when new videos are added
   - Consider adding a "Last Updated" timestamp to the Learning tab
   - Monitor user feedback about video quality and relevance

## Manual Video Management

If you prefer to manually manage videos, you can:

1. **Add Videos Directly to Supabase**
   ```sql
   INSERT INTO lectures (category_id, title, speaker, duration, video_url, thumbnail_url, order_index)
   VALUES (
     'quran-tafsir',
     'Understanding Surah Al-Fatiha',
     'Sheikh Yasir Qadhi',
     '45:30',
     'https://www.youtube.com/watch?v=XXXXX',
     'https://i.ytimg.com/vi/XXXXX/hqdefault.jpg',
     0
   );
   ```

2. **Update Existing Videos**
   ```sql
   UPDATE lectures
   SET video_url = 'https://www.youtube.com/watch?v=XXXXX'
   WHERE id = 'video-uuid';
   ```

3. **Remove Broken Videos**
   ```sql
   DELETE FROM lectures WHERE video_url = 'broken-url';
   ```

## Support

If you encounter issues:
1. Check the Supabase Edge Function logs
2. Verify your YouTube API key is valid
3. Ensure your Supabase project has the correct tables and RLS policies
4. Review the console logs in the app for detailed error messages

## Future Enhancements

Potential improvements to the video import system:
- Add support for specific channels or playlists
- Implement video quality filtering
- Add language preferences
- Include video view counts and ratings
- Support for other video platforms
- Automated periodic imports via cron jobs
