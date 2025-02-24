// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: #f8f9fa;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  color: #007bff;
  text-decoration: none;
  padding: 5px 10px;

  &.active {
    font-weight: bold;
  }

  &:hover {
    background-color: #e9ecef;
  }
`;

const LogoutButton = styled.button`
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      {user && (
        <NavContainer>
          <StyledNavLink to="/" end>
            Home
          </StyledNavLink>
          <StyledNavLink to="/products">Products</StyledNavLink>
          <StyledNavLink to="/profile">Profile</StyledNavLink>
          <StyledNavLink to="/cart">Cart</StyledNavLink>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavContainer>
      )}
    </>
  );
}

export default Navbar;