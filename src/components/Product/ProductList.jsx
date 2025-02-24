// src/components/Product/ProductList.jsx
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import styled from 'styled-components';

const ProductListContainer = styled.div`
  padding: 20px;
`;

const ProductCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getAllProducts();
        setProducts(response.products); // Access the 'products' property
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProductListContainer>
      <h2>Products</h2>
      {products.map((product) => (
        <ProductCard key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </ProductCard>
      ))}
    </ProductListContainer>
  );
}

export default ProductList;