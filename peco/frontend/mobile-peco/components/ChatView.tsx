import { groupMessagesByDate } from '../hooks/useChat';
import React from 'react';
import { View, Text, Image } from 'react-native';

// messages: array of message objects
const ChatView = ({ messages }) => {
  const grouped = groupMessagesByDate(messages);
  return (
    <View style={{ flex: 1, padding: 12 }}>
      {Object.entries(grouped).map(([date, msgs]) => (
        <View key={date}>
          <Text style={{ fontWeight: 'bold', marginVertical: 8 }}>{date}</Text>
          {msgs.map((msg, idx) => (
            <View key={msg.id || idx} style={{ marginBottom: 8, alignSelf: msg.sender_id === 'me' ? 'flex-end' : 'flex-start' }}>
              {msg.media_url && (
                <Image source={{ uri: msg.media_url }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 4 }} />
              )}
              <View style={{ backgroundColor: '#eee', borderRadius: 8, padding: 8 }}>
                <Text>{msg.content}</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{new Date(msg.created_at).toLocaleTimeString()}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ChatView;
