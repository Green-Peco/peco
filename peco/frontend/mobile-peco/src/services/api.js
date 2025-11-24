// All API URLs are defined here for easy switching
// baseURL for backend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
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


// ===============================================================
// The following APIs do not exist in the current backend.
// They are commented out to prevent errors.
// ===============================================================

// export const getFeed = (params) => api.get('/feed', { params });
// export const createReport = (formData) => api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// export const getReports = () => api.get('/reports');
// export const getFeedItem = (id) => api.get(`/feed/${id}`);
// export const postComment = (id, user_id, text) => api.post(`/feed/${id}/comment`, { user_id, text });
// export const postVote = (id, user_id, delta) => api.post(`/feed/${id}/vote`, { user_id, delta });
// export const getNdvi = (lat, lng, user_id) => api.get('/antugrow/ndvi', { params: { lat, lng, user_id } });
// export const analyzeImage = (user_id, file) => api.post('/antugrow/analyze-image', { user_id, file });
// export const getChatRooms = () => api.get('/chat/rooms');
// export const getMessages = (roomId) => api.get(`/chat/rooms/${roomId}/messages`);
// export const uploadMedia = (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return api.post('/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// };
// export const getFeedPosts = () => api.get('/feed/posts');
// export const createPost = (data) => api.post('/feed/posts', data);
// export const reportContent = (data) => api.post('/reports', data);
// export const getPoll = (postId) => api.get(`/polls/${postId}`);
// export const votePoll = (pollId, userId, optionSelected) =>
//   api.post(`/polls/${pollId}/vote`, { userId, optionSelected });