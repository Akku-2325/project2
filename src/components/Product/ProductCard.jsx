// src/components/Product/ProductCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductCardContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
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
      <h3>{product.name}</h3>
      <p>{truncateText(product.description, 100)}</p>
      <p>Price: ${product.price}</p>
      <Link to={`/product/${product._id}`}>View Details</Link>
      {user && user.role === 'admin' && (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
    </ProductCardContainer>
  );
}

export default ProductCard;