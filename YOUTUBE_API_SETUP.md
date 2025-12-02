
# YouTube API Setup Guide

This guide will help you set up the YouTube Data API v3 to enable importing Islamic lectures and Quran recitations from YouTube.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Muslim-Space-App")
5. Click "Create"

## Step 2: Enable YouTube Data API v3

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and then click "Enable"

## Step 3: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key that is generated
4. (Optional but recommended) Click "Restrict Key" to add restrictions:
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3" from the dropdown
   - Click "Save"

## Step 4: Add API Key to Supabase Edge Function

1. Go to your Supabase project dashboard
2. Navigate to "Edge Functions" > "Secrets"
3. Add a new secret:
   - Name: `YOUTUBE_API_KEY`
   - Value: [Your YouTube API key from Step 3]
4. Click "Save"

## Step 5: Import Videos

1. Open the Muslim-Space app
2. Go to the Profile tab
3. Tap on the "Profile" header text 7 times to unlock the Admin Panel
4. Use the import buttons to fetch videos from YouTube:
   - "Import Islamic Lectures" - Imports 100 Islamic lecture videos
   - "Import Quran Recitations" - Imports 100 Quran recitation videos
   - "Import All Videos" - Imports both (200 videos total)

## Important Notes

- The YouTube Data API has a daily quota limit of 10,000 units per day
- Each search request costs 100 units
- Each video details request costs 1 unit per video
- Importing 100 videos will use approximately 200-300 units
- If you hit the quota limit, you'll need to wait until the next day (midnight Pacific Time)

## Troubleshooting

### "YouTube API key not configured" error
- Make sure you added the `YOUTUBE_API_KEY` secret to your Supabase Edge Function
- Verify the secret name is exactly `YOUTUBE_API_KEY` (case-sensitive)
- Redeploy the Edge Function if you just added the secret

### "Quota exceeded" error
- You've hit the daily quota limit
- Wait until midnight Pacific Time for the quota to reset
- Consider requesting a quota increase from Google Cloud Console

### Videos not importing
- Check the Supabase Edge Function logs for errors
- Verify your API key is valid and has the YouTube Data API v3 enabled
- Make sure your API key restrictions (if any) allow the YouTube Data API v3

## API Quota Management

To check your API usage:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Dashboard"
3. Click on "YouTube Data API v3"
4. View your quota usage under the "Quotas" tab

## Video Categorization

The import function automatically categorizes videos based on their titles:

### Lectures Categories:
- `quran-tafsir` - Quran and Tafsir related content
- `seerah` - Prophet Muhammad's biography
- `aqeedah` - Islamic beliefs and faith
- `fiqh` - Islamic jurisprudence
- `motivational` - Motivational and inspirational content
- `debates` - Debates and apologetics
- `youth` - Youth-focused content
- `short-clips` - Short video clips
- `general` - General Islamic content

### Recitations Categories:
- `short-surahs` - Short Surahs
- `long-surahs` - Long Surahs and Juz
- `emotional` - Emotional recitations
- `famous-qaris` - Famous Qaris
- `beautiful` - Beautiful recitations
- `general` - General recitations

The categorization is done automatically based on keywords in the video title.
