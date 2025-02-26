import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme'; // Import the theme

const ProductCardContainer = styled.div`
  border: 1px solid ${theme.colors.accentLight};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.medium};
  box-shadow: ${theme.boxShadow};
  transition: ${theme.transition};
  background-color: ${theme.colors.secondary};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%; /* Ensure image takes full width */
  max-height: 200px; /* Limit image height */
  object-fit: cover;
  border-radius: ${theme.borderRadius};
  margin-bottom: ${theme.spacing.small};
`;

const ProductTitle = styled.h3`
  font-size: ${theme.fontSizes.large};
  font-weight: ${theme.fonts.secondaryWeight};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.small};
`;

const ProductDescription = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.primaryLight};
  margin-bottom: ${theme.spacing.small};
`;

const ProductPrice = styled.p`
  font-size: ${theme.fontSizes.medium};
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.small};
`;

const ViewDetailsLink = styled(Link)`
  color: ${theme.colors.accent};
  text-decoration: none;
  transition: ${theme.transition};

  &:hover {
    text-decoration: underline;
    color: ${theme.colors.accentDark};
  }
`;

const AdminActions = styled.div`
  margin-top: ${theme.spacing.medium};
  display: flex;
  gap: ${theme.spacing.small};
`;

const AdminButton = styled.button`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: ${theme.transition};

  &:first-child {
    background-color: #007bff;
    color: white;
    &:hover {
        background-color: #0056b3;
    }
  }

  &:last-child {
    background-color: #dc3545;
    color: white;
    &:hover {
        background-color: #c82333;
    }
  }
`;


function ProductCard({ product }) {
  const { user } = useAuth();

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <ProductCardContainer>
      {product.images && product.images.length > 0 ? (
        <ProductImage src={product.images[0]} alt={product.name} />
      ) : (
        <div>No Image</div>
      )}
      <ProductTitle>{product.name}</ProductTitle>
      <ProductDescription>{truncateText(product.description, 100)}</ProductDescription>
      <ProductPrice>Price: ${product.price}</ProductPrice>
      <ViewDetailsLink to={`/product/${product._id}`}>View Details</ViewDetailsLink>
      {user && user.role === 'admin' && (
        <AdminActions>
          <AdminButton>Edit</AdminButton>
          <AdminButton>Delete</AdminButton>
        </AdminActions>
      )}
    </ProductCardContainer>
  );
}

export default ProductCard;