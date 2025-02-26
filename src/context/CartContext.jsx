import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const [isUpdating, setIsUpdating] = useState(false); // Added isUpdating state

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
    window.setCartItemsFromAuth = setCartItems;
  }, [token, fetchCart]);

  const addItem = useCallback(async (product, quantity) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/orders/cart/items`,
        { productId: product._id, quantity: quantity, price: product.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [token, API_URL, fetchCart, isUpdating]);

  const removeItem = useCallback(async (productId) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/orders/cart/items/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [token, API_URL, fetchCart, isUpdating]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLoading(true);
    try {
      if (quantity <= 0) {
        await removeItem(productId);
      } else {
        const itemToUpdate = cartItems.find(item => item.product._id === productId);
        if (itemToUpdate) {
          const price = itemToUpdate.product.price;
          await axios.put(
            `${API_URL}/orders/cart/items/${productId}`,
            { quantity: quantity, price: price },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          console.warn("Product not found in cart");
        }
      }
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      alert(`Error updating quantity: ${error.message}`);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [token, API_URL, cartItems, fetchCart, removeItem, isUpdating]);

  const clearCart = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  }, [token, API_URL, fetchCart, isUpdating]);

  const value = {
    cartItems,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);