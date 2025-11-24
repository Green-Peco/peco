import React, { useState, useEffect, useCallback, FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { useRouter } from 'expo-router';

// Interfaces for better type safety
interface QuizOption {
  option_id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correct_answer: string;
}

interface Lesson {
  id: number;
  title: string;
  type: 'article' | 'video' | 'quiz';
  content?: string;
  media_url?: string;
  xp_reward?: number;
  questions?: QuizQuestion[];
}

interface LessonPlayerProps {
  lesson: Lesson;
  onLessonCompleted: (data: any) => void;
}

const LessonPlayer: FC<LessonPlayerProps> = ({ lesson, onLessonCompleted }) => {
  const [currentStep, setCurrentStep] = useState(0); // For quizzes, this is the question index
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refetchUser } = useAuth();
  const router = useRouter();

  // Reset state when lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setIsSubmitting(false);
  }, [lesson.id]);

  const totalSteps = lesson.type === 'quiz' ? (lesson.questions?.length || 0) : 1;
  const progress = totalSteps > 0 ? ((currentStep + (lesson.type === 'quiz' && showFeedback ? 0.5 : 0)) / totalSteps) * 100 : 0;

  const currentQuestion = lesson.type === 'quiz' ? lesson.questions?.[currentStep] : null;

  const handleOptionPress = (optionId: string) => {
    if (!showFeedback) { // Only allow selection if feedback isn't showing yet
      setSelectedOptionId(optionId);
    }
  };

  const handleCheckOrNext = async () => {
    if (lesson.type !== 'quiz' || !currentQuestion) {
      // For article/video, just mark as complete
      await handleCompleteLesson([]);
      return;
    }

    // Quiz logic
    if (!showFeedback) {
      // Check Answer
      if (selectedOptionId === currentQuestion.correct_answer) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
      setShowFeedback(true);
    } else {
      // Move to Next Question
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedOptionId(null);
        setShowFeedback(false);
        setIsCorrect(false);
      } else {
        // Last question, submit quiz
        await handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = async () => {
    if (!lesson || !lesson.questions) return;
    setIsSubmitting(true);

    const answers = lesson.questions.map(q => ({
      questionId: q.id,
      answerId: selectedOptionId || '', // Assuming selectedOptionId holds the last answer
    }));
    await handleCompleteLesson(answers);
    setIsSubmitting(true);
  };

  const handleCompleteLesson = async (answers: { questionId: number; answerId: string }[]) => {
    try {
      const response = await api.completeLesson(lesson.id, answers);
      if (response.data.status === 'Completed') {
        Alert.alert(
          'Lesson Complete!',
          `You scored ${response.data.score || '100%'}! You earned ${response.data.xp_awarded} XP! ${response.data.newly_awarded_achievements?.length > 0 ? `You also unlocked ${response.data.newly_awarded_achievements.length} new achievement(s)!` : ''}`
        );
        refetchUser(); // Update user's XP/level globally
        onLessonCompleted(response.data); // Notify parent component
      } else {
        Alert.alert('Lesson Result', response.data.message);
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
      Alert.alert("Error", "Could not complete the lesson.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderArticle = () => (
    <ScrollView style={styles.contentScroll}>
      <Text style={styles.articleText}>{lesson.content}</Text>
      {lesson.media_url && <Text style={styles.mediaUrlText}>Media: {lesson.media_url}</Text>}
    </ScrollView>
  );

  const renderVideo = () => (
    <View style={styles.videoContainer}>
      <Text style={styles.videoPlaceholderText}>Video Player Placeholder</Text>
      {lesson.media_url && <Text style={styles.mediaUrlText}>Video URL: {lesson.media_url}</Text>}
      {lesson.xp_reward && <Text style={styles.xpText}>XP Reward: {lesson.xp_reward}</Text>}
    </View>
  );

  const renderQuiz = () => (
    <View style={styles.quizContainer}>
      <Text style={styles.questionText}>{currentQuestion?.question}</Text>
      {currentQuestion?.options.map(option => {
        const isSelected = selectedOptionId === option.option_id;
        const isCorrectOption = showFeedback && option.option_id === currentQuestion.correct_answer;
        const isWrongSelected = showFeedback && isSelected && !isCorrect;

        return (
          <TouchableOpacity
            key={option.option_id}
            style={[
              styles.optionButton,
              isSelected && styles.optionSelected,
              isCorrectOption && styles.optionCorrect,
              isWrongSelected && styles.optionWrong,
            ]}
            onPress={() => handleOptionPress(option.option_id)}
            disabled={showFeedback && !isSelected} // Only allow changing selection before feedback
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        );
      })}
      {showFeedback && (
        <Text style={[styles.feedbackText, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </Text>
      )}
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={handleCheckOrNext} 
        disabled={isSubmitting || (lesson.type === 'quiz' && !selectedOptionId && !showFeedback)}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>
          {lesson.type === 'quiz' && !showFeedback ? 'Check Answer' : 
           lesson.type === 'quiz' && currentStep < totalSteps - 1 ? 'Next Question' : 
           lesson.type === 'quiz' && currentStep === totalSteps - 1 ? 'Submit Quiz' : 'Complete Lesson'}
        </Text>}
      </TouchableOpacity>
    </View>
  );
  
  if (isSubmitting) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#27ae60" />
            <Text style={{ marginTop: 10, color: '#27ae60' }}>Submitting lesson...</Text>
        </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.lessonHeader}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        {lesson.xp_reward && lesson.type !== 'quiz' && <Text style={styles.xpRewardText}>+{lesson.xp_reward} XP</Text>}
      </View>

      {lesson.type === 'article' && renderArticle()}
      {lesson.type === 'video' && renderVideo()}
      {lesson.type === 'quiz' && renderQuiz()}

      {lesson.type !== 'quiz' && ( // For article/video, provide a simple complete button
        <TouchableOpacity style={styles.actionButton} onPress={() => handleCompleteLesson([])}>
          <Text style={styles.actionButtonText}>Complete Lesson</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f6fff8',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  lessonHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
    textAlign: 'center',
  },
  xpRewardText: {
    fontSize: 16,
    color: '#388e3c',
    fontWeight: '500',
  },
  contentScroll: {
    flex: 1,
    padding: 20,
  },
  articleText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
  mediaUrlText: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    margin: 20,
    borderRadius: 10,
  },
  videoPlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
  quizContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  optionSelected: {
    borderColor: '#27ae60',
    backgroundColor: '#eafaf1',
  },
  optionCorrect: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  optionWrong: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  feedbackCorrect: {
    color: '#28a745',
  },
  feedbackWrong: {
    color: '#dc3545',
  },
  actionButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 18,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6fff8',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default LessonPlayer;
