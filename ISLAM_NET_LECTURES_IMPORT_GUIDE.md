
# Islam Net Lectures Import Guide

## Overview
This guide explains how to import 43 Islamic lectures from Islam Net into your Muslim-Space app using the YouTube Data API.

## Prerequisites

### 1. YouTube Data API Key
You need a valid YouTube Data API key from Google Cloud Console. If you haven't set this up yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

### 2. Configure Supabase Edge Function Secret
The API key needs to be stored as a secret in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions**
3. Add a new secret:
   - Name: `YOUTUBE_API_KEY`
   - Value: Your YouTube API key from step 1

## Import Process

### Method 1: Using the Admin Panel (Recommended)

1. **Open the App**
   - Navigate to the Profile tab in your app

2. **Unlock Admin Panel**
   - Tap the "Profile" header text 7 times quickly
   - You'll see an "Admin Panel unlocked!" alert

3. **Import Islam Net Lectures**
   - In the Admin Panel, you'll see a section titled "Islam Net Lectures (Recommended)"
   - Tap the **"Import Islam Net Lectures (43)"** button
   - Confirm the import when prompted
   - Wait for the process to complete (may take 2-5 minutes)

4. **Verify Import**
   - The admin panel shows the current lecture count
   - Navigate to the Learning tab to see the imported lectures
   - Videos should have proper thumbnails and working YouTube links

### Method 2: Using Supabase Edge Function Directly

You can also call the Edge Function directly using curl or any HTTP client:

```bash
curl -X POST 'https://teemloiwfnwrogwnoxsa.supabase.co/functions/v1/import-islam-net-lectures' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## What Gets Imported

The import includes 43 lectures organized into 7 categories:

### Categories:
1. **Motivational** (17 lectures)
   - Speakers: Muhammad Hijab, Sh. Alaa Elsayed, Sh. Riad Ourzazi, Imam Siraj Wahhaj, Omar Esa, Yusha Evans, Mohammad Hoblos

2. **Debates & Apologetics** (2 lectures)
   - Speaker: Mohammed Hijab

3. **Fiqh** (5 lectures)
   - Speakers: Sh. Haitham al-Haddad, Sh. Hussain Yee

4. **Quran & Tafsir** (2 lectures)
   - Speakers: Sh. Dr. Ali Mohammed Salah, Sh. Dr. Haitham al-Haddad

5. **Youth Lectures** (5 lectures)
   - Speakers: Ibrahim Jaaber, Omar Esa, Adnan Rashid, Yusha Evans

6. **Aqeedah** (6 lectures)
   - Speakers: Sh. Hussain Yee, Sh. Dr. Haitham al-Haddad, Sh. Dr. Ali Mohammed Salah

7. **Seerah** (6 lectures)
   - Speakers: Sh. Shady Alsuleiman, Yusha Evans, Sh. Riad Ourzazi

## How It Works

The Edge Function:
1. Searches YouTube for each lecture title using the YouTube Data API
2. Finds the matching video from the Islam Net channel
3. Extracts the video ID and constructs proper URLs:
   - Video URL: `https://www.youtube.com/watch?v={VIDEO_ID}`
   - Thumbnail URL: `https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg`
4. Inserts the lecture data into the Supabase `lectures` table

## Troubleshooting

### Import Failed
- **Check API Key**: Ensure `YOUTUBE_API_KEY` is correctly set in Supabase Edge Function secrets
- **API Quota**: YouTube Data API has daily quotas. If exceeded, wait 24 hours or request quota increase
- **Network Issues**: Ensure stable internet connection

### Videos Not Found
- Some videos may not be found if:
  - The video title has changed on YouTube
  - The video was removed or made private
  - The search query doesn't match exactly
- The import will skip videos that can't be found and report them in the results

### Thumbnails Not Loading
- Thumbnails use YouTube's standard thumbnail URL format
- If thumbnails don't load, the video may be private or deleted
- You can manually update thumbnail URLs in the database if needed

## Database Structure

The `lectures` table has the following structure:

```sql
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Manual Import Alternative

If the automated import doesn't work, you can manually search for each video on YouTube and insert them using SQL:

```sql
INSERT INTO lectures (category_id, title, speaker, duration, video_url, thumbnail_url, order_index)
VALUES (
  'motivational',
  'Convincing Atheists Of God''s Existence',
  'Muhammad Hijab',
  '20:23',
  'https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID',
  'https://img.youtube.com/vi/ACTUAL_VIDEO_ID/mqdefault.jpg',
  1
);
```

## Support

If you encounter issues:
1. Check the Supabase Edge Function logs for detailed error messages
2. Verify your YouTube API key is valid and has quota remaining
3. Ensure the Edge Function secret is properly configured
4. Check the app console logs for any client-side errors

## Next Steps

After importing:
1. Navigate to the Learning tab to view the lectures
2. Test video playback by tapping on a lecture
3. Verify thumbnails are displaying correctly
4. Check that categories are properly organized

The lectures will open in the device's default YouTube app or browser when tapped.
