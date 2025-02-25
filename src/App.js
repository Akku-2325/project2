// src/App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import AuthForm from './components/Auth/AuthForm';
import ProductDetails from './components/Product/ProductDetails';
import Cart from './components/Cart/Cart';
import AdminPanel from './pages/AdminPanel';
import { theme } from './utils/theme'; // Импортируем theme

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${theme.fonts.primary};
    color: ${theme.colors.primary};
    background-color: ${theme.colors.secondary};
    margin: 0;
    padding: 0;
    line-height: 1.6; /* Увеличим межстрочный интервал */
    -webkit-font-smoothing: antialiased; /* Улучшим отображение шрифтов */
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.secondary};
    font-weight: normal; /* Уберем жирный шрифт по умолчанию */
    margin-bottom: ${theme.spacing.medium};
  }

  a {
    color: ${theme.colors.accent};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: darken(${theme.colors.accent}, 10%);
    }
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.boxShadow};
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }

  /* Стили для модальных окон */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Убедимся, что модальное окно всегда сверху */
  }

  .modal-content {
    background-color: ${theme.colors.secondary};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.boxShadow};
    padding: ${theme.spacing.xlarge};
    max-width: 90%; /* Ограничим ширину модального окна */
    max-height: 90%;
    overflow: auto; /* Добавим прокрутку, если контент не помещается */
  }
`;

const AppContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.large}; /* Add padding to the main container */
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <Routes>
                <Route path="/auth" element={<AuthForm />} />
                <Route
                  path="/"
                  element={<PrivateRoute><HomePage /></PrivateRoute>}
                />
                <Route
                  path="/profile"
                  element={<PrivateRoute><ProfilePage /></PrivateRoute>}
                />
                <Route
                  path="/products"
                  element={
                    <PrivateRoute redirectTo="/auth" message="You must log in to view products.">
                      <ProductsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <PrivateRoute redirectTo="/auth" message="You must log in to view product details.">
                      <ProductDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute redirectTo="/auth" message="You must log in to view your cart.">
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute redirectTo="/auth" message="You must log in as an admin to view this page.">
                      <AdminPanel />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;