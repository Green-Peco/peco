import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as api from '../services/api';
import FeedCard from '../components/FeedCard'; // Assuming FeedCard can display community posts

export default function CommunityDetailScreen() {
  const { communityId } = useLocalSearchParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]); // Posts associated with this community
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch community details
      const communityResponse = await api.getCommunityDetails(communityId);
      setCommunity(communityResponse.data.community);

      // This part requires linking posts to communities, which is not directly implemented in backend yet.
      // For now, let's just fetch all posts and filter them by a tag for demo purposes.
      // Or, ideally, the backend's getCommunityDetails would return associated posts.
      // Since it doesn't, we'll fetch all posts for now.
      const postsResponse = await api.getPosts();
      // This is a placeholder filter. In a real app, posts would have a community_id FK.
      setPosts(postsResponse.data.posts.filter(post => post.tags && post.tags.includes(communityResponse.data.community.name.toLowerCase().replace(/\s/g, ''))));

    } catch (error) {
      console.error("Failed to fetch community details or posts:", error);
      Alert.alert("Error", "Could not load community details.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [communityId])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [communityId]);

  const renderPost = ({ item }) => (
    <FeedCard 
      item={{
        id: item.id,
        type: item.tags && item.tags.length > 0 ? item.tags[0].toUpperCase() : 'POST',
        title: item.content.substring(0, 50) + (item.content.length > 50 ? '...' : ''),
        author: item.author || 'Anonymous',
        excerpt: item.content,
        location: 'Community',
        votes: 0,
        comments: 0,
        timeAgo: new Date(item.created_at).toLocaleDateString(),
        verified: false,
        thumbnail: item.media_url,
      }} 
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Community not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.communityHeader}>{community.name}</Text>
      <Text style={styles.communityDescription}>{community.description}</Text>

      <View style={styles.postsSection}>
        <Text style={styles.postsHeader}>Community Posts</Text>
        <FlatList
          data={posts}
          keyExtractor={item => String(item.id)}
          renderItem={renderPost}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#27ae60"]} tintColor="#27ae60" />
          }
          ListEmptyComponent={<Text style={styles.noPostsText}>No posts in this community yet.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f6fff8',
  },
  communityHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
    textAlign: 'center',
  },
  communityDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  postsSection: {
    flex: 1,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  postsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noPostsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
