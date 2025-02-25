// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      authService.getProfile(storedToken)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user: userData } = response;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      console.log("User data after login:", userData); // Add this line
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      const { token, user: userData } = response;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setLoading(true); // Set loading to true before logout
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false); // Set loading to false after logout
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};