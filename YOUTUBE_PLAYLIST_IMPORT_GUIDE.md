
# YouTube Playlist Import Guide

This guide explains how to import videos from any YouTube playlist into the Islamic lectures database.

## Overview

The playlist import feature allows you to:
- Import all videos from any YouTube playlist
- Automatically categorize videos based on their titles
- Extract proper video URLs and thumbnail URLs
- Maintain proper ordering within categories

## Prerequisites

1. **YouTube Data API Key**: You must have a valid YouTube Data API key configured in Supabase Edge Function secrets
   - Secret name: `YOUTUBE_API_KEY`
   - See `YOUTUBE_API_SETUP.md` for instructions on getting an API key

2. **Supabase Configuration**: Your Supabase project must be properly configured with:
   - `SUPABASE_URL` environment variable
   - `SUPABASE_SERVICE_ROLE_KEY` environment variable

## How to Use

### Method 1: Using the Admin Panel (Recommended)

1. Open the app and navigate to the **Profile** tab
2. Tap the "Profile" header **7 times** to unlock the Admin Panel
3. Scroll down to the "Import from YouTube Playlist" section
4. Paste your YouTube playlist URL in the input field
   - Example: `https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN`
5. Click the **"Import Playlist"** button
6. Wait for the import to complete (this may take several minutes)
7. Review the results showing:
   - Number of videos imported
   - Number of videos failed
   - Category breakdown

### Method 2: Programmatically

```typescript
import { importYouTubePlaylist } from '@/utils/importYouTubePlaylist';

const result = await importYouTubePlaylist(
  'https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN'
);

if (result.success) {
  console.log(`Imported ${result.imported} videos`);
} else {
  console.error('Import failed:', result.error);
}
```

## Automatic Categorization

Videos are automatically categorized based on keywords in their titles:

### Categories

1. **Motivational** (`motivational`)
   - Keywords: motivat, inspir, heart, emotional, powerful, mercy, love, hope, faith, iman, dua, allah, blessing, gratitude, patience, sabr

2. **Debates & Apologetics** (`debates`)
   - Keywords: debate, atheist, atheism, christian, liberal, secular, defend, refut, vs, argument, proof, evidence

3. **Fiqh** (`fiqh`)
   - Keywords: fiqh, halal, haram, marriage, divorce, finance, law, ruling, permissible, forbidden, scholar, fatwa

4. **Quran & Tafsir** (`quran-tafsir`)
   - Keywords: quran, qur'an, tafsir, tafseer, surah, ayah, verse, recitation, al-fatiha, al-baqarah, etc.

5. **Youth** (`youth`)
   - Keywords: youth, young, student, social media, music, peer pressure, identity, modern, challenge, west, generation

6. **Aqeedah** (`aqeedah`)
   - Keywords: aqeedah, aqidah, belief, creed, tawheed, tawhid, names of allah, attributes, destiny, qadar, angel, jinn, magic, ummah, unity

7. **Seerah** (`seerah`)
   - Keywords: seerah, sirah, prophet, muhammad, pbuh, messenger, companion, sahaba, battle, hijrah, makkah, madinah, jesus, grave, resurrection, judgment, hereafter, afterlife

8. **Short Clips** (`short-clips`)
   - Videos under 10 minutes are automatically categorized as short clips

## Example: Importing the Islam Net Playlist

The playlist `https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN` contains Islamic lectures that will be automatically categorized.

### Steps:

1. Copy the playlist URL: `https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN`
2. Open the app and go to Profile tab
3. Unlock Admin Panel (tap header 7 times)
4. Paste the URL in the "Import from YouTube Playlist" input field
5. Click "Import Playlist"
6. Wait for completion (may take 5-10 minutes depending on playlist size)

### Expected Results:

- All videos from the playlist will be imported
- Each video will be assigned to a category based on its title
- Videos will have proper YouTube URLs and thumbnail URLs
- Order index will be maintained within each category

## Technical Details

### Edge Function: `import-youtube-playlist`

The import is handled by a Supabase Edge Function that:

1. **Extracts Playlist ID** from the URL
2. **Fetches All Videos** using YouTube Data API v3
   - Uses pagination to get all videos (50 per page)
   - Fetches video details including duration
3. **Processes Each Video**:
   - Extracts speaker name from title or channel
   - Categorizes based on title keywords
   - Parses ISO 8601 duration to readable format
   - Generates proper YouTube URL and thumbnail URL
4. **Inserts into Database**:
   - Inserts into `lectures` table
   - Maintains proper `order_index` per category
   - Handles errors gracefully

### Database Schema

Videos are inserted into the `lectures` table:

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

## Troubleshooting

### Error: "YouTube API key not configured"

**Solution**: Make sure `YOUTUBE_API_KEY` is set in Supabase Edge Function secrets.

### Error: "Invalid playlist URL"

**Solution**: Ensure the URL is a valid YouTube playlist URL containing `?list=` or `&list=`.

### Error: "No videos found in the playlist"

**Possible causes**:
- The playlist is empty
- The playlist is private
- The API key doesn't have permission to access the playlist

### Error: "Failed to fetch playlist"

**Possible causes**:
- API key is invalid or expired
- API quota exceeded
- Network connectivity issues

### Some videos failed to import

**Possible causes**:
- Videos are private or deleted
- Videos are age-restricted
- Database insertion errors (check logs)

## API Quota Considerations

YouTube Data API has daily quotas:
- **Default quota**: 10,000 units per day
- **Playlist items list**: 1 unit per request (50 videos)
- **Videos list**: 1 unit per request (50 videos)

**Example**: Importing a 100-video playlist uses approximately:
- 2 units for playlist items (2 pages × 1 unit)
- 2 units for video details (2 pages × 1 unit)
- **Total**: ~4 units

## Best Practices

1. **Test with small playlists first** to ensure everything works
2. **Monitor API quota usage** in Google Cloud Console
3. **Import during off-peak hours** if you have many playlists to import
4. **Review categorization** after import and manually adjust if needed
5. **Keep track of failed videos** and investigate why they failed

## Support

If you encounter issues:
1. Check the Edge Function logs in Supabase Dashboard
2. Verify your YouTube API key is valid
3. Ensure the playlist is public
4. Check your API quota in Google Cloud Console

## Related Documentation

- `YOUTUBE_API_SETUP.md` - How to get a YouTube Data API key
- `ISLAM_NET_LECTURES_IMPORT_GUIDE.md` - Original lecture import guide
- `DATABASE_POPULATION_GUIDE.md` - General database population guide
