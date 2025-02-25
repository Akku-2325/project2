import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Greeting = styled.h2`
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <HomeContainer>
      <Greeting>Welcome, {user ? user.username : 'Guest'}!</Greeting>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </HomeContainer>
  );
}

export default HomePage;