import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Demo credentials
  const DEMO_USER = { username: 'peco@gmail.com', password: '123' };

  const handleAuth = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (isLogin) {
        if (username === DEMO_USER.username && password === DEMO_USER.password) {
          router.replace('/(tabs)/feed');
        } else {
          setError('Invalid credentials. Try peco@gmail.com / 123 or register below.');
        }
      } else {
        // Demo register: accept any username/password
        router.replace('/(tabs)/feed');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.header}>PECO {isLogin ? 'Login' : 'Register'}</Text>
        <Text style={styles.subtext}>
          {isLogin
            ? 'Use demo: peco@gmail.com / 123. If you don\'t have an account, register below.'
            : 'Create a new account to get started.'}
        </Text>
        <TextInput placeholder="Email" value={username} onChangeText={setUsername} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.loginBtn} onPress={handleAuth} disabled={loading}>
          <Text style={styles.loginBtnText}>{isLogin ? 'Login' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchBtnText}>{isLogin ? 'No account? Register' : 'Have an account? Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
