import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Help from './help';
test('renders the title', () => {
    const { getByTestId } = render( 
      <MemoryRouter>
        <Help />
      </MemoryRouter>);
    const titleElement = getByTestId('PRODUCTS:'); 
    expect(titleElement).toBeInTheDocument();
  });

test('renders FAQs with data', () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    );
    const faqItems = getAllByTestId('faq-item'); // Assuming you add a test id to each FAQ item
    expect(faqItems.length).toBeGreaterThan(0);
  });

  test('calls sendEmail function with correct email address', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    );
    const emailLink = getByText('support@example.com');
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    fireEvent.click(emailLink);
    expect(window.location.href).toBe('mailto:support@example.com');
    window.location = originalLocation;
  });
  