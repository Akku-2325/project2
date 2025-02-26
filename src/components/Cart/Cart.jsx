// src/components/Cart.jsx
import React from 'react';
import { useCart } from '../../context/CartContext'; // Исправленный путь
import CartBase from '../CartBase'; // Исправленный путь

function Cart() {
  const { cartItems, removeItem, updateQuantity, loading } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <CartBase
      cartItems={cartItems}
      removeItem={removeItem}
      updateQuantity={updateQuantity}
      calculateTotal={calculateTotal}
    />
  );
}

export default Cart;