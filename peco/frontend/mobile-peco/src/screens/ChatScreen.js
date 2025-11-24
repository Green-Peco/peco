import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import Constants from 'expo-constants'; // For getting the correct backend URL

// Function to get the correct backend URL for WebSocket connection
function getBackendWebSocketUrl() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ipAddress = hostUri.split(':')[0];
    return `http://${ipAddress}:3000`; // Use backend port 3000
  }
  return 'http://localhost:3000'; // Fallback for web
}

const SOCKET_URL = getBackendWebSocketUrl();

export default function ChatScreen() {
  const { roomId, roomName } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get current user from AuthContext

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user || !user.id) return; // Only connect if user is logged in

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { userId: user.id } // Pass user ID for authentication/identification
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      newSocket.emit('joinRoom', roomId);
    });

    newSocket.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, roomId]); // Reconnect if user or roomId changes

  // Fetch historical messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await api.getMessages(roomId);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        Alert.alert("Error", "Could not load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [roomId]);

  const handleSendMessage = () => {
    if (socket && newMessage.trim() && user) {
      const messageData = {
        roomId: roomId,
        senderId: user.id,
        content: newMessage.trim(),
        messageType: 'text',
        // mediaUrl: '', // Not yet implemented
        // replyToId: null, // Not yet implemented
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.senderId === user?.id ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.senderUsername}>{item.sender_username || 'Unknown'}</Text>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageTime}>{new Date(item.created_at).toLocaleTimeString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <Text style={styles.header}>{roomName || 'Chat Room'}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => String(item.id)}
        renderItem={renderMessage}
        inverted // To show latest messages at the bottom
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6fff8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f6fff8',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android status bar
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    padding: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageListContent: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6', // Light green
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  senderUsername: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#27ae60',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
