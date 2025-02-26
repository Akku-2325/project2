import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { theme } from '../utils/theme';
import CartBase from './CartBase';

const CheckoutContainer = styled.div`
  padding: ${theme.spacing.xlarge};
  background-color: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  max-width: 600px;
  margin: 0 auto;
`;

const CheckoutButton = styled.button`
  padding: ${theme.spacing.medium};
  background-color: ${theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  box-shadow: ${theme.boxShadow};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: darken(${theme.colors.accent}, 10%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.small};
  margin-top: -${theme.spacing.small};
  margin-bottom: ${theme.spacing.medium};
`;

const Input = styled.input`
  margin-bottom: ${theme.spacing.medium};
  padding: ${theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.medium};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25); /* Subtle glow */
  }
`;

const Select = styled.select`
  margin-bottom: ${theme.spacing.medium};
  padding: ${theme.spacing.small};
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.medium};
`;

function CheckoutPage() {
  const { cartItems, clearCart, removeItem, updateQuantity } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  // State for validation errors
  const [addressError, setAddressError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const validateForm = () => {
    let isValid = true;
    setAddressError('');
    setPaymentError('');

    if (!shippingAddress.street || shippingAddress.street.trim() === "") {
      setAddressError('Please enter a valid street address');
      isValid = false;
    }

      if (!shippingAddress.city || shippingAddress.city.trim() === "") {
          setAddressError('Please enter a valid city');
          isValid = false;
      }

      if (!shippingAddress.state || shippingAddress.state.trim() === "") {
          setAddressError('Please enter a valid state');
          isValid = false;
      }

      if (!shippingAddress.zip || shippingAddress.zip.trim() === "") {
          setAddressError('Please enter a valid zip');
          isValid = false;
      }

    if (!paymentMethod) {
      setPaymentError('Please select a payment method');
      isValid = false;
    }

    return isValid;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return; // Stop checkout if the form is not valid
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: {
            street: shippingAddress.street.trim(),
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            zip: shippingAddress.zip.trim()
          },
          paymentMethod: paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `Failed to checkout: ${response.status}`);
        return;
      }

      // const data = await response.json(); // Process response data if needed
      alert('Checkout successful!');
      clearCart();
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Error during checkout:", error);
      setError(error.message || "Failed to checkout");
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for input changes in shipping address form
  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Handler for payment method selection
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <CheckoutContainer>
      <h2>Checkout</h2>
      <CartBase
        cartItems={cartItems}
        removeItem={removeItem}
        updateQuantity={updateQuantity}
        calculateTotal={calculateTotal}
      />

      {/* Shipping Address Form */}
      <h3>Shipping Address</h3>
      <Input
        type="text"
        placeholder="Street Address (e.g., 123 Main St)"
        name="street"
        value={shippingAddress.street}
        onChange={handleAddressChange}
      />
      <Input
        type="text"
        placeholder="City (e.g., Anytown)"
        name="city"
        value={shippingAddress.city}
        onChange={handleAddressChange}
      />
        <Input
            type="text"
            placeholder="State (e.g., CA)"
            name="state"
            value={shippingAddress.state}
            onChange={handleAddressChange}
        />
        <Input
            type="text"
            placeholder="Zip Code (e.g., 90210)"
            name="zip"
            value={shippingAddress.zip}
            onChange={handleAddressChange}
        />
      {addressError && <ErrorMessage>{addressError}</ErrorMessage>}

      {/* Payment Method Selection */}
      <h3>Payment Method</h3>
      <Select name="paymentMethod" value={paymentMethod} onChange={handlePaymentChange}>
        <option value="">Select Payment Method</option>
        <option value="creditCard">Credit Card</option>
        <option value="paypal">PayPal</option>
      </Select>
      {paymentError && <ErrorMessage>{paymentError}</ErrorMessage>}

      <CheckoutButton
        onClick={handleCheckout}
        disabled={
          loading ||
          !shippingAddress.street ||
          shippingAddress.street.trim() === "" ||
          !shippingAddress.city ||
          shippingAddress.city.trim() === "" ||
          !shippingAddress.state ||
          shippingAddress.state.trim() === "" ||
          !shippingAddress.zip ||
          shippingAddress.zip.trim() === "" ||
          !paymentMethod
        }
      >
        {loading ? 'Processing...' : 'Checkout'}
      </CheckoutButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </CheckoutContainer>
  );
}

export default CheckoutPage;