import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext.tsx'; // Ensure .tsx import
import LessonPlayer from '../components/LessonPlayer'; // Import LessonPlayer

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { refetchUser } = useAuth(); // Assuming refetchUser updates global user state

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await api.getLesson(lessonId);
        setLesson(response.data.lesson);
      } catch (error) {
        console.error("Failed to fetch lesson details:", error);
        Alert.alert("Error", "Could not load lesson details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleLessonCompleted = (data) => {
    router.back(); // Go back to GameScreen after lesson is completed
    // Optionally show a toast or notification about completion/achievements
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <LessonPlayer lesson={lesson} onLessonCompleted={handleLessonCompleted} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f6fff8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});