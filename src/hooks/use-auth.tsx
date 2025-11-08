'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// This is a mock authentication context.
// In a real application, you would integrate with a real authentication service like Firebase Auth.

interface AuthContextType {
  user: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user
    try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setUser(loggedIn);
    } catch (error) {
        // localStorage is not available on the server
    }
    setLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setUser(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
