import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Payment from '../payment';
import Cookies from 'js-cookie';
test('renders the title ', () => {  
    if((Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') ){
    const { getByTestId } = render( 
      <MemoryRouter>
        <Payment />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS'); 
    expect(titleElement).toBeInTheDocument(); 
  }
});

test('renders the Balance ', () => {  
    if((Cookies.get('type') === 'buyer' )){
    const { getByTestId } = render( 
      <MemoryRouter>
        <Payment />
      </MemoryRouter>);
    const titleElement = getByTestId('Balance'); 
    expect(titleElement).toBeInTheDocument(); 
  }
});

test('renders the registration form', () => {
    if((Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') ){
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
          <Payment />
      </MemoryRouter>
    );
    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const Type = getByPlaceholderText('Type');
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(Type).toBeInTheDocument();
    }
  });