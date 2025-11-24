import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from "react";
import FeedCard from "../components/FeedCard";
import { useRouter, useFocusEffect } from "expo-router";
import * as api from "../services/api";

export default function HomeFeedScreen() {
  const [sort, setSort] = useState("all"); // Filter by tags or post types if needed
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.getPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Alert.alert("Error", "Could not load posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  // Filter posts by selected chip (not implemented on backend yet, so frontend filter)
  const filteredPosts = sort === "all"
    ? posts
    : posts.filter(post => post.tags && post.tags.includes(sort)); // Assuming tags are used for filtering

  const renderPost = ({ item }) => (
    <FeedCard 
      item={{
        id: item.id,
        type: item.tags && item.tags.length > 0 ? item.tags[0].toUpperCase() : 'POST', // Use first tag as type
        title: item.content.substring(0, 50) + (item.content.length > 50 ? '...' : ''), // First 50 chars as title
        author: item.author || 'Anonymous',
        excerpt: item.content,
        location: 'Global', // Placeholder
        votes: 0, // Not implemented yet
        comments: 0, // Not implemented yet
        timeAgo: new Date(item.created_at).toLocaleDateString(), // Format time
        verified: false, // Placeholder
        thumbnail: item.media_url,
      }} 
    />
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#27ae60" style={{ flex: 1, justifyContent: 'center' }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar: centered PECO logo */}
      <View style={styles.headerRowCentered}>
        <Text style={styles.logoText}>PECO</Text>
      </View>

      {/* Filter chip row: All, Report, News, Lesson, Discussion */}
      <View style={styles.filterRow}>
        {["All", "Report", "News", "Lesson", "Discussion"].map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[
              styles.filterChip,
              sort === chip.toLowerCase() && styles.filterChipActive,
            ]}
            onPress={() => setSort(chip.toLowerCase())}
          >
            <Text
              style={{
                color: sort === chip.toLowerCase() ? "#fff" : "#27ae60",
                fontWeight: "bold",
              }}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FloatingActionButton: Create Post */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('CreatePostScreen')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Feed list */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#27ae60"]} tintColor="#27ae60" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRowCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60", // green accent
    letterSpacing: 2,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#eafaf1",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderColor: "#27ae60",
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: "#27ae60",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    zIndex: 10,
  },
  fabText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
});