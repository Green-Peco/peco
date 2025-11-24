import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getLesson } from '../src/services/api';
import { useLocalSearchParams } from 'expo-router';

export default function LessonDetailScreen() {
  const { lessonId, lessonTitle } = useLocalSearchParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await getLesson(lessonId);
        setLesson(res.data);
      } catch (err) {
        setError('Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#27ae60" /></View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>
    );
  }
  if (!lesson) {
    return (
      <View style={styles.centered}><Text>No lesson found.</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lessonTitle || lesson.title}</Text>
      <Text style={styles.content}>{lesson.content || 'No content available.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fff8',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
