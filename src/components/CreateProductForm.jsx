// src/components/CreateProductForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import productService from '../services/productService';
import validator from 'validator';


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px; /* Увеличим ширину формы */
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9; /* Добавим фон */
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: sans-serif; /* Установим шрифт */
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #28a745; /* Изменим цвет кнопки */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838; /* Изменим цвет кнопки */
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8em;
  margin-top: -5px;
  margin-bottom: 10px;
`;

function CreateProductForm({ onClose }) {
  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState(''); // Comma-separated URLs
  const [stockQuantity, setStockQuantity] = useState('');

  const [priceError, setPriceError] = useState('');
  const [imagesError, setImagesError] = useState('');
  const [stockQuantityError, setStockQuantityError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'images':
        setImages(value);
        break;
      case 'stockQuantity':
        setStockQuantity(value);
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    let isValid = true;
    setPriceError('');
    setImagesError('');
    setStockQuantityError('');

    if (!validator.isNumeric(price)) {
      setPriceError('Price must be a number');
      isValid = false;
    }

    if (images && !images.split(',').every(url => validator.isURL(url.trim()))) {
      setImagesError('Images must be comma-separated URLs');
      isValid = false;
    }

    if (!validator.isInt(stockQuantity, { min: 0 })) {
      setStockQuantityError('Stock quantity must be a non-negative integer');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const newProduct = {
          name: name,
          description: description,
          price: Number(price),
          category: category,
          images: images.split(',').map(url => url.trim()), // Convert comma-separated string to array
          stockQuantity: Number(stockQuantity),
        };
        await productService.createProduct(newProduct);
        alert('Product created successfully');
        onClose(); // Close the modal
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error("Error creating product:", error);
        // Handle error
      }
    }
  };

  return (
    <FormContainer>
      <h2>Create New Product</h2>
      <Input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={handleChange}
      />
      <TextArea
        placeholder="Description"
        name="description"
        value={description}
        onChange={handleChange}
      />
      <Input
        type="number"
        placeholder="Price"
        name="price"
        value={price}
        onChange={handleChange}
      />
      {priceError && <ErrorMessage>{priceError}</ErrorMessage>}
      <Select name="category" value={category} onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="rings">Rings</option>
        <option value="necklaces">Necklaces</option>
        <option value="earrings">Earrings</option>
        <option value="bracelets">Bracelets</option>
      </Select>
      <Input
        type="text"
        placeholder="Image URLs (comma-separated)"
        name="images"
        value={images}
        onChange={handleChange}
      />
      {imagesError && <ErrorMessage>{imagesError}</ErrorMessage>}
      <Input
        type="number"
        placeholder="Stock Quantity"
        name="stockQuantity"
        value={stockQuantity}
        onChange={handleChange}
      />
      {stockQuantityError && <ErrorMessage>{stockQuantityError}</ErrorMessage>}
      <Button onClick={handleSubmit}>Create</Button>
      <Button onClick={onClose}>Cancel</Button>
    </FormContainer>
  );
}

export default CreateProductForm;