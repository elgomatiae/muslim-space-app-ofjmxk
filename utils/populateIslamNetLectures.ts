
import { supabase } from '@/lib/supabase';

export async function importIslamNetLectures(category: 'lectures' | 'recitations' | 'both' = 'lectures', quantity: number = 43) {
  try {
    const { data, error } = await supabase.functions.invoke('import-islam-net-lectures', {
      body: { category, quantity },
    });

    if (error) {
      console.error('Error invoking edge function:', error);
      return {
        success: false,
        error: error.message || 'Failed to invoke import function',
        imported: 0,
        failed: 0,
      };
    }

    return data;
  } catch (error) {
    console.error('Error importing Islam Net lectures:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      imported: 0,
      failed: 0,
    };
  }
}

export async function getLecturesCount() {
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

export async function getRecitationsCount() {
  try {
    const { count, error } = await supabase
      .from('recitations')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting recitations count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting recitations count:', error);
    return 0;
  }
}
