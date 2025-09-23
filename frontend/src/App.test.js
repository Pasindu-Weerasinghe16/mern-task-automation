import { render, screen } from '@testing-library/react';
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

  test('renders Dashboard component when authenticated', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'userId') return '123';
      if (key === 'username') return 'testuser';
      return null;
    });
    
    render(<App />);
    const dashboardElement = screen.getByTestId('dashboard-component');
    expect(dashboardElement).toBeTruthy();
  });
});