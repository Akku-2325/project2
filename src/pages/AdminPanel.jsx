// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import CreateProductForm from '../components/CreateProductForm';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/ProductTable'; // Import ProductTable

const AdminPanelContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
`;

const CreateProductButton = styled.button`
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

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await productService.getAllProducts();
        console.log("Products from API:", products);
        setProducts(products.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!user || user.role !== 'admin') {
    return <div>You do not have permission to access this page.</div>;
  }

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  return (
    <AdminPanelContainer>
      <Title>Admin Panel</Title>
      <CreateProductButton onClick={() => setShowCreateForm(true)}>
        Create New Product
      </CreateProductButton>
      {showCreateForm && <CreateProductForm onClose={handleCloseCreateForm} />}
      <ProductTable products={products} />
    </AdminPanelContainer>
  );
}

export default AdminPanel;