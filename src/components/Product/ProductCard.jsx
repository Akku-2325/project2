// src/components/Product/ProductCard.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link

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
  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return ""; // Handle null or undefined text
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <ProductCardContainer>
      {product.images && product.images.length > 0 ? (
        <ProductImage src={product.images[0]} alt={product.name} />
      ) : (
        <div>No Image</div> // Placeholder
      )}
      <h3>{product.name}</h3>
      <p>{truncateText(product.description, 100)}</p> {/* Short description */}
      <p>Price: ${product.price}</p>
      {/* Add the Link to ProductDetails */}
      <Link to={`/product/${product._id}`}>View Details</Link>
    </ProductCardContainer>
  );
}

export default ProductCard;