// FeedCard: visual card for feed items
// Shows type pill, title, author, thumbnail, excerpt, location, votes, comments, time, quick actions
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function FeedCard({ item }) { // Removed navigation prop as it's not used directly
  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#388e3c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: 56, height: 56, borderRadius: 12, marginRight: 14, backgroundColor: '#e8f5e9' }}
          />
        ) : (
          <View style={{ width: 56, height: 56, borderRadius: 12, marginRight: 14, backgroundColor: '#eafaf1', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#27ae60' }}>No Image</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#388e3c', marginBottom: 2 }}>{item.title}</Text>
          <Text numberOfLines={2} style={{ color: '#333', fontSize: 15, marginBottom: 4 }}>{item.excerpt}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: '#666' }}>{item.author}</Text>
            <Text style={{ fontSize: 13, color: '#bbb', marginHorizontal: 6 }}>•</Text>
            <Text style={{ fontSize: 13, color: '#666' }}>{item.location}</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#388e3c', fontWeight: 'bold', fontSize: 15 }}>▲ {item.votes || 0}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18 }}>
          <Text style={{ color: '#388e3c', fontSize: 15 }}>💬 {item.comments_count || 0}</Text>
        </View>
        <Text style={{ marginLeft: 'auto', color: '#bbb', fontSize: 13 }}>{item.timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}
