import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ChatView from '../components/ChatView';

export default function CommunityDetail(props) {
  // Support both Expo Router and React Navigation
  const community = props.route?.params?.community || props.community || null;

  if (!community) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#27ae60' }}>No community data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{community.name}</Text>
      <Text style={styles.description}>{community.description}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posts & Discussion</Text>
        <Text>Coming soon...</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Chat</Text>
        <ChatView communityId={community.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
