import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'game', // A default screen inside tabs
};

function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    const inApp = segments[0] === '(tabs)';

    if (isAuthenticated && !inApp) {
      // User is authenticated but not in the main app layout, redirect to the 'game' tab
      router.replace('/game');
    } else if (!isAuthenticated && inApp) {
      // User is not authenticated but somehow in the app layout, redirect to auth
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
      <Stack screenOptions={{ headerShown: false }}>
        {/* These are the two main routes of the app */}
        <Stack.Screen name="auth" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="LessonDetailScreen" options={{ headerShown: true, title: 'Lesson Details' }} />
        <Stack.Screen name="CreatePostScreen" options={{ headerShown: true, title: 'Create Post' }} />
        <Stack.Screen name="CommunityListScreen" options={{ headerShown: true, title: 'Communities' }} />
        <Stack.Screen name="CommunityDetailScreen" options={{ headerShown: true, title: 'Community Details' }} />
        <Stack.Screen name="CreateCommunityScreen" options={{ headerShown: true, title: 'Create Community' }} />
        <Stack.Screen name="ChatListScreen" options={{ headerShown: true, title: 'Chats' }} />
        <Stack.Screen name="ChatScreen" options={{ headerShown: true, title: 'Chat Room' }} />
      </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Layout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}