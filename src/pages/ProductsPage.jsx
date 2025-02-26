import React from 'react';
import ProductList from '../components/Product/ProductList';
import styled from 'styled-components';
import { theme } from '../utils/theme';

const ProductsPageContainer = styled.div`
    padding: ${theme.spacing.large};
`;

const Title = styled.h1`
    font-size: 2em;
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.medium};
`;

function ProductsPage() {
  return (
    <ProductsPageContainer>
      <Title>Products</Title>
      <ProductList />
    </ProductsPageContainer>
  );
}

export default ProductsPage;