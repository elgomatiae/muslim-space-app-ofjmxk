
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
