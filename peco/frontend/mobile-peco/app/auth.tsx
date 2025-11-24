import React, { useState, FC } from 'react'; // Import FC
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext'; // 
import * as api from '../src/services/api';

const Auth: FC = () => { // Explicitly type as Functional Component
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginAction } = useAuth();

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await loginAction(api.login({ username, password }));
      } else {
        await api.register({ username, password });
        await loginAction(api.login({ username, password }));
      }
    } catch (e: any) { // Cast e to any for easier error handling
      const errorMessage = e.response?.data?.error || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.header}>PECO {isLogin ? 'Login' : 'Register'}</Text>
        <Text style={styles.subtext}> Demo Logins: Username: peco@gmail.com Password: 123. </Text>
        <TextInput 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
          style={styles.input} 
          autoCapitalize="none" 
        />
        <TextInput 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          style={styles.input} 
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginBtn} onPress={handleAuth} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>{isLogin ? 'Login' : 'Register'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)} disabled={loading}>
          <Text style={styles.switchBtnText}>{isLogin ? 'No account? Register' : 'Have an account? Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; // Change to const Auth: FC = () => { ... }

export default Auth; // Export the const

// Styles remain the same
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#eafaf1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
    letterSpacing: 1,
  },
  subtext: {
    fontSize: 15,
    color: '#27ae60',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: '#eafaf1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27ae60',
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#27ae60',
  },
  loginBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
    marginBottom: 16,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  switchBtn: {
    marginBottom: 8,
  },
  switchBtnText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
