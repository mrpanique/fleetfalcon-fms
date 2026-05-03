import { TestBed } from '@angular/core/testing';

describe('Password Validation Utility', () => {
  let passwordPattern: RegExp;

  beforeEach(() => {
    // Password pattern: min 8 chars, 1 uppercase, 1 number
    passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  });

  it('should validate correct password', () => {
    expect(passwordPattern.test('ValidPassword123')).toBe(true);
    expect(passwordPattern.test('TestPass999')).toBe(true);
    expect(passwordPattern.test('Abcdefgh1')).toBe(true);
  });

  it('should reject password without uppercase letter', () => {
    expect(passwordPattern.test('password123')).toBe(false);
    expect(passwordPattern.test('validpassword1')).toBe(false);
  });

  it('should reject password without number', () => {
    expect(passwordPattern.test('ValidPassword')).toBe(false);
    expect(passwordPattern.test('TestPass')).toBe(false);
  });

  it('should reject password shorter than 8 characters', () => {
    expect(passwordPattern.test('Pass123')).toBe(false);
    expect(passwordPattern.test('A1b2c3')).toBe(false);
  });

  it('should handle edge cases correctly', () => {
    expect(passwordPattern.test('A1')).toBe(false); // Too short
    expect(passwordPattern.test('A12345678')).toBe(true); // Exactly 9 chars
    expect(passwordPattern.test('ABCDEFGH1')).toBe(true); // All uppercase except number
    expect(passwordPattern.test('abcdefgh1A')).toBe(true); // Number before uppercase
  });
});
