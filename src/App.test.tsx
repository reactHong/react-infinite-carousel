import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { data } from './testData';

test('renders learn react link', () => {
  console.log(data);
  render(<App />);
  const linkElement = screen.getByText(/project restaurants/i);
  expect(linkElement).toBeInTheDocument();
  expect(1).toEqual(1);
  expect(linkElement).toHaveTextContent('Project Restaurants');
});
