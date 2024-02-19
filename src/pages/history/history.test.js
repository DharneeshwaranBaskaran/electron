import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import History from '../history';
import Cookies from 'js-cookie';
test('renders the search container and checks search functionality', () => { 
    if(Cookies.get('type') === 'buyer' ){
    const { getByTestId, getByPlaceholderText } = render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );
    const searchContainerElement = getByTestId('search-container');
    expect(searchContainerElement).toBeInTheDocument();
  
    const searchInput = getByPlaceholderText('Search Items');
    userEvent.type(searchInput, 'tib'); 
    }
  });

  test('renders table element', () => {
    if(Cookies.get('type') === 'buyer' ){
    const { getByRole } = render(<MemoryRouter>
        <History />
    </MemoryRouter>);
    expect(getByRole('table')).toBeInTheDocument();
}
});

test('renders the title ', () => {  
    if((Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') ){
    const { getByTestId } = render( 
      <MemoryRouter>
        <History />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS'); 
    expect(titleElement).toBeInTheDocument(); 
  }
});

test('renders table element seller', () => {
    if((Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') ){
    const { getByRole } = render(<MemoryRouter>
        <History />
    </MemoryRouter>);
    expect(getByRole('table')).toBeInTheDocument();
}
});