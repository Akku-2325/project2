// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Handle cases where error.response is undefined
    const message = error.response ? error.response.data.message : error.message;
    throw new Error(message || 'Registration failed');
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Handle cases where error.response is undefined
    const message = error.response ? error.response.data.message : error.message;
    throw new Error(message || 'Login failed');
  }
};

const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response ? error.response.data.message : error.message;
    throw new Error(message || 'Failed to get profile');
  }
};

const authService = {
  register,
  login,
  getProfile,
};

export default authService;