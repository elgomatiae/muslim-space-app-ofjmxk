
import { supabase } from '../lib/supabase';

export interface PlaylistImportResult {
  success: boolean;
  imported: number;
  failed: number;
  total: number;
  message: string;
  error?: string;
  failedTitles?: string[];
}

/**
 * Import all videos from a YouTube playlist to Islamic lectures
 * @param playlistUrl - The full YouTube playlist URL
 * @returns Import result with statistics
 */
export async function importYouTubePlaylist(playlistUrl: string): Promise<PlaylistImportResult> {
  try {
    console.log('Starting import of YouTube playlist:', playlistUrl);
    
    const { data, error } = await supabase.functions.invoke('import-youtube-playlist', {
      body: { playlistUrl }
    });

    if (error) {
      console.error('Error invoking edge function:', error);
      return {
        success: false,
        imported: 0,
        failed: 0,
        total: 0,
        message: 'Failed to invoke import function',
        error: error.message || 'Unknown error'
      };
    }

    console.log('Import result:', data);
    
    // Handle the case where the Edge Function returns an error in the data
    if (data && !data.success) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        total: 0,
        message: data.message || 'Failed to import playlist',
        error: data.error || 'Unknown error'
      };
    }

    return data as PlaylistImportResult;
  } catch (error) {
    console.error('Exception during import:', error);
    return {
      success: false,
      imported: 0,
      failed: 0,
      total: 0,
      message: 'Exception occurred during import',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get the total count of lectures in the database
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
    console.error('Error getting lectures count:', error);
    return 0;
  }
}

/**
 * Get lectures grouped by category
 */
export async function getLecturesByCategory(): Promise<{ [key: string]: number }> {
  try {
    const { data, error } = await supabase
      .from('lectures')
      .select('category_id');

    if (error) {
      console.error('Error getting lectures by category:', error);
      return {};
    }

    const categoryCounts: { [key: string]: number } = {};
    
    if (data) {
      for (const lecture of data) {
        const category = lecture.category_id;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    }

    return categoryCounts;
  } catch (error) {
    console.error('Error getting lectures by category:', error);
    return {};
  }
}
