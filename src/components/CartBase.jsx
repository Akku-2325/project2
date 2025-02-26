// src/components/CartBase.jsx
import React from 'react';
import styled from 'styled-components';
import { theme } from '../utils/theme';

const CartContainer = styled.div`
  padding: ${theme.spacing.xlarge};
  background-color: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  max-width: 600px;
  margin: 0 auto;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.medium};
  padding-bottom: ${theme.spacing.medium};
  border-bottom: 1px solid #eee;
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${theme.borderRadius};
`;

const CartItemDetails = styled.div`
  flex-grow: 1;
  margin-left: ${theme.spacing.large};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border: 1px solid #ccc;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CartTotal = styled.div`
  margin-top: ${theme.spacing.large};
  font-size: ${theme.fontSizes.large};
  font-weight: bold;
  text-align: right;
`;

function CartBase({ cartItems, removeItem, updateQuantity, calculateTotal }) {
  return (
    <CartContainer>
      {cartItems.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem key={item.product._id}>
              <CartItemImage src={item.product.images[0]} alt={item.product.name} />
              <CartItemDetails>
                <h3>{item.product.name}</h3>
                <p>Price: ${item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
              </CartItemDetails>
              <QuantityControls>
                <QuantityButton onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</QuantityButton>
                <span>{item.quantity}</span>
                <QuantityButton onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</QuantityButton>
                <button onClick={() => removeItem(item.product._id)}>Remove</button>
              </QuantityControls>
            </CartItem>
          ))}
          <CartTotal>Total: ${calculateTotal()}</CartTotal>
        </>
      )}
    </CartContainer>
  );
}

export default CartBase;