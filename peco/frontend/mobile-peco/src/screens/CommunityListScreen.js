import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as api from '../services/api';

export default function CommunityListScreen() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.getCommunities();
      setCommunities(response.data.communities);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
      Alert.alert("Error", "Could not load communities.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCommunities();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCommunities();
  }, []);

  const handleJoinCommunity = async (communityId) => {
    try {
      await api.joinCommunity(communityId);
      Alert.alert('Success', 'You have joined the community!');
      // Optionally refresh communities or update UI
    } catch (error) {
      console.error("Failed to join community:", error);
      const errorMessage = error.response?.data?.error || 'Could not join community.';
      Alert.alert("Error", errorMessage);
    }
  };

  const renderCommunity = ({ item }) => (
    <TouchableOpacity
      style={styles.communityCard}
      onPress={() => router.push({ pathname: 'CommunityDetailScreen', params: { communityId: item.id } })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.communityName}>{item.name}</Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinCommunity(item.id)}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Communities</Text>
      <FlatList
        data={communities}
        keyExtractor={item => String(item.id)}
        renderItem={renderCommunity}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#27ae60"]} tintColor="#27ae60" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f6fff8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
    textAlign: 'center',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  joinButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
