import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';

// Example usage: const { messages, sendMessage } = useChat(roomId)
export function useChat(roomId) {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  // Fetch historical messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat/rooms/${roomId}/messages`);
        const data = await res.json();
        setMessages(data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      } catch (e) {
        // handle error
      }
    }
    fetchMessages();
  }, [roomId]);

  // WebSocket connection
  useEffect(() => {
    ws.current = new WebSocket(`wss://yourserver.com/api/chat/rooms/${roomId}/ws`);
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };
    return () => {
      ws.current && ws.current.close();
    };
  }, [roomId]);

  // Send message
  const sendMessage = (content, mediaUrl, messageType = 'text') => {
    ws.current && ws.current.send(JSON.stringify({ content, mediaUrl, messageType }));
  };

  return { messages, sendMessage };
}

// Helper: Group messages by date
export function groupMessagesByDate(messages) {
  const groups = {};
  messages.forEach(msg => {
    const date = new Date(msg.created_at).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  return groups;
}
