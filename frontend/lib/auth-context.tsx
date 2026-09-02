'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, type UserResponse } from './api';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, company?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session on mount
    try {
      const savedToken = localStorage.getItem('nv_auth_token');
      const savedUser = localStorage.getItem('nv_auth_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (tok: string, usr: UserResponse) => {
    setToken(tok);
    setUser(usr);
    try {
      localStorage.setItem('nv_auth_token', tok);
      localStorage.setItem('nv_auth_user', JSON.stringify(usr));
    } catch {
      // ignore
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    saveSession(res.access_token, res.user);
  };

  const register = async (email: string, pass: string, name: string, company?: string) => {
    const res = await api.register({ email, password: pass, full_name: name, company_name: company });
    saveSession(res.access_token, res.user);
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    saveSession(res.access_token, res.user);
  };

  const logout = () => {
    if (token) {
      api.logout(token).catch(() => {});
    }
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('nv_auth_token');
      localStorage.removeItem('nv_auth_user');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
