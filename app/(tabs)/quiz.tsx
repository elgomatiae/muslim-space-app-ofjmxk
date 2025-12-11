
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface QuizQuestion {
  id: string;
  question_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  order_index: number;
}

interface Quiz {
  id: string;
  quiz_id: string;
  title: string;
  description: string;
  difficulty: string;
  color: string;
}

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);

      // Fetch quiz details
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('quiz_id', quizId)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);

      // Fetch all questions for this quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      setAllQuestions(questionsData || []);

      // Select 10 random questions
      const randomQuestions = selectRandomQuestions(questionsData || [], 10);
      setQuestions(randomQuestions);
      setAnsweredQuestions(new Array(randomQuestions.length).fill(false));
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRandomQuestions = (allQs: QuizQuestion[], count: number): QuizQuestion[] => {
    const shuffled = [...allQs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, allQs.length));
  };

  if (loading || !quiz || questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestionIndex]) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (answerIndex === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    const randomQuestions = selectRandomQuestions(allQuestions, 10);
    setQuestions(randomQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Array(randomQuestions.length).fill(false));
    setShowResults(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return 'Perfect! Masha\'Allah! 🌟';
    if (percentage >= 80) return 'Excellent! Keep it up! 🎉';
    if (percentage >= 60) return 'Good job! Keep learning! 📚';
    if (percentage >= 40) return 'Not bad! Keep practicing! 💪';
    return 'Keep studying! You can do better! 📖';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: quiz.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.card}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{quiz.title}</Text>
          <Text style={styles.headerSubtitle}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}/{questions.length}</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, backgroundColor: quiz.color }
          ]} 
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correct_answer;
            const showCorrect = showExplanation && isCorrect;
            const showIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && !showExplanation && styles.optionButtonSelected,
                  showCorrect && styles.optionButtonCorrect,
                  showIncorrect && styles.optionButtonIncorrect,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={answeredQuestions[currentQuestionIndex]}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionCircle,
                    isSelected && !showExplanation && { borderColor: quiz.color, backgroundColor: quiz.color },
                    showCorrect && styles.optionCircleCorrect,
                    showIncorrect && styles.optionCircleIncorrect,
                  ]}>
                    {showCorrect && (
                      <IconSymbol
                        ios_icon_name="checkmark"
                        android_material_icon_name="check"
                        size={18}
                        color={colors.card}
                      />
                    )}
                    {showIncorrect && (
                      <IconSymbol
                        ios_icon_name="xmark"
                        android_material_icon_name="close"
                        size={18}
                        color={colors.card}
                      />
                    )}
                    {!showExplanation && isSelected && (
                      <View style={styles.optionCircleInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelected && !showExplanation && { color: quiz.color, fontWeight: '600' },
                    showCorrect && styles.optionTextCorrect,
                    showIncorrect && styles.optionTextIncorrect,
                  ]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {showExplanation && (
          <View style={[
            styles.explanationCard,
            selectedAnswer === currentQuestion.correct_answer 
              ? styles.explanationCardCorrect 
              : styles.explanationCardIncorrect
          ]}>
            <View style={styles.explanationHeader}>
              <IconSymbol
                ios_icon_name={selectedAnswer === currentQuestion.correct_answer ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                android_material_icon_name={selectedAnswer === currentQuestion.correct_answer ? 'check-circle' : 'cancel'}
                size={32}
                color={selectedAnswer === currentQuestion.correct_answer ? colors.success : colors.error}
              />
              <Text style={styles.explanationTitle}>
                {selectedAnswer === currentQuestion.correct_answer ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}

        {showExplanation && (
          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: quiz.color }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Text>
            <IconSymbol
              ios_icon_name="arrow.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.card}
            />
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showResults}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultsCard}>
            <View style={[styles.resultsHeader, { backgroundColor: quiz.color }]}>
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji-events"
                size={48}
                color={colors.card}
              />
              <Text style={styles.resultsTitle}>Quiz Complete!</Text>
            </View>

            <View style={styles.resultsContent}>
              <Text style={styles.resultsMessage}>{getScoreMessage()}</Text>
              
              <View style={styles.resultsScoreContainer}>
                <Text style={styles.resultsScoreLabel}>Your Score</Text>
                <Text style={[styles.resultsScore, { color: quiz.color }]}>
                  {score}/{questions.length}
                </Text>
                <Text style={styles.resultsPercentage}>
                  {Math.round((score / questions.length) * 100)}%
                </Text>
              </View>

              <View style={styles.resultsStats}>
                <View style={styles.resultsStat}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={24}
                    color={colors.success}
                  />
                  <Text style={styles.resultsStatLabel}>Correct</Text>
                  <Text style={styles.resultsStatValue}>{score}</Text>
                </View>
                <View style={styles.resultsStatDivider} />
                <View style={styles.resultsStat}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={24}
                    color={colors.error}
                  />
                  <Text style={styles.resultsStatLabel}>Incorrect</Text>
                  <Text style={styles.resultsStatValue}>{questions.length - score}</Text>
                </View>
              </View>
            </View>

            <View style={styles.resultsButtons}>
              <TouchableOpacity 
                style={[styles.resultsButton, styles.resultsButtonSecondary]}
                onPress={() => {
                  setShowResults(false);
                  router.back();
                }}
              >
                <Text style={styles.resultsButtonTextSecondary}>Back to Quizzes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.resultsButton, styles.resultsButtonPrimary, { backgroundColor: quiz.color }]}
                onPress={() => {
                  setShowResults(false);
                  handleRestart();
                }}
              >
                <IconSymbol
                  ios_icon_name="arrow.clockwise"
                  android_material_icon_name="refresh"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.resultsButtonTextPrimary}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.card,
    opacity: 0.9,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.border,
  },
  progressBar: {
    height: '100%',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  optionButtonCorrect: {
    borderColor: colors.success,
    backgroundColor: '#E8F5E9',
  },
  optionButtonIncorrect: {
    borderColor: colors.error,
    backgroundColor: '#FFEBEE',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.card,
  },
  optionCircleCorrect: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  optionCircleIncorrect: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  optionTextCorrect: {
    color: colors.success,
    fontWeight: '600',
  },
  optionTextIncorrect: {
    color: colors.error,
    fontWeight: '600',
  },
  explanationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  explanationCardCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.success,
  },
  explanationCardIncorrect: {
    backgroundColor: '#FFEBEE',
    borderColor: colors.error,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  explanationText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  resultsHeader: {
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.card,
  },
  resultsContent: {
    padding: 24,
    alignItems: 'center',
  },
  resultsMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  resultsScoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsScoreLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 56,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultsPercentage: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  resultsStats: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  resultsStat: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  resultsStatDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  resultsStatLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  resultsStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  resultsButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  resultsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  resultsButtonSecondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultsButtonPrimary: {
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  resultsButtonTextSecondary: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  resultsButtonTextPrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
  },
});
