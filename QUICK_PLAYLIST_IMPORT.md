
# Quick Start: Import YouTube Playlist

## TL;DR

Import all videos from this playlist:
`https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN`

## Steps

1. **Open the app** and go to **Profile** tab

2. **Unlock Admin Panel**:
   - Tap the "Profile" header **7 times**
   - You'll see "Admin Panel unlocked!" message

3. **Find the import section**:
   - Scroll down to "Import from YouTube Playlist"

4. **Paste the playlist URL**:
   ```
   https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN
   ```

5. **Click "Import Playlist"**

6. **Wait for completion** (5-10 minutes)

7. **Review results**:
   - Number of videos imported
   - Category breakdown
   - Any failed videos

## What Happens

- ✅ All videos from the playlist are imported
- ✅ Each video is automatically categorized
- ✅ Proper YouTube URLs and thumbnails are set
- ✅ Videos appear in the Learning tab

## Categories

Videos are automatically sorted into:
- **Motivational** - Inspirational content
- **Debates** - Apologetics and debates
- **Fiqh** - Islamic law and rulings
- **Quran & Tafsir** - Quranic explanations
- **Youth** - Content for young Muslims
- **Aqeedah** - Islamic creed and beliefs
- **Seerah** - Prophet's biography and history

## Requirements

✅ YouTube Data API key must be configured in Supabase
- See `YOUTUBE_API_SETUP.md` if not set up yet

## Troubleshooting

**"YouTube API key not configured"**
→ Set `YOUTUBE_API_KEY` in Supabase Edge Function secrets

**"Invalid playlist URL"**
→ Make sure the URL contains `?list=` or `&list=`

**"No videos found"**
→ Check if the playlist is public

## That's It!

After import, go to the **Learning** tab to see all the imported lectures organized by category.

---

For detailed documentation, see:
- `YOUTUBE_PLAYLIST_IMPORT_GUIDE.md` - Complete guide
- `PLAYLIST_IMPORT_IMPLEMENTATION.md` - Technical details
