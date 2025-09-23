import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

// Mock axios properly
jest.mock('axios', () => ({
  post: jest.fn(),
}));

// We need to import axios after mocking
const axios = require('axios');

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  test('switches to register form', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const registerLink = screen.getByText('Register');
    fireEvent.click(registerLink);
    
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: 'fake-token', userId: '123', username: 'testuser' }
    });

    render(<Login onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });
});