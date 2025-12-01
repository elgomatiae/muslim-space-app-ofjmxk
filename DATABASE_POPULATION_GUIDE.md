
# Database Population Guide

This guide explains how to populate your Supabase database with all the initial data for the Muslim-Space app.

## Overview

The app requires the following data to be populated:
- **Miracles** (Scientific, Linguistic, Historical, Mathematical, Prophetic)
- **Lectures** (8 categories with videos)
- **Recitations** (5 categories with Quran recitations)
- **Quizzes** (6 quizzes with 100 questions each)
- **Daily Verses and Hadiths** (Already populated with 100+ items)

## Option 1: Automatic Population (Recommended)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run the Population Script
The `scripts/populateDatabase.ts` file contains all the logic to populate the database. However, since this is a TypeScript file in a React Native project, you'll need to run it through Node.js with ts-node or compile it first.

**Using ts-node:**
```bash
npx ts-node scripts/populateDatabase.ts
```

**Or compile and run:**
```bash
npx tsc scripts/populateDatabase.ts
node scripts/populateDatabase.js
```

This will:
1. Insert all miracles with their Quran verses and hadiths
2. Insert all lectures organized by category
3. Insert all recitations organized by category
4. Insert all quizzes with their 100 questions each

## Option 2: Manual Population via Supabase Dashboard

If the automatic script doesn't work, you can manually insert the data through the Supabase dashboard:

### 1. Populate Miracles

Go to the Supabase dashboard → Table Editor → `miracles` table and insert the data from `data/miracles.ts`.

For each miracle:
1. Insert the miracle record
2. Note the generated `id`
3. Insert the Quran verses into `miracle_quran_verses` table with the miracle's `id`
4. Insert the hadiths into `miracle_hadiths` table with the miracle's `id`

### 2. Populate Lectures

Go to `lectures` table and insert data from `data/videos.ts` → `videoCategories` array.

Example SQL:
```sql
INSERT INTO lectures (category_id, title, speaker, duration, video_url, thumbnail_url, order_index)
VALUES 
  ('quran-tafsir', 'Understanding Surah Al-Fatiha', 'Nouman Ali Khan', '15:30', 'https://www.youtube.com/watch?v=j-vhNhxwBjU', 'https://img.youtube.com/vi/j-vhNhxwBjU/mqdefault.jpg', 0),
  -- Add more lectures...
```

### 3. Populate Recitations

Go to `recitations` table and insert data from `data/videos.ts` → `quranRecitations` array.

Example SQL:
```sql
INSERT INTO recitations (category_id, title, reciter, duration, video_url, thumbnail_url, order_index)
VALUES 
  ('short-surahs', 'Surah Al-Fatiha', 'Mishary Rashid Alafasy', '1:30', 'https://www.youtube.com/watch?v=pbt1LhsI_Ek', 'https://img.youtube.com/vi/pbt1LhsI_Ek/mqdefault.jpg', 0),
  -- Add more recitations...
```

### 4. Populate Quizzes

Go to `quizzes` table and insert data from `data/quizData.ts` → `quizBanks` array.

For each quiz:
1. Insert the quiz record into `quizzes` table
2. Insert all 100 questions into `quiz_questions` table with the quiz's `quiz_id`

Example SQL:
```sql
-- Insert quiz
INSERT INTO quizzes (quiz_id, title, description, difficulty, color, order_index)
VALUES ('quran', 'Quran Knowledge', 'Test your knowledge of the Holy Quran', 'Medium', '#4CAF50', 0);

-- Insert questions
INSERT INTO quiz_questions (quiz_id, question_id, question, options, correct_answer, explanation, order_index)
VALUES 
  ('quran', 'q1', 'How many Surahs are in the Quran?', '["100", "114", "120", "99"]', 1, 'The Quran contains 114 Surahs (chapters).', 0),
  -- Add more questions...
```

## Verification

After populating the database, verify the data:

1. **Check Miracles:**
   ```sql
   SELECT COUNT(*) FROM miracles;
   SELECT COUNT(*) FROM miracle_quran_verses;
   SELECT COUNT(*) FROM miracle_hadiths;
   ```

2. **Check Lectures:**
   ```sql
   SELECT COUNT(*) FROM lectures;
   SELECT category_id, COUNT(*) FROM lectures GROUP BY category_id;
   ```

3. **Check Recitations:**
   ```sql
   SELECT COUNT(*) FROM recitations;
   SELECT category_id, COUNT(*) FROM recitations GROUP BY category_id;
   ```

4. **Check Quizzes:**
   ```sql
   SELECT COUNT(*) FROM quizzes;
   SELECT COUNT(*) FROM quiz_questions;
   SELECT quiz_id, COUNT(*) FROM quiz_questions GROUP BY quiz_id;
   ```

## Expected Counts

After successful population, you should have:
- **Miracles:** ~40 miracles across 5 categories
- **Miracle Quran Verses:** ~150+ verses
- **Miracle Hadiths:** ~30+ hadiths
- **Lectures:** ~21 videos across 8 categories
- **Recitations:** ~14 recitations across 5 categories
- **Quizzes:** 6 quizzes
- **Quiz Questions:** 600 questions (100 per quiz)

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
This means the data already exists. You can either:
1. Delete existing data and re-populate
2. Skip the duplicate entries

### Error: "foreign key constraint violation"
Make sure you're inserting data in the correct order:
1. First insert the parent record (miracle, quiz)
2. Then insert the child records (verses, hadiths, questions)

### Data Not Showing in App
1. Check that RLS policies are enabled and allow SELECT for all users
2. Verify the data exists in the Supabase dashboard
3. Check the browser/app console for any errors
4. Make sure the Supabase client is properly configured in `lib/supabase.ts`

## Notes

- All data is read-only for users (RLS policies only allow SELECT)
- You can edit the data anytime through the Supabase dashboard
- Image URLs use Unsplash and YouTube thumbnails
- Video URLs point to YouTube videos
- The quiz system randomly selects 10 questions from the 100 available for each quiz

## Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Check the app console for errors
3. Verify your Supabase URL and anon key are correct
4. Ensure all tables have the correct RLS policies enabled
