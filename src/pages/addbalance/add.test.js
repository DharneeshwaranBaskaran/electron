import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Add from '../add';
import Cookies from 'js-cookie';
test('renders the title Buyer', () => { 
  if(Cookies.get('type') === 'buyer'){
    const { getByTestId } = render( 
      <MemoryRouter>
        <Add />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS:'); 
    expect(titleElement).toBeInTheDocument(); 
  }
  });

  test('renders the Add form', () => {
    if(Cookies.get('type') === 'buyer'){
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
          <Add />
      </MemoryRouter>
    );
    const usernameInput = getByPlaceholderText('UPI');
    const cost = getByPlaceholderText('cost');
     expect(usernameInput).toBeInTheDocument();
     expect(cost).toBeInTheDocument();
    }
  });

  test('renders the title Seller', () => { 
    if(Cookies.get('type') === 'seller'){
      const { getByTestId } = render( 
        <MemoryRouter>
          <Add />
        </MemoryRouter>);
      const titleElement = getByTestId('PRODUCT'); 
      expect(titleElement).toBeInTheDocument(); 
    }
    });

    test('renders the Add form', () => {
      if(Cookies.get('type') === 'seller'){
      const { getByPlaceholderText, getByText } = render(
        <MemoryRouter>
            <Add />
        </MemoryRouter>
      );
      const cat = getByPlaceholderText('category');
      const cost = getByPlaceholderText('cost');
      const Description = getByPlaceholderText('Description');
      const Topic = getByPlaceholderText('Topic');

       expect(cat).toBeInTheDocument();
       expect(cost).toBeInTheDocument();
       expect(Description).toBeInTheDocument();
       expect(Topic).toBeInTheDocument();
      }
    });