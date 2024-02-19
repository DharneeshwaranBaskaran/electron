import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './register';
import Cookies from "js-cookie";
test('renders the title', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const titleElement = getByTestId('Title');
  expect(titleElement).toBeInTheDocument();
});

test('renders the registration form', () => {
  const { getByPlaceholderText } = render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const usernameInput = getByPlaceholderText('Username');
  const passwordInput = getByPlaceholderText('Password');
  const confirmPasswordInput = getByPlaceholderText('Confirm Password');
  const emailInput = getByPlaceholderText('Email');
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});

test('renders the registration buyer', () => {
  if (Cookies.get("type") == "buyer") {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const address = getByPlaceholderText('Personal Address');
    expect(address).toBeInTheDocument();
  }
});

test('renders the registration seller', () => {
  if (Cookies.get("type") == "seller") {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const address = getByPlaceholderText('Personal Address');
    const name = getByPlaceholderText('Name');
    const Company = getByPlaceholderText('Company');
    const comadd = getByPlaceholderText('Company Address');
    const Contact = getByPlaceholderText('Contact Number');
    expect(address).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(Company).toBeInTheDocument();
    expect(comadd).toBeInTheDocument();
    expect(Contact).toBeInTheDocument();
  }
});

test('renders the registration seller', () => {
  if (Cookies.get("type") == "company") {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const website = getByPlaceholderText('Website');
    const Company = getByPlaceholderText('Company');
    const comadd = getByPlaceholderText('Company Address');
    const Contact = getByPlaceholderText('Contact Number');
    expect(website).toBeInTheDocument();
    expect(Company).toBeInTheDocument();
    expect(comadd).toBeInTheDocument();
    expect(Contact).toBeInTheDocument();
  }
});

test('registers user successfully', async () => {
  if (Cookies.get("type") == "buyer") {
    render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });

    fireEvent.click(screen.getByText('Register'));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/register/buyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword',
          conpassword: 'testpassword',
          email: 'test@example.com',
        }),
        credentials: 'include',
      });
    });
  }
});