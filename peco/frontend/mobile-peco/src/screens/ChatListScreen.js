import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatListScreen() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await api.getChatRooms();
      setChatRooms(response.data.rooms);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      Alert.alert("Error", "Could not load chat rooms.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChatRooms();
  }, []);

  const handleEnterChat = (room) => {
    router.push({ pathname: 'ChatScreen', params: { roomId: room.id, roomName: room.name } });
  };

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity style={styles.chatRoomCard} onPress={() => handleEnterChat(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.chatRoomName}>{item.name || 'Direct Chat'}</Text>
        <Text style={styles.chatRoomInfo}>{item.is_group ? 'Group Chat' : 'Direct Message'}</Text>
      </View>
      <Ionicons name="chatbubbles-outline" size={24} color="#27ae60" />
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
      <Text style={styles.header}>Your Chats</Text>
      <FlatList
        data={chatRooms}
        keyExtractor={item => String(item.id)}
        renderItem={renderChatRoom}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#27ae60"]} tintColor="#27ae60" />
        }
        ListEmptyComponent={!loading && !refreshing && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
            <Text style={{ color: '#27ae60', fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
              No chat rooms found.
            </Text>
            <Text style={{ color: '#333', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              Join a community to start chatting!
            </Text>
          </View>
        )}
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
  chatRoomCard: {
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
  chatRoomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatRoomInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
