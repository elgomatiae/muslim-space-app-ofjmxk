
import { supabase } from '../lib/supabase';

/**
 * Check the current state of the lectures database
 * Useful for verifying imports and understanding the data structure
 */
export async function checkDatabaseState() {
  try {
    console.log('📊 Checking database state...\n');

    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total count:', countError);
      return;
    }

    console.log(`Total Lectures: ${totalCount}\n`);

    // Get count by category
    const { data: lectures, error: lecturesError } = await supabase
      .from('lectures')
      .select('category_id, title, speaker, duration');

    if (lecturesError) {
      console.error('Error getting lectures:', lecturesError);
      return;
    }

    if (!lectures || lectures.length === 0) {
      console.log('No lectures found in database.');
      return;
    }

    // Group by category
    const categoryCounts: { [key: string]: number } = {};
    const categoryExamples: { [key: string]: any[] } = {};

    lectures.forEach(lecture => {
      const category = lecture.category_id;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      
      if (!categoryExamples[category]) {
        categoryExamples[category] = [];
      }
      
      if (categoryExamples[category].length < 3) {
        categoryExamples[category].push(lecture);
      }
    });

    // Display results
    console.log('📚 Lectures by Category:\n');
    
    Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} lectures`);
        
        if (categoryExamples[category]) {
          categoryExamples[category].forEach(lecture => {
            console.log(`  - ${lecture.title} (${lecture.speaker}) [${lecture.duration}]`);
          });
        }
        
        console.log('');
      });

    // Get speakers
    const speakers = new Set(lectures.map(l => l.speaker));
    console.log(`\n👥 Unique Speakers: ${speakers.size}`);
    console.log('Top speakers:');
    
    const speakerCounts: { [key: string]: number } = {};
    lectures.forEach(lecture => {
      speakerCounts[lecture.speaker] = (speakerCounts[lecture.speaker] || 0) + 1;
    });
    
    Object.entries(speakerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([speaker, count]) => {
        console.log(`  ${speaker}: ${count} lectures`);
      });

    return {
      totalCount,
      categoryCounts,
      speakerCounts,
      uniqueSpeakers: speakers.size,
    };
  } catch (error) {
    console.error('Error checking database state:', error);
  }
}

/**
 * Get a sample of lectures from a specific category
 */
export async function getSampleLectures(categoryId: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .eq('category_id', categoryId)
      .order('order_index', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error getting sample lectures:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting sample lectures:', error);
    return [];
  }
}

/**
 * Verify video URLs are valid
 */
export async function verifyVideoUrls(limit: number = 10) {
  try {
    console.log(`🔍 Verifying ${limit} video URLs...\n`);

    const { data, error } = await supabase
      .from('lectures')
      .select('id, title, video_url, thumbnail_url')
      .limit(limit);

    if (error) {
      console.error('Error getting lectures:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No lectures to verify.');
      return;
    }

    let validCount = 0;
    let invalidCount = 0;

    for (const lecture of data) {
      const isValidUrl = lecture.video_url.startsWith('https://www.youtube.com/watch?v=');
      const isValidThumbnail = lecture.thumbnail_url.startsWith('https://img.youtube.com/vi/');

      if (isValidUrl && isValidThumbnail) {
        console.log(`✅ ${lecture.title}`);
        validCount++;
      } else {
        console.log(`❌ ${lecture.title}`);
        console.log(`   URL: ${lecture.video_url}`);
        console.log(`   Thumbnail: ${lecture.thumbnail_url}`);
        invalidCount++;
      }
    }

    console.log(`\nResults: ${validCount} valid, ${invalidCount} invalid`);
  } catch (error) {
    console.error('Error verifying URLs:', error);
  }
}

// Example usage:
// import { checkDatabaseState, getSampleLectures, verifyVideoUrls } from '@/utils/checkDatabaseState';
// 
// // Check overall state
// await checkDatabaseState();
// 
// // Get sample from a category
// const motivational = await getSampleLectures('motivational', 5);
// console.log(motivational);
// 
// // Verify URLs
// await verifyVideoUrls(20);
