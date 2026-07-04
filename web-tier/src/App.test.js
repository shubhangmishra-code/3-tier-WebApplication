import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application home heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/aws 3-tier web app demo/i);
  expect(headingElement).toBeInTheDocument();
});
