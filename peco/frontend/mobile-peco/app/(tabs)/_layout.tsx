import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

const GREEN = '#388e3c';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: '#bbb',
        tabBarStyle: { backgroundColor: 'white', borderTopColor: GREEN },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'feed':
              return <MaterialCommunityIcons name="pine-tree" size={size} color={color} />;
            case 'community':
              return <MaterialCommunityIcons name="account-group" size={size} color={color} />;
            case 'game':
              return <MaterialCommunityIcons name="leaf" size={size} color={color} />;
            case 'map':
              return <MaterialCommunityIcons name="map-marker" size={size} color={color} />;
            case 'profile':
              return <Ionicons name="person" size={size} color={color} />;
            case 'chat': // New Chat Tab
              return <Ionicons name="chatbubbles" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}>
  <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
  <Tabs.Screen name="community" options={{ title: 'Community' }} />
  <Tabs.Screen name="game" options={{ title: 'Game' }} />
  <Tabs.Screen name="map" options={{ title: 'Map' }} />
  <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
  <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
    </Tabs>
  );
}
