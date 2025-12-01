
// This script populates the Supabase database with all the initial data
// Run this once to populate lectures, recitations, miracles, verses, hadiths, and quizzes

import { supabase } from '../lib/supabase';
import { miracleCategories } from '../data/miracles';
import { videoCategories, quranRecitations } from '../data/videos';
import { quizBanks } from '../data/quizData';

export async function populateDatabase() {
  console.log('Starting database population...');

  try {
    // 1. Populate Miracles
    console.log('Populating miracles...');
    for (const category of miracleCategories) {
      for (let i = 0; i < category.miracles.length; i++) {
        const miracle = category.miracles[i];
        
        // Insert miracle
        const { data: miracleData, error: miracleError } = await supabase
          .from('miracles')
          .insert({
            category_id: category.id,
            title: miracle.title,
            description: miracle.description,
            details: miracle.details,
            explanation: miracle.explanation,
            reference: miracle.reference,
            image_url: miracle.image,
            order_index: i,
          })
          .select()
          .single();

        if (miracleError) {
          console.error(`Error inserting miracle ${miracle.title}:`, miracleError);
          continue;
        }

        // Insert Quran verses for this miracle
        if (miracle.quranVerses && miracle.quranVerses.length > 0) {
          for (let j = 0; j < miracle.quranVerses.length; j++) {
            const verse = miracle.quranVerses[j];
            const { error: verseError } = await supabase
              .from('miracle_quran_verses')
              .insert({
                miracle_id: miracleData.id,
                surah: verse.surah,
                verse: verse.verse,
                arabic: verse.arabic,
                translation: verse.translation,
                order_index: j,
              });

            if (verseError) {
              console.error(`Error inserting verse for miracle ${miracle.title}:`, verseError);
            }
          }
        }

        // Insert Hadiths for this miracle
        if (miracle.hadiths && miracle.hadiths.length > 0) {
          for (let j = 0; j < miracle.hadiths.length; j++) {
            const hadith = miracle.hadiths[j];
            const { error: hadithError } = await supabase
              .from('miracle_hadiths')
              .insert({
                miracle_id: miracleData.id,
                source: hadith.source,
                text: hadith.text,
                order_index: j,
              });

            if (hadithError) {
              console.error(`Error inserting hadith for miracle ${miracle.title}:`, hadithError);
            }
          }
        }

        console.log(`✓ Inserted miracle: ${miracle.title}`);
      }
    }

    // 2. Populate Lectures
    console.log('Populating lectures...');
    for (const category of videoCategories) {
      for (let i = 0; i < category.videos.length; i++) {
        const video = category.videos[i];
        const { error } = await supabase
          .from('lectures')
          .insert({
            category_id: category.id,
            title: video.title,
            speaker: video.speaker,
            duration: video.duration,
            video_url: video.url,
            thumbnail_url: video.thumbnail,
            order_index: i,
          });

        if (error) {
          console.error(`Error inserting lecture ${video.title}:`, error);
        } else {
          console.log(`✓ Inserted lecture: ${video.title}`);
        }
      }
    }

    // 3. Populate Recitations
    console.log('Populating recitations...');
    for (const category of quranRecitations) {
      for (let i = 0; i < category.recitations.length; i++) {
        const recitation = category.recitations[i];
        const { error } = await supabase
          .from('recitations')
          .insert({
            category_id: category.id,
            title: recitation.title,
            reciter: recitation.reciter,
            duration: recitation.duration,
            video_url: recitation.url,
            thumbnail_url: recitation.thumbnail,
            order_index: i,
          });

        if (error) {
          console.error(`Error inserting recitation ${recitation.title}:`, error);
        } else {
          console.log(`✓ Inserted recitation: ${recitation.title}`);
        }
      }
    }

    // 4. Populate Quizzes
    console.log('Populating quizzes...');
    for (let i = 0; i < quizBanks.length; i++) {
      const quiz = quizBanks[i];
      
      // Insert quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .insert({
          quiz_id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          color: quiz.color,
          order_index: i,
        });

      if (quizError) {
        console.error(`Error inserting quiz ${quiz.title}:`, quizError);
        continue;
      }

      // Insert quiz questions
      for (let j = 0; j < quiz.questions.length; j++) {
        const question = quiz.questions[j];
        const { error: questionError } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: quiz.id,
            question_id: question.id,
            question: question.question,
            options: question.options,
            correct_answer: question.correctAnswer,
            explanation: question.explanation,
            order_index: j,
          });

        if (questionError) {
          console.error(`Error inserting question for quiz ${quiz.title}:`, questionError);
        }
      }

      console.log(`✓ Inserted quiz: ${quiz.title} with ${quiz.questions.length} questions`);
    }

    console.log('✅ Database population complete!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error populating database:', error);
    return { success: false, error };
  }
}

// Run the population if this file is executed directly
if (require.main === module) {
  populateDatabase()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
