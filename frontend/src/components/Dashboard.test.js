import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock the child components with proper implementation
jest.mock('./TaskForm', () => {
  return function MockTaskForm() {
    return <div data-testid="task-form">Task Form</div>;
  };
});

jest.mock('./TaskList', () => {
  return function MockTaskList() {
    return <div data-testid="task-list">Task List</div>;
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

describe('Dashboard Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'username') return 'testuser';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message and logout button', () => {
    render(<Dashboard onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, testuser!')).toBeTruthy();
    expect(screen.getByText('Logout')).toBeTruthy();
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<Dashboard onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  test('renders TaskForm and TaskList components', () => {
    render(<Dashboard onLogout={mockOnLogout} />);
    
    expect(screen.getByTestId('task-form')).toBeTruthy();
    expect(screen.getByTestId('task-list')).toBeTruthy();
  });
});