
# Quick Start Guide - Import Islam Net Lectures

## 🚀 Quick Steps

### 1. Set Up YouTube API Key (One-Time Setup)

**You've already enabled the YouTube Data API. Now you need to:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your API key (or create a new one if needed)
5. **Copy the API key**

### 2. Add API Key to Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `teemloiwfnwrogwnoxsa`
3. Navigate to **Project Settings** (gear icon in sidebar)
4. Click **Edge Functions** in the left menu
5. Scroll to **Secrets** section
6. Click **Add Secret**
7. Enter:
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: Paste your YouTube API key
8. Click **Save**

### 3. Import Lectures in the App

1. **Open your Muslim-Space app**
2. **Go to Profile tab** (bottom navigation)
3. **Tap "Profile" header 7 times quickly** (this unlocks the admin panel)
4. You'll see an alert: "Admin panel unlocked!"
5. **Scroll down to see the Admin Panel** (orange border)
6. **Tap "Import Islam Net Lectures (43)"** button
7. **Confirm** when prompted
8. **Wait 2-5 minutes** for the import to complete
9. You'll see a success message with import results

### 4. View Your Lectures

1. **Go to Learning tab** (bottom navigation)
2. **Select "Lectures"** tab at the top
3. **Browse categories**:
   - Motivational
   - Debates & Apologetics
   - Fiqh
   - Quran & Tafsir
   - Youth Lectures
   - Aqeedah
   - Seerah
4. **Tap any lecture** to watch on YouTube

## ✅ Verification Checklist

After import, verify:
- [ ] Lectures appear in Learning tab
- [ ] Thumbnails are displaying
- [ ] Videos open in YouTube when tapped
- [ ] All 7 categories are populated
- [ ] Admin panel shows correct lecture count (43)

## 🔧 Troubleshooting

### Import Button Does Nothing
- Check that you added the `YOUTUBE_API_KEY` secret in Supabase
- Make sure the API key is valid
- Check your internet connection

### Some Videos Failed to Import
- This is normal - some videos may have changed titles or been removed
- The import will skip failed videos and continue
- Check the success message for details on how many imported

### Thumbnails Not Loading
- Wait a few seconds for images to load
- Check your internet connection
- Some videos may have been removed from YouTube

### Videos Don't Open
- Make sure you have YouTube app installed (or a browser)
- Check that the video URLs are correct
- Some videos may be region-restricted

## 📊 Expected Results

After successful import:
- **Total Lectures**: 43
- **Categories**: 7
- **Speakers**: 13+ renowned Islamic scholars
- **Duration Range**: 7 minutes to 1 hour 47 minutes

## 🎯 What's Next?

After importing lectures:
1. Explore different categories
2. Watch lectures that interest you
3. Share with friends and family
4. Check back regularly for new content

## 💡 Pro Tips

- **Admin Panel**: Keep it unlocked if you need to import more content later
- **Re-import**: You can run the import again to refresh the data
- **Cleanup**: Use "Clean Up Broken Videos" button to remove invalid links
- **General Import**: Try "Import Islamic Lectures (100)" for more content from various channels

## 📞 Need Help?

If you encounter issues:
1. Check the app console logs (if you're a developer)
2. Check Supabase Edge Function logs in the dashboard
3. Verify your YouTube API key is valid
4. Make sure you have API quota remaining (check Google Cloud Console)

## 🎉 Success!

Once you see lectures in the Learning tab with working thumbnails and video links, you're all set! Enjoy your Islamic lecture library.

---

**Remember**: The YouTube API key is the only requirement. Once that's configured in Supabase, everything else is automatic! 🚀
