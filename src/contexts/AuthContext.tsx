import { createContext, useState, type ReactNode } from 'react';
import type { User, LoginDto, RegisterDto } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (data: LoginDto) => {
    const response = await authApi.login(data);
    const { token, username, role, userId } = response.data;

    const userData: User = { id: userId, username, role };

    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (data: RegisterDto) => {
    const response = await authApi.register(data);
    const { token, username, role, userId } = response.data;

    const userData: User = { id: userId, username, role };

    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'Admin';
  const isLoading = false; // No loading state needed since we initialize from localStorage

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
