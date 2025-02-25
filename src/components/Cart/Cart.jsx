import React from 'react';
import { useCart } from '../../context/CartContext';
import styled from 'styled-components';
const CartContainer = styled.div`
    padding: 20px;
`;

const CartItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

const CartItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
`;

const CartItemDetails = styled.div`
    flex-grow: 1;
    margin-left: 20px;
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
`;

const QuantityButton = styled.button`
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const CartTotal = styled.div`
    margin-top: 20px;
    font-size: 1.2em;
    font-weight: bold;
    text-align: right;
`;

const ClearCartButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;

    &:hover {
        background-color: #c82333;
    }
`;

function Cart() {
    const { cartItems, removeItem, updateQuantity, clearCart, loading } = useCart();
  
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };
  
    if (loading) {
      return <div>Loading cart...</div>;
    }
  
    return (
      <CartContainer>
        <h2>Cart</h2>
        {cartItems.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          <>
            {cartItems.map((item) => (
              <CartItem key={item.product?._id}>
                <CartItemImage src={item?.product?.images[0]} alt={item?.product?.name} />
                <CartItemDetails>
                  <h3>{item?.product?.name}</h3>
                  <p>Price: ${item?.product?.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </CartItemDetails>
                <QuantityControls>
                  <QuantityButton onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</QuantityButton> {/* ИЗМЕНЕНО */}
                  <span>{item.quantity}</span>
                  <QuantityButton onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</QuantityButton> {/* ИЗМЕНЕНО */}
                  <button onClick={() => removeItem(item.product._id)}>Remove</button> {/* ИЗМЕНЕНО */}
                </QuantityControls>
              </CartItem>
            ))}
            <CartTotal>Total: ${calculateTotal()}</CartTotal>
            <ClearCartButton onClick={clearCart}>Clear Cart</ClearCartButton>
          </>
        )}
      </CartContainer>
    );
  }
  
  export default Cart;