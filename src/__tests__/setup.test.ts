// Basic test to verify Jest and fast-check setup
import fc from 'fast-check';

describe('Test Setup Verification', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('fast-check property testing is working', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      })
    );
  });

  test('TypeScript types are available', () => {
    const testString: string = 'Hello, TypeScript!';
    expect(typeof testString).toBe('string');
  });
});