// src/components/Product/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext'; // Import useCart
import styled from 'styled-components';

const ProductDetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const ProductName = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  font-size: 1.1em;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const ProductPrice = styled.p`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProductCategory = styled.p`
  font-size: 1em;
  color: #777;
  margin-bottom: 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart(); // Get addItem from CartContext

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

  const handleAddToCart = () => {
    if (product) {
      console.log("Adding product to cart:", product); // ADDED
      addItem(product, 1); // Add the product to the cart with quantity 1
    }
  };

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
      <BackLink to="/products">Back to Products</BackLink>
      <ProductName>{product.name}</ProductName>
      {product.images && product.images.length > 0 ? (
        <ProductImage src={product.images[0]} alt={product.name} />
      ) : (
        <div>No Image</div>
      )}
      <ProductDescription>{product.description}</ProductDescription>
      <ProductPrice>Price: ${product.price}</ProductPrice>
      <ProductCategory>Category: {product.category}</ProductCategory>
      <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton> {/* Add the button */}
    </ProductDetailsContainer>
  );
}

export default ProductDetails;