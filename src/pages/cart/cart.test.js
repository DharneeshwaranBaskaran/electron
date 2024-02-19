import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './cart';
import Cookies from 'js-cookie';
test('renders table element', () => {
    if(Cookies.get('type') === 'buyer' ){
    const { getByRole } = render(<MemoryRouter>
        <Cart />
    </MemoryRouter>);
    expect(getByRole('table')).toBeInTheDocument();
}
});

test('renders the title ', () => {  
    if(Cookies.get('type') === 'buyer' ){
    const { getByTestId } = render( 
      <MemoryRouter>
        <Cart />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS'); 
    expect(titleElement).toBeInTheDocument(); 
  }
});

test('renders the search container and checks search functionality', () => { 
    if(Cookies.get('type') === 'buyer' ){
    const { getByTestId, getByPlaceholderText } = render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    const searchContainerElement = getByTestId('search-container');
    expect(searchContainerElement).toBeInTheDocument();
  
    const searchInput = getByPlaceholderText('Search Items');
    userEvent.type(searchInput, 'tib'); 
    }
  });