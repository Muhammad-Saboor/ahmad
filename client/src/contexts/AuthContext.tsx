import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, type User, getAuthToken, setAuthToken } from '../services/apiClient';

type AuthContextType = {
  user: User | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = getAuthToken();
    if (token) {
      // In a real app, you might want to validate the token with the server
      // For now, we'll assume the token is valid if it exists
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, email: payload.email });
      } catch (error) {
        // Invalid token, remove it
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.signUp(email, password);
      
      // Store the token
      if (response.token) {
        setAuthToken(response.token);
      }
      
      setUser(response.user);
      return { error: null };
    } catch (error) {
      console.error('SignUp error:', error);
      return { error: { message: error instanceof Error ? error.message : 'Sign up failed' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.signIn(email, password);
      
      // Store the token
      if (response.token) {
        setAuthToken(response.token);
      }
      
      setUser(response.user);
      return { error: null };
    } catch (error) {
      console.error('SignIn error:', error);
      return { error: { message: error instanceof Error ? error.message : 'Sign in failed' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authApi.signOut();
    } catch (error) {
      console.error('SignOut error:', error);
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};