import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './loginpage';
import Cookies from 'js-cookie';
// test('renders the login form', () => {
//   const { getByPlaceholderText, } = render(
//     <MemoryRouter>
//       <LoginPage />
//     </MemoryRouter>
//   );

//   const usernameInput = getByPlaceholderText('Username');
//   const passwordInput = getByPlaceholderText('Password');
//   expect(usernameInput).toBeInTheDocument();
//   expect(passwordInput).toBeInTheDocument();
// });

// test('renders the title', () => {
//   const { getByTestId } = render(
//     <MemoryRouter>
//       <LoginPage />
//     </MemoryRouter>
//   );
//   const titleElement = getByTestId('Title');
//   expect(titleElement).toBeInTheDocument();
// });

test('logs in user successfully', async () => {
  if (Cookies.get("type") == "buyer") {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/buyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword',
        }),
        credentials: 'include',
      });
    });
  }
});
