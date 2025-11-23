// ProfileScreen: show avatar, username, points, badges, rank
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const genericAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const mockUser = {
  name: 'Aisha',
  displayName: 'Aisha',
  avatar: genericAvatar,
  points: 320,
  badge: 'Tree Planter',
  nextBadge: 'Eco Hero',
  progress: 0.7,
  achievements: ['Tree Planter', 'Reporter', 'Learner'],
  communities: ['Green Valley', 'Tree Guardians'],
  stats: {
    posts: 12,
    reports: 5,
    treesPlanted: 20,
    lessonsCompleted: 8,
  },
  recentActivity: [
    { type: 'Report', title: 'Illegal Logging Reported', time: '2h ago' },
    { type: 'Lesson', title: 'How to Protect Forests', time: '1d ago' },
    { type: 'Post', title: 'Fire Prevention Tips', time: '3d ago' },
  ],
};

export default function ProfileScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode
    ? {
        bg: '#1a2e1a',
        fg: '#eafaf1',
        accent: '#27ae60',
        card: '#223d22',
      }
    : {
        bg: '#f6fff8',
        fg: '#333',
        accent: '#27ae60',
        card: '#fff',
      };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user_id');
    navigation.replace('Auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f6fff8' }]}>
      <View style={styles.headerSection}>
        <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{mockUser.displayName}</Text>
        <Text style={styles.username}>@{mockUser.name}</Text>
        <Text style={styles.points}>{mockUser.points} pts</Text>
        <Text style={styles.badge}>Current Badge: {mockUser.badge}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${mockUser.progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(mockUser.progress * 100)}% to next badge ({mockUser.nextBadge})</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsRow}>
          {mockUser.achievements.map((ach, idx) => (
            <View key={idx} style={styles.achievementChip}>
              <Text style={{ color: '#27ae60' }}>{ach}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <Text>Posts: {mockUser.stats.posts}</Text>
        <Text>Reports: {mockUser.stats.reports}</Text>
        <Text>Trees Planted: {mockUser.stats.treesPlanted}</Text>
        <Text>Lessons Completed: {mockUser.stats.lessonsCompleted}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communities</Text>
        <View style={styles.achievementsRow}>
          {mockUser.communities.map((c, idx) => (
            <View key={idx} style={styles.communityChip}>
              <Text style={{ color: '#27ae60' }}>{c}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Recent Activity</Text>
        <FlatList
          data={mockUser.recentActivity}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => (
            <View style={[styles.activityRow, { backgroundColor: theme.card }]}>
              <Text style={[styles.activityType, { color: theme.accent }]}>{item.type}</Text>
              <Text style={[styles.activityTitle, { color: theme.fg }]}>{item.title}</Text>
              <Text style={[styles.activityTime, { color: theme.accent }]}>{item.time}</Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  username: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 4,
  },
  points: {
    fontSize: 16,
    color: '#27ae60',
    marginBottom: 2,
  },
  badge: {
    fontSize: 14,
    color: '#27ae60',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#eafaf1',
    borderRadius: 4,
    marginTop: 6,
    marginBottom: 2,
    width: '80%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#27ae60',
    marginTop: 2,
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 6,
  },
  achievementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  achievementChip: {
    backgroundColor: '#eafaf1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  communityChip: {
    backgroundColor: '#eafaf1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
    borderRadius: 8,
    padding: 8,
  },
  logoutBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 4,
    marginTop: 24,
  },
});
