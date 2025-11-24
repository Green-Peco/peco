
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function ChatScreen() {
  // Simulate loading and empty state for now
  const loading: boolean = false; // Set to true to simulate loading
  const messages: any[] = []; // Replace with real messages from backend

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.infoText}>Loading chat...</Text>
      </View>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Join a community first to use chat.</Text>
      </View>
    );
  }

  // ...existing code for rendering messages...
  return (
    <View style={styles.container}>
      {/* Render messages here */}
      <Text>Chat Screen (Placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoText: {
    color: '#27ae60',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});
