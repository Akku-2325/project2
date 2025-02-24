// src/App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import styled from 'styled-components';
import AuthForm from './components/Auth/AuthForm';
import ProductDetails from './components/Product/ProductDetails'; // Import ProductDetails

const AppContainer = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

function App() {
  return (
    <AppContainer>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            {/* Protect the products route */}
            <Route
              path="/products"
              element={
                <PrivateRoute
                  redirectTo="/auth"
                  message="You must log in to view products."
                >
                  <ProductsPage />
                </PrivateRoute>
              }
            />
            {/* Add the route for ProductDetails */}
            <Route path="/product/:id" element={
              <PrivateRoute
                redirectTo="/auth"
                message="You must log in to view product details."
              >
                <ProductDetails />
              </PrivateRoute>
            } />
            {/* Protect the cart route (assuming you have one) */}
            {/* If you have a CartPage component, protect it like this: */}
            {/*
            <Route
              path="/cart"
              element={
                <PrivateRoute
                  redirectTo="/auth"
                  message="You must log in to view your cart."
                >
                  <CartPage />
                </PrivateRoute>
              }
            />
            */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;