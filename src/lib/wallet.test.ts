import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateSiweMessageFormat, parseSiweMessage, getMessageHash } from './wallet';

describe('SIWE Wallet Functions', () => {
  describe('validateSiweMessageFormat', () => {
    it('should validate correct SIWE message', () => {
      const validMessage = `example.com wants you to sign in with your Ethereum account:
0x0000000000000000000000000000000000000000

Sign in to Example App

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: 12345abcde
Issued At: 2023-01-01T00:00:00.000Z`;

      expect(validateSiweMessageFormat(validMessage)).toBe(true);
    });

    it('should reject invalid SIWE message', () => {
      const invalidMessage = `Invalid message format`;
      expect(validateSiweMessageFormat(invalidMessage)).toBe(false);
    });

    it('should handle empty message', () => {
      expect(validateSiweMessageFormat('')).toBe(false);
    });
  });

  describe('parseSiweMessage', () => {
    it('should parse valid SIWE message into object', () => {
      const validMessage = `example.com wants you to sign in with your Ethereum account:
0x0000000000000000000000000000000000000000

Sign in to Example App

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: 12345abcde
Issued At: 2023-01-01T00:00:00.000Z`;

      const parsedMessage = parseSiweMessage(validMessage);
      
      expect(parsedMessage).not.toBeNull();
      expect(parsedMessage?.domain).toBe('example.com');
      expect(parsedMessage?.address).toBe('0x0000000000000000000000000000000000000000');
      expect(parsedMessage?.uri).toBe('https://example.com/login');
    });

    it('should return null for invalid message', () => {
      const invalidMessage = `Invalid message format`;
      expect(parseSiweMessage(invalidMessage)).toBeNull();
    });
  });

  describe('getMessageHash', () => {
    it('should return a valid hash for a message', () => {
      const message = 'Test message';
      const hash = getMessageHash(message);
      
      expect(hash).toBeTypeOf('string');
      expect(hash.startsWith('0x')).toBe(true);
      expect(hash.length).toBe(66); // 0x + 64 hex chars
    });
  });
}); 