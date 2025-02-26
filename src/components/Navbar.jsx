import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { theme } from '../utils/theme';

const NavContainer = styled.nav`
  background-color: ${theme.colors.primary}; /* Use a more luxurious primary color */
  padding: ${theme.spacing.medium};
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* More subtle shadow */
  position: sticky;
  top: 0;
  z-index: 100;
`;

const StyledNavLink = styled(NavLink)`
  color: ${theme.colors.secondary}; /* Elegant secondary color for text */
  text-decoration: none;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border-radius: 25px; /* Rounded corners for a softer look */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transitions */
  font-weight: 500; /* Slightly bolder font weight */

  &.active {
    background-color: ${theme.colors.accent}; /* Use accent color for active state */
    color: ${theme.colors.primary}; /* Invert colors for active state */
    font-weight: 600; /* Even bolder for active state */
  }

  &:hover {
    background-color: ${theme.colors.accent}; /* Use accent color on hover */
    color: ${theme.colors.primary}; /* Invert colors on hover */
  }
`;

const LogoutButton = styled.button`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background-color: ${theme.colors.error}; /* Use a sophisticated error color */
  color: ${theme.colors.secondary};
  border: none;
  cursor: pointer;
  border-radius: 25px; /* Rounded corners for a softer look */
  transition: background-color 0.3s ease; /* Smooth transition */
  font-weight: 500;

  &:hover {
    background-color: ${theme.colors.errorDark}; /* Slightly darker shade on hover */
  }
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
              <StyledNavLink to="/products">Jewelry</StyledNavLink> {/* More thematic link */}
              <StyledNavLink to="/profile">Profile</StyledNavLink>
              <StyledNavLink to="/checkout">Cart</StyledNavLink>  {/* Replaced "Checkout" with "Cart" */}
            </>
          )}
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavContainer>
      )}
    </>
  );
}

export default Navbar;