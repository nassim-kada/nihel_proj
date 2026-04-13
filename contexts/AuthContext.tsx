'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  role: 'doctor' | 'patient';
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = 'mc_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUserState(JSON.parse(raw));
    } catch {}
    setLoading(false);

    // Sync state across multiple tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY) {
        if (e.newValue) {
          try {
            setUserState(JSON.parse(e.newValue));
          } catch {}
        } else {
          setUserState(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    localStorage.removeItem(USER_KEY);
    // Legacy keys
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('doctorEmail');
    localStorage.removeItem('doctorSpecialty');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
