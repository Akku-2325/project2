import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext'; // Import useCart
import styled from 'styled-components';
import { theme } from '../../utils/theme';

const ProductDetailsContainer = styled.div`
  padding: ${theme.spacing.large};
  max-width: 800px;
  margin: 0 auto;
  background-color: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${theme.borderRadius};
  margin-bottom: ${theme.spacing.medium};
`;

const ProductName = styled.h1`
  font-size: 2.5em;
  font-weight: ${theme.fonts.secondaryWeight};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.small};
`;

const ProductDescription = styled.p`
  font-size: ${theme.fontSizes.medium};
  line-height: 1.6;
  color: ${theme.colors.primaryLight};
  margin-bottom: ${theme.spacing.medium};
`;

const ProductPrice = styled.p`
  font-size: 1.4em;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.medium};
`;

const ProductCategory = styled.p`
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.primaryLight};
  margin-bottom: ${theme.spacing.large};
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${theme.spacing.medium};
  color: ${theme.colors.accent};
  text-decoration: none;
  transition: ${theme.transition};

  &:hover {
    text-decoration: underline;
    color: ${theme.colors.accentDark};
  }
`;

const AddToCartButton = styled.button`
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background-color: ${theme.colors.success};
  color: ${theme.colors.secondary};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  transition: ${theme.transition};

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