import axios from 'axios';
import Constants from 'expo-constants';

// --- The Best Way to Connect to a Local Backend in Expo ---
// This function determines the correct backend URL whether you're running on web or a mobile device.
function getBackendUrl() {
  // Get the host URI from Expo's constants
  const hostUri = Constants.expoConfig?.hostUri;
  
  if (hostUri) {
    // On mobile, hostUri is like '192.168.1.100:8081'. We need to replace the port.
    const ipAddress = hostUri.split(':')[0];
    return `http://${ipAddress}:3000/api/v1`;
  } else {
    // Fallback for web or other environments
    return 'http://localhost:3000/api/v1';
  }
}

const baseURL = getBackendUrl();
console.log(`Connecting to backend at: ${baseURL}`);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for sending session cookies
});


// === AUTHENTICATION ===
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');

// === COURSES & LESSONS ===
export const getCourses = (params) => api.get('/courses', { params });
export const getCourseDetails = (courseId) => api.get(`/courses/${courseId}`);
export const getLesson = (lessonId) => api.get(`/lessons/${lessonId}`);
export const completeLesson = (lessonId, answers) => api.post(`/lessons/${lessonId}/complete`, { answers });

// === USER ===
export const getUserProfile = () => api.get('/users/profile');
export const getUserProgress = () => api.get('/users/progress');
export const getUserAchievements = () => api.get('/users/achievements');
export const getLeaderboard = () => api.get('/users/leaderboard');

// === POSTS (TWITTER-STYLE FEED) ===
export const getPosts = () => api.get('/posts');
export const createPost = (data) => api.post('/posts', data);

// === COMMUNITIES ===
export const getCommunities = () => api.get('/communities');
export const getCommunityDetails = (communityId) => api.get(`/communities/${communityId}`);
export const joinCommunity = (communityId) => api.post(`/communities/${communityId}/join`);

// === CHAT ===
export const getChatRooms = () => api.get('/chat/rooms');
export const getMessages = (roomId) => api.get(`/chat/rooms/${roomId}/messages`);


// ===============================================================
// The following APIs do not exist in the current backend.
// They are commented out to prevent errors.
// ===============================================================

// export const getFeed = (params) => api.get('/feed', { params });
// ... (rest of commented out code remains the same)
