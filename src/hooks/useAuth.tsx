import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, getAuthData, clearAuthData, setAuthData, generateToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const { user } = getAuthData();
      setUser(user);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Mock login function (in a real app, this would call an API)
  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Mock authentication logic
      // In a real app, this would be a server API call
      if (role === 'client' && email === 'client@example.com' && password === 'password') {
        const user: User = {
          id: '123',
          email,
          name: 'Demo Client',
          role: 'client',
          clientId: '456'
        };
        
        const token = generateToken(user);
        setAuthData(token, user);
        setUser(user);
      } 
      else if (role === 'staff' && email === 'staff@logicall.com' && password === 'password') {
        const user: User = {
          id: '789',
          email,
          name: 'Staff User',
          role: 'staff',
          staffRole: 'warehouse_manager'
        };
        
        const token = generateToken(user);
        setAuthData(token, user);
        setUser(user);
      } 
      else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
