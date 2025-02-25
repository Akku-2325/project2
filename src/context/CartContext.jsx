import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import useAuth

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false); // Добавлено состояние загрузки
  const { token } = useAuth(); // Get token from AuthContext
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items); // Assuming the cart items are in response.data.items
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL, axios]);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]); // Clear cart if user logs out
    }
    window.setCartItemsFromAuth = setCartItems; // Добавляем функцию в window
  }, [token, fetchCart]);

  const addItem = async (product, quantity) => {
    setLoading(true);
    console.log("Adding item:", product, quantity); // ADDED
    try {
      console.log("Token:", token); // ADDED
      console.log("API URL:", API_URL); // ADDED
      const response = await axios.post(
        `${API_URL}/orders/cart/items`,
        { productId: product._id, quantity: quantity, price: product.price }, // Send price
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add item response:", response); // ADDED
      fetchCart(); // Refresh cart after adding item
    } catch (error) {
      console.error("Error adding item to cart:", error);
      console.log("Add item error:", error); // ADDED
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/orders/cart/items/${productId}`, { // ИЗМЕНЕНО
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // Refresh cart after removing item
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      if (quantity <= 0) {
        // Если количество товара <= 0, удаляем товар из корзины
        console.log("Removing item with productId:", productId);
        await removeItem(productId);
      } else {
        // Иначе, находим товар в корзине, чтобы получить его цену
        const itemToUpdate = cartItems.find(item => item.product._id === productId);
        if (itemToUpdate) {
          const price = itemToUpdate.product.price; // Берем цену из товара
          await axios.put(
            `${API_URL}/orders/cart/items/${productId}`,
            { quantity: quantity, price: price }, // Отправляем цену на бэкенд
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          console.warn("Product not found in cart"); // Логируем, если товар не найден
        }
      }
      fetchCart(); // Refresh cart after updating quantity
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      //Тут обработка ошибки для пользователя
      alert(`Error updating quantity: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCart(); // Refresh cart after clearing
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

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

export const useCart = () => {
  return useContext(CartContext);
};