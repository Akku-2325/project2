import React, { useState, useEffect, useCallback } from 'react';
import productService from '../../services/productService';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../utils/theme';

const ProductListContainer = styled.div`
    padding: ${theme.spacing.large};
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: ${theme.spacing.medium};
`;

const FilterContainer = styled.div`
    margin-bottom: ${theme.spacing.medium};
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: ${theme.spacing.small};
    padding: ${theme.spacing.medium};
    background-color: ${theme.colors.accentLight};
    border-radius: ${theme.borderRadius};
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.small};
`;

const Label = styled.label`
    font-size: ${theme.fontSizes.medium};
    color: ${theme.colors.primary};
`;

const Select = styled.select`
    padding: ${theme.spacing.small};
    border: 1px solid ${theme.colors.accentLight};
    border-radius: ${theme.borderRadius};
    font-size: ${theme.fontSizes.medium};
    color: ${theme.colors.primary};
    background-color: ${theme.colors.secondary};
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%23333'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right ${theme.spacing.small} center;
    background-size: 1em;
    padding-right: 2em;
`;

const SearchInput = styled.input`
    padding: ${theme.spacing.small};
    border: 1px solid ${theme.colors.accentLight};
    border-radius: ${theme.borderRadius};
    font-size: ${theme.fontSizes.medium};
    color: ${theme.colors.primary};
    background-color: ${theme.colors.secondary};
    width: 200px;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: ${theme.spacing.medium};
`;

const PaginationButton = styled.button`
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    margin: 0 ${theme.spacing.small};
    border: 1px solid ${theme.colors.accentLight};
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.primary};
    transition: ${theme.transition};

    &:hover {
        background-color: ${theme.colors.accentLight};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const AddProductButton = styled.button`
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    border: none;
    border-radius: ${theme.borderRadius};
    cursor: pointer;
    background-color: ${theme.colors.success};
    color: ${theme.colors.secondary};
    transition: ${theme.transition};
    font-size: ${theme.fontSizes.medium};

    &:hover {
        background-color: #218838;
    }
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
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page,
                sortBy,
                sortOrder,
                category,
                search: searchQuery, // Добавляем searchQuery
            };
            console.log("Fetching products with params:", params);
            const response = await productService.getAllProducts(params);
            console.log("Response from productService:", response);
            setProducts(response.products);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, sortOrder, category, searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const hasProducts = !loading && !error && products.length > 0;
    const noProducts = !loading && !error && products.length === 0;
    const isAdmin = user && user.role === 'admin';

    return (
        <div>
            <FilterContainer>
                <FilterGroup>
                    <Label htmlFor="category">Category:</Label>
                    <Select id="category" value={category} onChange={handleCategoryChange}>
                        <option value="">All Categories</option>
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="earrings">Earrings</option>
                        <option value="bracelets">Bracelets</option>
                    </Select>
                </FilterGroup>
                <FilterGroup>
                    <Label htmlFor="sort-by">Sort By:</Label>
                    <Select id="sort-by" value={sortBy} onChange={handleSortByChange}>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </Select>
                </FilterGroup>
                <FilterGroup>
                    <Label htmlFor="sort-order">Sort Order:</Label>
                    <Select id="sort-order" value={sortOrder} onChange={handleSortOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </Select>
                </FilterGroup>
                <SearchInput
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </FilterContainer>

            <ProductListContainer>
                {isAdmin && <AddProductButton>Add Product</AddProductButton>}
                {loading && <div>Loading products...</div>}
                {error && <div>Error: {error}</div>}
                {noProducts && <div>No products found matching your search criteria.</div>}
                {hasProducts && products.map((product) => (
                    <ProductCard key={product._id} product={product}/>
                ))}
            </ProductListContainer>

            <PaginationContainer>
                <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                    Previous
                </PaginationButton>
                <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                    Next
                </PaginationButton>
            </PaginationContainer>
        </div>
    );
}

export default ProductList;