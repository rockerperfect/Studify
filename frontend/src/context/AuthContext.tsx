import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  role: Role;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isTeacher: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  sessionReady: boolean; // true once the initial localStorage check is done
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Check if an ID looks like a real UUID (not a legacy demo placeholder) */
function isValidUserId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('studify_session');
    if (raw) {
      try {
        const parsed: User = JSON.parse(raw);
        // Purge stale demo sessions (e.g. "demo-student-id") that would fail DB FK checks
        if (parsed?.id && isValidUserId(parsed.id)) {
          setUser(parsed);
        } else {
          console.warn('[Auth] Stale demo session detected — clearing localStorage.');
          localStorage.removeItem('studify_session');
        }
      } catch {
        localStorage.removeItem('studify_session');
      }
    }
    setSessionReady(true);
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('studify_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studify_session');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isTeacher: user?.role === 'teacher',
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    sessionReady,
  };

  return (
    <AuthContext.Provider value={value}>
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
