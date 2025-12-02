
import { supabase } from '../lib/supabase';

export interface ImportResult {
  success: boolean;
  imported: number;
  message: string;
  error?: string;
}

/**
 * Import Islamic lectures from YouTube
 * This function calls the Supabase Edge Function to fetch and import videos
 */
export async function importIslamicLectures(): Promise<ImportResult> {
  try {
    console.log('Starting import of Islamic lectures...');
    
    const { data, error } = await supabase.functions.invoke('import-youtube-videos', {
      body: {
        searchQuery: 'Islamic lectures',
        targetTable: 'lectures',
        maxResults: 100
      }
    });

    if (error) {
      console.error('Error importing lectures:', error);
      return {
        success: false,
        imported: 0,
        message: 'Failed to import lectures',
        error: error.message
      };
    }

    console.log('Import result:', data);
    
    // Handle the case where the Edge Function returns an error in the data
    if (data && !data.success) {
      return {
        success: false,
        imported: 0,
        message: data.message || 'Failed to import lectures',
        error: data.error || 'Unknown error'
      };
    }

    return data as ImportResult;
  } catch (error) {
    console.error('Exception during import:', error);
    return {
      success: false,
      imported: 0,
      message: 'Exception occurred during import',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Import Quran recitations from YouTube
 * This function calls the Supabase Edge Function to fetch and import videos
 */
export async function importQuranRecitations(): Promise<ImportResult> {
  try {
    console.log('Starting import of Quran recitations...');
    
    const { data, error } = await supabase.functions.invoke('import-youtube-videos', {
      body: {
        searchQuery: 'Quran recitation',
        targetTable: 'recitations',
        maxResults: 100
      }
    });

    if (error) {
      console.error('Error importing recitations:', error);
      return {
        success: false,
        imported: 0,
        message: 'Failed to import recitations',
        error: error.message
      };
    }

    console.log('Import result:', data);
    
    // Handle the case where the Edge Function returns an error in the data
    if (data && !data.success) {
      return {
        success: false,
        imported: 0,
        message: data.message || 'Failed to import recitations',
        error: data.error || 'Unknown error'
      };
    }

    return data as ImportResult;
  } catch (error) {
    console.error('Exception during import:', error);
    return {
      success: false,
      imported: 0,
      message: 'Exception occurred during import',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Import both lectures and recitations
 */
export async function importAllVideos(): Promise<{
  lectures: ImportResult;
  recitations: ImportResult;
}> {
  console.log('Starting import of all videos...');
  
  const lecturesResult = await importIslamicLectures();
  const recitationsResult = await importQuranRecitations();
  
  return {
    lectures: lecturesResult,
    recitations: recitationsResult
  };
}

/**
 * Validate a single YouTube video URL
 */
export async function validateYouTubeUrl(url: string): Promise<boolean> {
  try {
    // Extract video ID from URL
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (!videoIdMatch) {
      return false;
    }

    // Try to fetch the video page to check if it exists
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    return response.ok;
  } catch (error) {
    console.error('Error validating YouTube URL:', error);
    return false;
  }
}

/**
 * Clean up broken video links from the database
 * This function removes videos with invalid URLs
 */
export async function cleanupBrokenVideos(): Promise<{
  lecturesRemoved: number;
  recitationsRemoved: number;
}> {
  console.log('Starting cleanup of broken videos...');
  
  let lecturesRemoved = 0;
  let recitationsRemoved = 0;

  try {
    // Get all lectures
    const { data: lectures, error: lecturesError } = await supabase
      .from('lectures')
      .select('id, video_url');

    if (!lecturesError && lectures) {
      for (const lecture of lectures) {
        const isValid = await validateYouTubeUrl(lecture.video_url);
        if (!isValid) {
          const { error } = await supabase
            .from('lectures')
            .delete()
            .eq('id', lecture.id);
          
          if (!error) {
            lecturesRemoved++;
            console.log(`Removed broken lecture: ${lecture.id}`);
          }
        }
      }
    }

    // Get all recitations
    const { data: recitations, error: recitationsError } = await supabase
      .from('recitations')
      .select('id, video_url');

    if (!recitationsError && recitations) {
      for (const recitation of recitations) {
        const isValid = await validateYouTubeUrl(recitation.video_url);
        if (!isValid) {
          const { error } = await supabase
            .from('recitations')
            .delete()
            .eq('id', recitation.id);
          
          if (!error) {
            recitationsRemoved++;
            console.log(`Removed broken recitation: ${recitation.id}`);
          }
        }
      }
    }

    console.log(`Cleanup complete. Removed ${lecturesRemoved} lectures and ${recitationsRemoved} recitations.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }

  return {
    lecturesRemoved,
    recitationsRemoved
  };
}
