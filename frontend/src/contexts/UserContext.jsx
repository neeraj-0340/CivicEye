import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../api/config';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  // In-memory cache — key: userId, value: user object
  const cache = useRef({});

  const fetchUser = useCallback(async (userId) => {
    if (!userId) return null;
    // Return from cache if available
    if (cache.current[userId]) {
      setUserData(cache.current[userId]);
      return cache.current[userId];
    }
    setLoading(true);
    try {
      const res = await api.get(`/user/viewuser/${userId}`);
      if (res.data) {
        cache.current[userId] = res.data;
        setUserData(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('UserContext: Error fetching user', err);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const clearUser = useCallback(() => {
    setUserData(null);
    cache.current = {};
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, fetchUser, clearUser, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export default UserContext;
