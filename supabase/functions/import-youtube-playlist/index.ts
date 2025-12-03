
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface PlaylistVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  channelTitle: string;
}

// Function to extract playlist ID from URL
function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

// Function to categorize videos for lectures based on title keywords
function categorizeVideoForLectures(title: string, speaker: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerSpeaker = speaker.toLowerCase();
  
  // Motivational keywords
  if (
    lowerTitle.includes('motivat') ||
    lowerTitle.includes('inspir') ||
    lowerTitle.includes('heart') ||
    lowerTitle.includes('emotional') ||
    lowerTitle.includes('powerful') ||
    lowerTitle.includes('mercy') ||
    lowerTitle.includes('love') ||
    lowerTitle.includes('hope') ||
    lowerTitle.includes('faith') ||
    lowerTitle.includes('iman') ||
    lowerTitle.includes('dua') ||
    lowerTitle.includes('allah') ||
    lowerTitle.includes('blessing') ||
    lowerTitle.includes('gratitude') ||
    lowerTitle.includes('patience') ||
    lowerTitle.includes('sabr')
  ) {
    return 'motivational';
  }
  
  // Debates & Apologetics keywords
  if (
    lowerTitle.includes('debate') ||
    lowerTitle.includes('atheist') ||
    lowerTitle.includes('atheism') ||
    lowerTitle.includes('christian') ||
    lowerTitle.includes('liberal') ||
    lowerTitle.includes('secular') ||
    lowerTitle.includes('defend') ||
    lowerTitle.includes('refut') ||
    lowerTitle.includes('vs') ||
    lowerTitle.includes('argument') ||
    lowerTitle.includes('proof') ||
    lowerTitle.includes('evidence')
  ) {
    return 'debates';
  }
  
  // Fiqh keywords
  if (
    lowerTitle.includes('fiqh') ||
    lowerTitle.includes('halal') ||
    lowerTitle.includes('haram') ||
    lowerTitle.includes('marriage') ||
    lowerTitle.includes('divorce') ||
    lowerTitle.includes('finance') ||
    lowerTitle.includes('law') ||
    lowerTitle.includes('ruling') ||
    lowerTitle.includes('permissible') ||
    lowerTitle.includes('forbidden') ||
    lowerTitle.includes('scholar') ||
    lowerTitle.includes('fatwa')
  ) {
    return 'fiqh';
  }
  
  // Quran & Tafsir keywords
  if (
    lowerTitle.includes('quran') ||
    lowerTitle.includes('qur\'an') ||
    lowerTitle.includes('tafsir') ||
    lowerTitle.includes('tafseer') ||
    lowerTitle.includes('surah') ||
    lowerTitle.includes('ayah') ||
    lowerTitle.includes('verse') ||
    lowerTitle.includes('recitation') ||
    lowerTitle.includes('al-') && (
      lowerTitle.includes('fatiha') ||
      lowerTitle.includes('baqarah') ||
      lowerTitle.includes('imran') ||
      lowerTitle.includes('kahf') ||
      lowerTitle.includes('yaseen') ||
      lowerTitle.includes('rahman') ||
      lowerTitle.includes('mulk')
    )
  ) {
    return 'quran-tafsir';
  }
  
  // Youth keywords
  if (
    lowerTitle.includes('youth') ||
    lowerTitle.includes('young') ||
    lowerTitle.includes('student') ||
    lowerTitle.includes('social media') ||
    lowerTitle.includes('music') ||
    lowerTitle.includes('peer pressure') ||
    lowerTitle.includes('identity') ||
    lowerTitle.includes('modern') ||
    lowerTitle.includes('challenge') ||
    lowerTitle.includes('west') ||
    lowerTitle.includes('generation')
  ) {
    return 'youth';
  }
  
  // Aqeedah keywords
  if (
    lowerTitle.includes('aqeedah') ||
    lowerTitle.includes('aqidah') ||
    lowerTitle.includes('belief') ||
    lowerTitle.includes('creed') ||
    lowerTitle.includes('tawheed') ||
    lowerTitle.includes('tawhid') ||
    lowerTitle.includes('names of allah') ||
    lowerTitle.includes('attributes') ||
    lowerTitle.includes('destiny') ||
    lowerTitle.includes('qadar') ||
    lowerTitle.includes('angel') ||
    lowerTitle.includes('jinn') ||
    lowerTitle.includes('magic') ||
    lowerTitle.includes('black magic') ||
    lowerTitle.includes('ummah') ||
    lowerTitle.includes('unity')
  ) {
    return 'aqeedah';
  }
  
  // Seerah keywords
  if (
    lowerTitle.includes('seerah') ||
    lowerTitle.includes('sirah') ||
    lowerTitle.includes('prophet') ||
    lowerTitle.includes('muhammad') ||
    lowerTitle.includes('pbuh') ||
    lowerTitle.includes('messenger') ||
    lowerTitle.includes('companion') ||
    lowerTitle.includes('sahaba') ||
    lowerTitle.includes('battle') ||
    lowerTitle.includes('hijrah') ||
    lowerTitle.includes('makkah') ||
    lowerTitle.includes('madinah') ||
    lowerTitle.includes('jesus') ||
    lowerTitle.includes('grave') ||
    lowerTitle.includes('resurrection') ||
    lowerTitle.includes('judgment') ||
    lowerTitle.includes('hereafter') ||
    lowerTitle.includes('afterlife')
  ) {
    return 'seerah';
  }
  
  // Default to motivational if no clear category
  return 'motivational';
}

// Function to categorize videos for recitations based on title keywords
function categorizeVideoForRecitations(title: string, reciter: string): string {
  const lowerTitle = title.toLowerCase();
  
  // Short Surahs (Juz Amma - Surah 78-114)
  if (
    lowerTitle.includes('juz amma') ||
    lowerTitle.includes('juz 30') ||
    lowerTitle.includes('al-naba') ||
    lowerTitle.includes('an-naziat') ||
    lowerTitle.includes('abasa') ||
    lowerTitle.includes('at-takwir') ||
    lowerTitle.includes('al-infitar') ||
    lowerTitle.includes('al-mutaffifin') ||
    lowerTitle.includes('al-inshiqaq') ||
    lowerTitle.includes('al-buruj') ||
    lowerTitle.includes('at-tariq') ||
    lowerTitle.includes('al-ala') ||
    lowerTitle.includes('al-ghashiyah') ||
    lowerTitle.includes('al-fajr') ||
    lowerTitle.includes('al-balad') ||
    lowerTitle.includes('ash-shams') ||
    lowerTitle.includes('al-lail') ||
    lowerTitle.includes('ad-duha') ||
    lowerTitle.includes('ash-sharh') ||
    lowerTitle.includes('at-tin') ||
    lowerTitle.includes('al-alaq') ||
    lowerTitle.includes('al-qadr') ||
    lowerTitle.includes('al-bayyinah') ||
    lowerTitle.includes('az-zalzalah') ||
    lowerTitle.includes('al-adiyat') ||
    lowerTitle.includes('al-qariah') ||
    lowerTitle.includes('at-takathur') ||
    lowerTitle.includes('al-asr') ||
    lowerTitle.includes('al-humazah') ||
    lowerTitle.includes('al-fil') ||
    lowerTitle.includes('quraish') ||
    lowerTitle.includes('al-maun') ||
    lowerTitle.includes('al-kawthar') ||
    lowerTitle.includes('al-kafirun') ||
    lowerTitle.includes('an-nasr') ||
    lowerTitle.includes('al-masad') ||
    lowerTitle.includes('al-ikhlas') ||
    lowerTitle.includes('al-falaq') ||
    lowerTitle.includes('an-nas') ||
    lowerTitle.includes('short surah')
  ) {
    return 'short-surahs';
  }
  
  // Long Surahs
  if (
    lowerTitle.includes('al-baqarah') ||
    lowerTitle.includes('ali imran') ||
    lowerTitle.includes('an-nisa') ||
    lowerTitle.includes('al-maidah') ||
    lowerTitle.includes('al-anam') ||
    lowerTitle.includes('al-araf') ||
    lowerTitle.includes('al-anfal') ||
    lowerTitle.includes('at-tawbah') ||
    lowerTitle.includes('yunus') ||
    lowerTitle.includes('hud') ||
    lowerTitle.includes('yusuf') ||
    lowerTitle.includes('ar-rad') ||
    lowerTitle.includes('ibrahim') ||
    lowerTitle.includes('al-hijr') ||
    lowerTitle.includes('an-nahl') ||
    lowerTitle.includes('al-isra') ||
    lowerTitle.includes('al-kahf') ||
    lowerTitle.includes('maryam') ||
    lowerTitle.includes('ta-ha') ||
    lowerTitle.includes('long surah')
  ) {
    return 'long-surahs';
  }
  
  // Emotional recitations
  if (
    lowerTitle.includes('emotional') ||
    lowerTitle.includes('crying') ||
    lowerTitle.includes('tears') ||
    lowerTitle.includes('heart touching') ||
    lowerTitle.includes('beautiful') ||
    lowerTitle.includes('powerful')
  ) {
    return 'emotional';
  }
  
  // Famous Qaris
  if (
    lowerTitle.includes('mishary') ||
    lowerTitle.includes('sudais') ||
    lowerTitle.includes('shuraim') ||
    lowerTitle.includes('ajmi') ||
    lowerTitle.includes('ghamdi') ||
    lowerTitle.includes('husary') ||
    lowerTitle.includes('minshawi') ||
    lowerTitle.includes('basfar') ||
    lowerTitle.includes('jibreen') ||
    reciter.toLowerCase().includes('mishary') ||
    reciter.toLowerCase().includes('sudais') ||
    reciter.toLowerCase().includes('shuraim')
  ) {
    return 'famous-qaris';
  }
  
  // Default to beautiful recitations
  return 'beautiful';
}

// Function to fetch all videos from a playlist
async function fetchPlaylistVideos(playlistId: string): Promise<PlaylistVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  const videos: PlaylistVideo[] = [];
  let nextPageToken: string | undefined;
  
  try {
    do {
      // Fetch playlist items
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      
      console.log(`Fetching playlist page...`);
      const playlistResponse = await fetch(playlistUrl);
      
      if (!playlistResponse.ok) {
        const errorText = await playlistResponse.text();
        console.error(`YouTube API error: ${playlistResponse.status} ${playlistResponse.statusText}`);
        console.error(`Error details: ${errorText}`);
        throw new Error(`Failed to fetch playlist: ${playlistResponse.statusText}`);
      }

      const playlistData = await playlistResponse.json();
      
      if (!playlistData.items || playlistData.items.length === 0) {
        break;
      }

      // Get video IDs for this batch
      const videoIds = playlistData.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .filter((id: string) => id);

      if (videoIds.length === 0) {
        break;
      }

      // Fetch video details (including duration)
      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
      
      const videoDetailsResponse = await fetch(videoDetailsUrl);
      
      if (!videoDetailsResponse.ok) {
        console.error(`Failed to fetch video details: ${videoDetailsResponse.statusText}`);
        continue;
      }

      const videoDetailsData = await videoDetailsResponse.json();
      
      // Process each video
      for (const video of videoDetailsData.items) {
        const videoId = video.id;
        const title = video.snippet.title;
        const channelTitle = video.snippet.channelTitle;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        
        // Parse ISO 8601 duration (e.g., PT1H2M10S)
        const duration = parseDuration(video.contentDetails.duration);
        
        videos.push({
          videoId,
          title,
          thumbnailUrl,
          duration,
          channelTitle,
        });
        
        console.log(`Found video: ${title} (${duration})`);
      }

      nextPageToken = playlistData.nextPageToken;
    } while (nextPageToken);

    console.log(`Total videos found: ${videos.length}`);
    return videos;
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
}

// Function to parse ISO 8601 duration to readable format
function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) {
    return '0:00';
  }

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Function to extract speaker/reciter name from title
function extractSpeaker(title: string, channelTitle: string): string {
  // Common patterns for speaker names in titles
  const patterns = [
    /\|\s*([^|]+)$/,  // "Title | Speaker Name"
    /by\s+([^-|]+)/i,  // "Title by Speaker Name"
    /-\s*([^-|]+)$/,   // "Title - Speaker Name"
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      const speaker = match[1].trim();
      // Clean up common suffixes
      return speaker
        .replace(/\(.*?\)/g, '')  // Remove parentheses
        .replace(/\[.*?\]/g, '')  // Remove brackets
        .trim();
    }
  }

  // If no speaker found in title, use channel title
  return channelTitle;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { playlistUrl, destination = 'lectures' } = await req.json();
    
    if (!playlistUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Playlist URL is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (destination !== 'lectures' && destination !== 'recitations') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid destination. Must be "lectures" or "recitations"',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Extract playlist ID
    const playlistId = extractPlaylistId(playlistUrl);
    
    if (!playlistId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid playlist URL. Please provide a valid YouTube playlist URL.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    console.log(`Starting import for playlist: ${playlistId} to ${destination}`);
    console.log(`IMPORTANT: Videos will be permanently stored in the ${destination} table and will NOT be automatically deleted.`);

    // Fetch all videos from the playlist
    const videos = await fetchPlaylistVideos(playlistId);

    if (videos.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No videos found in the playlist',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    let imported = 0;
    let failed = 0;
    const failedTitles: string[] = [];

    // Get the current max order_index for each category
    const categoryOrderIndexes: { [key: string]: number } = {};

    // Import each video - PERMANENT STORAGE
    // These videos will remain in the database indefinitely unless manually removed by an admin
    for (const video of videos) {
      try {
        const speakerOrReciter = extractSpeaker(video.title, video.channelTitle);
        const categoryId = destination === 'lectures' 
          ? categorizeVideoForLectures(video.title, speakerOrReciter)
          : categorizeVideoForRecitations(video.title, speakerOrReciter);
        
        // Get or initialize order index for this category
        if (!(categoryId in categoryOrderIndexes)) {
          const { data: maxOrderData } = await supabase
            .from(destination)
            .select('order_index')
            .eq('category_id', categoryId)
            .order('order_index', { ascending: false })
            .limit(1);
          
          categoryOrderIndexes[categoryId] = maxOrderData && maxOrderData.length > 0 
            ? maxOrderData[0].order_index 
            : 0;
        }
        
        // Increment order index
        categoryOrderIndexes[categoryId]++;
        
        const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
        
        // Prepare the data based on destination
        const insertData = destination === 'lectures' 
          ? {
              category_id: categoryId,
              title: video.title,
              speaker: speakerOrReciter,
              duration: video.duration,
              video_url: videoUrl,
              thumbnail_url: video.thumbnailUrl,
              order_index: categoryOrderIndexes[categoryId],
            }
          : {
              category_id: categoryId,
              title: video.title,
              reciter: speakerOrReciter,
              duration: video.duration,
              video_url: videoUrl,
              thumbnail_url: video.thumbnailUrl,
              order_index: categoryOrderIndexes[categoryId],
            };

        // PERMANENT INSERT - This data will persist indefinitely
        const { error } = await supabase
          .from(destination)
          .insert(insertData);

        if (error) {
          console.error(`Failed to insert video "${video.title}":`, error);
          failed++;
          failedTitles.push(video.title);
        } else {
          console.log(`✓ PERMANENTLY STORED: ${video.title} (Category: ${categoryId}) in ${destination}`);
          imported++;
        }
      } catch (error) {
        console.error(`Error processing video "${video.title}":`, error);
        failed++;
        failedTitles.push(video.title);
      }
    }

    const destinationName = destination === 'lectures' ? 'Quran Lectures' : 'Quran Recitations';
    const result = {
      success: true,
      imported,
      failed,
      total: videos.length,
      message: `Successfully imported ${imported} out of ${videos.length} videos to ${destinationName}. These videos are now permanently stored in your database.`,
      failedTitles: failedTitles.length > 0 ? failedTitles : undefined,
    };

    console.log('Import complete:', result);
    console.log(`${imported} videos are now permanently stored in the ${destination} table.`);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in import function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        imported: 0,
        message: 'Error importing playlist',
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
