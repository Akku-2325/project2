// src/components/Product/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import styled from 'styled-components';

const ProductDetailsContainer = styled.div`
  padding: 20px;
`;

const ProductImage = styled.img`
  max-width: 500px;
  height: auto;
  margin-bottom: 20px;
`;

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await productService.getProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductDetailsContainer>
      <h1>{product.name}</h1>
      {product.images && product.images.length > 0 ? (
        <ProductImage src={product.images[0]} alt={product.name} />
      ) : (
        <div>No Image</div>
      )}
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      {/* Add more product details here */}
    </ProductDetailsContainer>
  );
}

export default ProductDetails;