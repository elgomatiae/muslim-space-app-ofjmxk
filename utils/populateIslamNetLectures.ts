
import { supabase } from '@/lib/supabase';

export interface ImportResult {
  success: boolean;
  imported: number;
  failed?: number;
  total?: number;
  message: string;
  error?: string;
}

/**
 * Import Islam Net lectures using YouTube Data API
 * This function calls the Supabase Edge Function to search for each video
 * and populate the database with correct video URLs and thumbnail URLs
 */
export async function importIslamNetLectures(): Promise<ImportResult> {
  try {
    console.log('Starting import of Islam Net lectures...');
    
    const { data, error } = await supabase.functions.invoke('import-islam-net-lectures', {
      body: {}
    });

    if (error) {
      console.error('Error importing Islam Net lectures:', error);
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
 * Clear all existing lectures from the database
 * Use with caution!
 */
export async function clearAllLectures(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from('lectures')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      return {
        success: false,
        message: 'Failed to clear lectures',
      };
    }

    return {
      success: true,
      message: 'All lectures cleared successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while clearing lectures'
    };
  }
}

/**
 * Get the count of lectures in the database
 */
export async function getLecturesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting lectures count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Exception getting lectures count:', error);
    return 0;
  }
}

/**
 * Validate that a YouTube video ID is correct
 * @param videoId The YouTube video ID to validate
 * @returns true if valid, false otherwise
 */
export function validateYouTubeVideoId(videoId: string): boolean {
  // YouTube video IDs are typically 11 characters long
  // and contain alphanumeric characters, hyphens, and underscores
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdRegex.test(videoId);
}

/**
 * Extract video ID from a YouTube URL
 * @param url The YouTube URL
 * @returns The video ID or null if not found
 */
export function extractVideoIdFromUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
