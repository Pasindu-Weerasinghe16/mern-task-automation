import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock the components with proper implementation
jest.mock('./components/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-component">Login Component</div>;
  };
});

jest.mock('./components/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-component">Dashboard Component</div>;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  test('renders Login component when not authenticated', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    const loginElement = screen.getByTestId('login-component');
    expect(loginElement).toBeTruthy();
  });

  test('renders App component correctly', () => {
    // Test that the app renders without crashing and shows the login by default
    render(<App />);
    
    // Verify it renders the login component by default (expected behavior)
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    
    // Verify the App container exists
    expect(document.querySelector('.App')).toBeInTheDocument();
  });
});