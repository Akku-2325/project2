// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { theme } from '../utils/theme'; // Импортируем theme

const NavContainer = styled.nav`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.medium};
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  color: ${theme.colors.secondary};
  text-decoration: none;
  padding: ${theme.spacing.small} ${theme.spacing.medium};

  &.active {
    font-weight: bold;
  }

  &:hover {
    background-color: ${theme.colors.accent};
  }
`;

const LogoutButton = styled.button`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background-color: ${theme.colors.error};
  color: ${theme.colors.secondary};
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
          {user.role === 'admin' ? (
            <StyledNavLink to="/admin">Admin Panel</StyledNavLink>
          ) : (
            <>
              <StyledNavLink to="/" end>
                Home
              </StyledNavLink>
              <StyledNavLink to="/products">Products</StyledNavLink>
              <StyledNavLink to="/profile">Profile</StyledNavLink>
              <StyledNavLink to="/cart">Cart</StyledNavLink>
            </>
          )}
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavContainer>
      )}
    </>
  );
}

export default Navbar;