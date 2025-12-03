
/**
 * Test script for importing a YouTube playlist
 * 
 * This is a helper file to demonstrate how to use the playlist import functionality.
 * 
 * To use this in the app:
 * 1. Go to Profile tab
 * 2. Tap the header 7 times to unlock Admin Panel
 * 3. Paste the playlist URL: https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN
 * 4. Click "Import Playlist"
 * 
 * The Edge Function will:
 * - Extract all videos from the playlist
 * - Fetch video details (title, duration, thumbnail)
 * - Automatically categorize each video based on keywords in the title
 * - Insert them into the lectures table with proper order_index
 * 
 * Categories:
 * - motivational: Inspirational, faith-building content
 * - debates: Apologetics, debates, refutations
 * - fiqh: Islamic jurisprudence, halal/haram rulings
 * - quran-tafsir: Quran explanation and tafsir
 * - youth: Content for young Muslims
 * - aqeedah: Islamic creed and beliefs
 * - seerah: Prophet's biography and Islamic history
 * 
 * Example playlist URL:
 * https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN
 */

import { importYouTubePlaylist, getLecturesByCategory } from './importYouTubePlaylist';

export async function testImportPlaylist() {
  const playlistUrl = 'https://www.youtube.com/playlist?list=PLIgUzcnbbNNUuXjNUW6YY4kFLZS73TwBN';
  
  console.log('Starting playlist import test...');
  console.log('Playlist URL:', playlistUrl);
  
  const result = await importYouTubePlaylist(playlistUrl);
  
  if (result.success) {
    console.log('✅ Import successful!');
    console.log(`Imported: ${result.imported} videos`);
    console.log(`Failed: ${result.failed} videos`);
    console.log(`Total: ${result.total} videos`);
    
    // Get category breakdown
    const categoryCounts = await getLecturesByCategory();
    console.log('\nCategory Breakdown:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} videos`);
    });
    
    if (result.failedTitles && result.failedTitles.length > 0) {
      console.log('\nFailed videos:');
      result.failedTitles.forEach(title => {
        console.log(`  - ${title}`);
      });
    }
  } else {
    console.error('❌ Import failed:', result.error);
  }
  
  return result;
}

// Example usage in the app:
// import { testImportPlaylist } from '@/utils/testPlaylistImport';
// await testImportPlaylist();
