const { describe, it, expect } = require('@jest/globals');

// Simple unit tests that don't require database
describe('Basic Unit Tests', () => {
  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
    expect(5 * 3).toBe(15);
  });

  it('should handle string operations', () => {
    const str = 'Hello World';
    expect(str.toLowerCase()).toBe('hello world');
    expect(str.length).toBe(11);
  });

  it('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });

  it('should validate password strength', () => {
    const isStrongPassword = (password) => {
      return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    };
    
    expect(isStrongPassword('Password123')).toBe(true);
    expect(isStrongPassword('weak')).toBe(false);
  });
});