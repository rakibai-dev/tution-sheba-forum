import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { clearTeachersCache } from '../services/teacherStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [lockedUntil, setLockedUntil] = useState(null);

  // Check existing session on mount
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/.netlify/functions/auth/verify', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (password) => {
    setAuthError(null);
    try {
      const res = await fetch('/.netlify/functions/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      let data = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          // ignore
        }
      }

      if (res.ok) {
        setIsAuthenticated(true);
        setLockedUntil(null);
        setAuthError(null);
        return { success: true };
      }

      if (res.status === 500) {
        const msg = data.error || 'Server configuration error: missing ADMIN_PASSWORD or JWT_SECRET on Netlify.';
        setAuthError(msg);
        return { success: false, error: msg };
      }

      if (res.status === 429) {
        setLockedUntil(data.lockedUntil || Date.now() + (data.remainingSeconds || 300) * 1000);
        setAuthError(data.error || 'Too many failed attempts. Try again later.');
        return { success: false, locked: true, remainingSeconds: data.remainingSeconds };
      }

      const msg = data.remainingAttempts != null
        ? `${data.error}. ${data.remainingAttempts} attempts remaining.`
        : (data.error || `Login failed (${res.status} ${res.statusText || 'Error'})`);

      setAuthError(msg);
      return { success: false, error: msg };
    } catch (err) {
      const msg = 'Network error during login. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Logout handler (clears session and purges local offline database)
  const logout = async () => {
    try {
      await fetch('/.netlify/functions/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continue cleanup even if network request fails
    }

    try {
      // Wipe IndexedDB cache completely for maximum privacy
      await clearTeachersCache();
    } catch (err) {
      console.warn('Failed to clear teacher storage during logout:', err);
    }

    setIsAuthenticated(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        authError,
        lockedUntil,
        login,
        logout,
        checkAuth,
      }}
    >
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
