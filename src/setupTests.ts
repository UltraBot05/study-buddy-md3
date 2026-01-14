// Jest setup file for testing configuration
import '@testing-library/jest-dom';

// Only run these in test environment
if (typeof jest !== 'undefined') {
  // Mock ResizeObserver if it doesn't exist
  if (!global.ResizeObserver) {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }

  // Mock window.matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock fetch for API testing if needed
  if (!global.fetch) {
    global.fetch = jest.fn();
  }

  // Property-based testing configuration
  // Set default number of iterations for fast-check property tests
  if (typeof process !== 'undefined' && process.env) {
    process.env.FC_NUM_RUNS = '100';
  }
}