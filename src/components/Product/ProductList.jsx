// src/components/Product/ProductList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import productService from '../../services/productService';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const ProductListContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchInput = styled.input` // Add SearchInput
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [category, setCategory] = useState('');
  const { user } = useAuth(); // Get user from AuthContext
  const [searchQuery, setSearchQuery] = useState(''); // Add searchQuery

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        sortBy,
        sortOrder,
        category,
      };
      const response = await productService.getAllProducts(params);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset page to 1 when category changes
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset page to 1 when sortBy changes
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1); // Reset page to 1 when sortOrder changes
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearchChange = (e) => { // Add handleSearchChange
    setSearchQuery(e.target.value);
    setPage(1); // Reset page to 1 when search query changes
  };

  const filteredProducts = products.filter(product => // Add filteredProducts
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProductListContainer>
      <FilterContainer>
        <Select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="rings">Rings</option>
          <option value="necklaces">Necklaces</option>
          <option value="earrings">Earrings</option>
          <option value="bracelets">Bracelets</option>
        </Select>
        <div>
          <Select value={sortBy} onChange={handleSortByChange}>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </Select>
          <Select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </div>
      </FilterContainer>
      <SearchInput // Add SearchInput
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {user && user.role === 'admin' && (
        <button>Add Product</button>
      )}
      {filteredProducts.map((product) => ( // Use filteredProducts
        <ProductCard key={product._id} product={product} />
      ))}
      <PaginationContainer>
        <PaginationButton onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </PaginationButton>
        <PaginationButton onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </PaginationButton>
      </PaginationContainer>
    </ProductListContainer>
  );
}

export default ProductList;