<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getCourses } from '../services/api';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
// Mock lessons data
// Lessons will be fetched from backend

const genericAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const globalUsers = [
  {
    id: 1,
    name: 'Aisha',
    avatar: genericAvatar,
    points: 320,
    badge: 'Tree Planter',
  },
  {
    id: 2,
    name: 'Ali',
    avatar: genericAvatar,
    points: 290,
    badge: 'Reporter',
  },
  {
    id: 3,
    name: 'Sara',
    avatar: genericAvatar,
    points: 270,
    badge: 'Learner',
  },
  {
    id: 4,
    name: 'John',
    avatar: genericAvatar,
    points: 250,
    badge: 'Tree Planter',
  },
  {
    id: 5,
    name: 'Mary',
    avatar: genericAvatar,
    points: 230,
    badge: 'Eco Hero',
  },
  {
    id: 6,
    name: 'Mohamed',
    avatar: genericAvatar,
    points: 210,
    badge: 'Green Guardian',
  },
];

const localUsers = [
  {
    id: 1,
    name: 'Aisha',
    avatar: genericAvatar,
    points: 180,
    badge: 'Tree Planter',
  },
  {
    id: 2,
    name: 'Ali',
    avatar: genericAvatar,
    points: 160,
    badge: 'Reporter',
  },
  {
    id: 7,
    name: 'Layla',
    avatar: genericAvatar,
    points: 150,
    badge: 'Eco Hero',
  },
  {
    id: 8,
    name: 'Omar',
    avatar: genericAvatar,
    points: 140,
    badge: 'Green Guardian',
  },
];

const timeRanges = ['Week', 'Month', 'All Time'];
const tabs = ['Global', 'Local'];

const weekUsers = [
  globalUsers[0], globalUsers[1], localUsers[2], localUsers[3]
];
const monthUsers = [
  globalUsers[2], globalUsers[3], localUsers[0], localUsers[1]
];
const allTimeUsers = globalUsers;

export default function GameScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Global');
  const [activeTime, setActiveTime] = useState('Week');
  const [lessonProgress, setLessonProgress] = useState([]);
  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await getCourses();
        console.log('Backend response:', res.data); // Debug log
        // Map backend data to expected format
        const lessonsData = (res.data.courses || []).map(l => ({
          id: l.id,
          title: l.title,
          complete: l.complete || false
        }));
        setLessonProgress(lessonsData);
      } catch (err) {
        console.error('Error fetching lessons:', err); // Debug log
        // fallback to mock data if backend fails
        setLessonProgress([
          { id: 1, title: 'Why Forests Matter', complete: true },
          { id: 2, title: 'Tree Planting Basics', complete: true },
          { id: 3, title: 'Wildlife Protection', complete: false },
          { id: 4, title: 'Reporting Issues', complete: false },
          { id: 5, title: 'Eco-Friendly Habits', complete: false },
        ]);
      }
    }
    fetchLessons();
  }, []);
  const currentUser = globalUsers[0];
  const router = useRouter();
  // Handle lesson click
  const handleLessonPress = (lesson) => {
  // Navigate to lesson detail screen, passing lesson id and title using Expo Router
  router.push({ pathname: '/LessonDetailScreen', params: { lessonId: lesson.id, lessonTitle: lesson.title } });
=======
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext.tsx';
import * as api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const genericAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export default function GameScreen() {
  const [lessons, setLessons] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch user progress, course details, and leaderboard simultaneously
      const [progressRes, courseRes, leaderboardRes] = await Promise.all([
        api.getUserProgress(),
        api.getCourseDetails(1), // Hardcoding course ID 1 for now
        api.getLeaderboard(),
      ]);

      const completedLessonIds = new Set(progressRes.data.progress.map(p => p.id));
      
      // Assuming the lessons are in the first unit for this screen
      const courseLessons = courseRes.data.course.units[0]?.lessons || [];
      
      const enrichedLessons = courseLessons.map(lesson => ({
        ...lesson,
        complete: completedLessonIds.has(lesson.id),
      }));

      setLessons(enrichedLessons);
      setLeaderboard(leaderboardRes.data.leaderboard);

    } catch (error) {
      console.error("Failed to fetch game data:", error);
      Alert.alert("Error", "Could not load game data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
>>>>>>> origin/aisha
  };

  // useFocusEffect is like useEffect but runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLessonPress = async (lesson) => {
    // Navigate to LessonDetailScreen, passing the lesson ID
    router.push({ pathname: 'LessonDetailScreen', params: { lessonId: lesson.id } });
  };

  const renderUser = ({ item, index }) => (
    <TouchableOpacity style={styles.userCard}>
      <Image source={{ uri: genericAvatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.points}>{item.xp} pts</Text>
      </View>
      <Text style={styles.rank}>#{index + 1}</Text>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#27ae60" /></View>;
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.lessonsHeaderBox}>
          <Text style={styles.lessonsHeaderText}>🌲 Interactive Lessons</Text>
          <Text style={styles.lessonsSubText}>Learn, play, and earn badges!</Text>
        </View>
        <FlatList
          data={lessons}
          keyExtractor={item => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.lessonCardModern, item.complete && styles.lessonCompleteModern]}
              onPress={() => handleLessonPress(item)}
            >
              <View style={styles.lessonIconBox}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/427/427735.png' }} style={styles.lessonIcon} />
              </View>
              <Text style={styles.lessonTitleModern}>{item.title}</Text>
              <View style={styles.lessonProgressBarBg}>
                <View style={[styles.lessonProgressBarFill, { width: item.complete ? '100%' : '0%' }]} />
              </View>
              <Text style={styles.lessonStatusModern}>{item.complete ? 'Completed' : 'Tap to start'}</Text>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.leaderboardHeading}>🏆 Leaderboard</Text>
        <View style={styles.leaderboardSection}>
          <FlatList
            data={leaderboard}
            keyExtractor={item => String(item.id)}
            renderItem={renderUser}
            style={{ marginTop: 0 }}
          />
        </View>
      </View>
    </View>
  );
}

// Styles have been slightly adjusted for the new data structure
const styles = StyleSheet.create({
  sectionDivider: {
    height: 2,
    backgroundColor: '#eafaf1',
    marginVertical: 12,
    borderRadius: 2,
    width: '90%',
    alignSelf: 'center',
    opacity: 0.7,
  },
  leaderboardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 12,
    marginBottom: 2,
    marginTop: 2,
  },
  lessonsHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 2,
  },
  lessonsSubText: {
    fontSize: 14,
    color: '#27ae60',
    fontStyle: 'italic',
  },
  lessonCardModern: {
  width: 200,
  height: 170,
  backgroundColor: '#fff',
  borderRadius: 28,
  marginHorizontal: 12,
  marginVertical: 12,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: '#bbb',
  borderWidth: 2,
  shadowColor: '#27ae60',
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
  },
  lessonCompleteModern: {
    borderColor: '#27ae60',
    backgroundColor: '#eafaf1',
  },
  lessonIconBox: {
    backgroundColor: '#eafaf1',
    borderRadius: 16,
    padding: 8,
    marginBottom: 6,
  },
  lessonIcon: {
    width: 32,
    height: 32,
  },
  lessonTitleModern: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 5,
  },
  lessonProgressBarBg: {
    height: 8,
    backgroundColor: '#eafaf1',
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 2,
    width: '90%',
    overflow: 'hidden',
  },
  lessonProgressBarFill: {
    height: 8,
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  lessonStatusModern: {
    fontSize: 13,
    color: '#27ae60',
    marginTop: 4,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
    backgroundColor: '#f6fff8',
    paddingTop: 40,
    paddingHorizontal: 8,
    paddingBottom: 40,
  },
  timeChip: {
    backgroundColor: '#eafaf1',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  timeChipActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 12,
    borderColor: '#eafaf1',
    borderWidth: 1,
elevation: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  points: {
    fontSize: 14,
    color: '#27ae60',
  },
  badge: {
    fontSize: 12,
    color: '#27ae60', 
    fontStyle: 'italic',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginLeft: 8,
  },
  leaderboardSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 180,
    maxHeight: 400,
  },
  lessonsHeaderBox: {
    backgroundColor: '#eafaf1',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  }
});