import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, walletAddress?: string) => Promise<boolean>;
  googleLogin: (credential: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('urjalink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        return false;
      }
      
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('urjalink_user', JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error("An error occurred during login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, walletAddress?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData.message);
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('urjalink_user', JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error("An error occurred during signup:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credential: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google login failed:", errorData.message);
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('urjalink_user', JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error("An error occurred during Google login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('urjalink_user');
  };

  const value = {
    user,
    login,
    signup,
    googleLogin,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};