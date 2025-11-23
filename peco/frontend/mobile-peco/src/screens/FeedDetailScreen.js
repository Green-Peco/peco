// FeedDetailScreen: show full post, image, map mini, comments
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { getFeedItem, postComment } from '../services/api';

export default function FeedDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const res = await getFeedItem(id);
        setItem(res.data);
        setComments(res.data.comments || []);
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleComment = async () => {
    // For MVP, assume user_id is available
    await postComment(id, 'user_id', comment);
    setComment('');
    // Optionally refresh comments
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  if (!item) return <Text>Post not found.</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {item.image && <Image source={{ uri: item.image }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }} />}
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.title}</Text>
      <Text style={{ marginVertical: 8 }}>{item.body}</Text>
      {/* Map mini and location link here */}
      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(c, i) => i.toString()}
        renderItem={({ item }) => <Text style={{ marginVertical: 2 }}>{item.author}: {item.text}</Text>}
        ListEmptyComponent={<Text style={{ color: '#888', marginVertical: 8 }}>No comments yet.</Text>}
      />
      <TextInput placeholder="Add comment" value={comment} onChangeText={setComment} style={{ borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 8 }} />
      <Button title="Post Comment" onPress={handleComment} />
    </View>
  );
}
