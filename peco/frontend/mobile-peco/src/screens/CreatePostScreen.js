import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as api from '../services/api';

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      await api.createPost({ content, media_url: mediaUrl, tags: parsedTags });
      Alert.alert('Success', 'Post created successfully!');
      router.back(); // Go back to the feed
    } catch (error) {
      console.error("Failed to create post:", error);
      Alert.alert('Error', 'Could not create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.input}
        placeholder="Media URL (optional)"
        value={mediaUrl}
        onChangeText={setMediaUrl}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated, optional)"
        value={tags}
        onChangeText={setTags}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Post</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6fff8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eafaf1',
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    minHeight: 50,
  },
  button: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
