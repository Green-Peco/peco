// All API URLs are defined here for easy switching
// baseURL for backend
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.46:3000',
});

export const register = (data) => api.post('/auth/register2', data);
export const login = (data) => api.post('/auth/login', data);
export const getFeed = (params) => api.get('/feed', { params });
export const createReport = (formData) => api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getReports = () => api.get('/reports');
export const getFeedItem = (id) => api.get(`/feed/${id}`);
export const postComment = (id, user_id, text) => api.post(`/feed/${id}/comment`, { user_id, text });
export const postVote = (id, user_id, delta) => api.post(`/feed/${id}/vote`, { user_id, delta });
export const getNdvi = (lat, lng, user_id) => api.get('/antugrow/ndvi', { params: { lat, lng, user_id } });
export const analyzeImage = (user_id, file) => api.post('/antugrow/analyze-image', { user_id, file });


// Lesson/Course APIs
export const getCourses = () => api.get('/api/courses');
export const getLesson = (lessonId) => api.get(`/api/lessons/${lessonId}`);
export const completeLesson = (userId, lessonId, answers) =>
  api.post('/lessons/complete', { userId, lessonId, answers });
export const getUserProgress = (userId) => api.get('/user/progress', { params: { userId } });

// Chat APIs
export const getChatRooms = () => api.get('/chat/rooms');
export const getMessages = (roomId) => api.get(`/chat/rooms/${roomId}/messages`);
export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// Feed APIs
export const getFeedPosts = () => api.get('/feed/posts');
export const createPost = (data) => api.post('/feed/posts', data);
export const reportContent = (data) => api.post('/reports', data);

// Poll APIs
export const getPoll = (postId) => api.get(`/polls/${postId}`);
export const votePoll = (pollId, userId, optionSelected) =>
  api.post(`/polls/${pollId}/vote`, { userId, optionSelected });
