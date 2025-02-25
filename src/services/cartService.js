// src/services/cartService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getCart = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/orders/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cartService = {
  getCart,
};

export default cartService;