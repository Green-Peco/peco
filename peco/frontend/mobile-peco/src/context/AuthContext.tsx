import { createContext, useState, useEffect, useContext, ReactNode, FC } from 'react'; // Import FC here
import * as api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the shape of the user object and the auth context
interface User {
  id: number;
  username: string;
  xp: number;
  level: number;
  // Add any other user properties you expect from the API
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAction: (loginPromise: Promise<any>) => Promise<void>;
  logoutAction: (logoutPromise: Promise<any>) => Promise<void>;
  refetchUser: () => Promise<void>;
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => { // Use FC directly
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = async () => {
    try {
      const response = await api.getUserProfile();
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('User not authenticated on refetch', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await refetchUser();
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const loginAction = async (loginPromise: Promise<any>) => {
    try {
      const response = await loginPromise;
      if (response.data.user) {
        await refetchUser(); // Fetch the full user profile after login
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logoutAction = async (logoutPromise: Promise<any>) => {
    try {
      await logoutPromise;
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, loginAction, logoutAction, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType; // Explicitly cast the context
};
