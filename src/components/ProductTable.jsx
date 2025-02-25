// src/components/ProductTable.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import productService from '../services/productService';
import EditProductForm from './EditProductForm'; // Import EditProductForm

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProductTable({ products }) {
  const [editingProductId, setEditingProductId] = useState(null);

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      alert('Product deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (productId) => {
    setEditingProductId(productId);
  };

  const handleCloseEditForm = () => {
    setEditingProductId(null);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {products.map(product => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <button onClick={() => handleEdit(product._id)}>Edit</button> {/* Update onClick */}
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {editingProductId && (
        <ModalBackdrop>
          <EditProductForm
            productId={editingProductId}
            onClose={handleCloseEditForm}
          />
        </ModalBackdrop>
      )}
    </div>
  );
}

export default ProductTable;