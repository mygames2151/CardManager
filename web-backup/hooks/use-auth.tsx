import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { LocalStorage } from '@/lib/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  resetPin: (answer: string, newPin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user was previously authenticated (optional - for better UX)
    const wasAuthenticated = sessionStorage.getItem('authenticated');
    if (wasAuthenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (pin: string): boolean => {
    const savedPin = LocalStorage.getPin();
    if (pin === savedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('authenticated');
  };

  const resetPin = (answer: string, newPin: string): boolean => {
    if (answer.toUpperCase() === 'LUDO') {
      LocalStorage.setPin(newPin);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, resetPin }}>
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
