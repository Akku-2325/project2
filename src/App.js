// src/App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import PrivateRoute from './components/PrivateRoute';
import styled from 'styled-components';

const AppContainer = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

function App() {
  return (
    <AppContainer>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
                  <ProfilePage /> {/* Add the ProfilePage route */}
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;