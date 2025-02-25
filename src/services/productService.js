// src/services/productService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getAllProducts = async (params = {}) => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log("Fetching products from:", `${API_URL}/products`, "with params:", params, "with token:", token);
    const response = await axios.get(`${API_URL}/products`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    console.log("Products API response:", response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log("Deleting product from:", `${API_URL}/products/${id}`, "with token:", token);
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    console.log("Product API response:", response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const updateProduct = async (id, productData) => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log("Updating product from:", `${API_URL}/products/${id}`, "with token:", token, "and data:", productData);
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    console.log("Product API response:", response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const createProduct = async (productData) => { // Add createProduct
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log("Creating product from:", `${API_URL}/products`, "with token:", token, "and data:", productData);
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
    });
    console.log("Product API response:", response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const productService = {
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct, // Add createProduct
};

export default productService;