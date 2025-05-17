import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiweMessage } from 'siwe';
import { BrowserProvider, ethers } from 'ethers';
import type { BrowserProvider as BrowserProviderType } from 'ethers';
import { validateSiweMessageFormat, parseSiweMessage, getMessageHash, connectWallet, signMessage, isWalletAvailable, isValidEthereumAddress, isValidChainId, isValidURI, isValidISODate, verifyMessage } from './wallet';

// Mock ethers module
vi.mock('ethers', () => {
  const mockProvider = {
    send: vi.fn(),
    getSigner: vi.fn().mockResolvedValue({
      getAddress: vi.fn().mockResolvedValue('0x0000000000000000000000000000000000000000'),
      signMessage: vi.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
    })
  };

  return {
    BrowserProvider: vi.fn().mockImplementation(() => mockProvider as unknown as BrowserProviderType),
    isAddress: vi.fn().mockReturnValue(true),
    hashMessage: vi.fn().mockReturnValue('0x' + '1'.repeat(64)),
    ethers: {
      BrowserProvider: vi.fn().mockImplementation(() => mockProvider as unknown as BrowserProviderType),
      isAddress: vi.fn().mockReturnValue(true),
      hashMessage: vi.fn().mockReturnValue('0x' + '1'.repeat(64))
    }
  };
});

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

describe('Wallet Interaction', () => {
  const mockAddress = '0x0000000000000000000000000000000000000000';
  const mockSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const validSiweMessage = `example.com wants you to sign in with your Ethereum account:
${mockAddress}

Sign in to Example App

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: 12345abcde
Issued At: 2023-01-01T00:00:00.000Z`;
  
  beforeEach(() => {
    // Mock window.ethereum
    global.window.ethereum = {
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn()
    };
  });

  it('should connect wallet and return address', async () => {
    const address = await connectWallet();
    expect(address).toBe(mockAddress);
  });

  it('should sign message and return signature', async () => {
    // First connect wallet to set up signer
    await connectWallet();
    
    const result = await signMessage(validSiweMessage);
    expect(result.signature).toBe(mockSignature);
    expect(result.address).toBe(mockAddress);
  });

  // it('should handle wallet connection error', async () => {
  //   // Mock window.ethereum to reject the request
  //   global.window.ethereum = {
  //     request: vi.fn().mockRejectedValueOnce({ code: 4001, message: 'Connection rejected' }),
  //     on: vi.fn(),
  //     removeListener: vi.fn()
  //   };

  //   // Mock BrowserProvider to throw error
  //   const mockProvider = {
  //     send: vi.fn().mockRejectedValueOnce({ code: 4001, message: 'Connection rejected' }),
  //     getSigner: vi.fn().mockRejectedValueOnce({ code: 4001, message: 'Connection rejected' })
  //   };
  //   
  //   // Override the mock for this test
  //   vi.mocked(BrowserProvider).mockImplementationOnce(() => mockProvider as unknown as BrowserProviderType);
  //   
  //   // Reset the mock for the next test
  //   vi.mocked(BrowserProvider).mockReset();
  //   
  //   await expect(connectWallet()).rejects.toThrow('Connection rejected');
  // });

  // it('should handle message signing error', async () => {
  //   // First connect wallet to set up signer
  //   await connectWallet();
  //   
  //   // Mock signMessage to throw error
  //   const mockProvider = {
  //     send: vi.fn(),
  //     getSigner: vi.fn().mockResolvedValue({
  //       getAddress: vi.fn().mockResolvedValue(mockAddress),
  //       signMessage: vi.fn().mockRejectedValue({ code: 4001, message: 'Signature request rejected' })
  //     })
  //   };
  //   
  //   // Override the mock for this test
  //   vi.mocked(BrowserProvider).mockImplementationOnce(() => mockProvider as unknown as BrowserProviderType);
  //   
  //   // Reset the mock for the next test
  //   vi.mocked(BrowserProvider).mockReset();
  //   
  //   // Mock SiweMessage to pass validation
  //   vi.spyOn(SiweMessage.prototype, 'verify').mockResolvedValueOnce({ success: true, data: {} });
  //   
  //   // Mock ethers.isAddress to return true to pass validation
  //   vi.mocked(ethers.isAddress).mockReturnValueOnce(true);
  //   
  //   await expect(signMessage(validSiweMessage)).rejects.toThrow('Signature request rejected');
  // });
});

describe('Utility Functions', () => {
  describe('isWalletAvailable', () => {
    it('should return true when ethereum provider exists', () => {
      global.window.ethereum = {};
      expect(isWalletAvailable()).toBe(true);
    });

    it('should return false when ethereum provider does not exist', () => {
      global.window.ethereum = undefined;
      expect(isWalletAvailable()).toBe(false);
    });
  });

  describe('isValidEthereumAddress', () => {
    it('should validate correct Ethereum address', () => {
      // Override the mock for this test
      vi.mocked(ethers.isAddress).mockReturnValueOnce(true);
      expect(isValidEthereumAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid Ethereum address', () => {
      // Override the mock for this test
      vi.mocked(ethers.isAddress).mockReturnValueOnce(false);
      expect(isValidEthereumAddress('0x123')).toBe(false);
      
      vi.mocked(ethers.isAddress).mockReturnValueOnce(false);
      expect(isValidEthereumAddress('not an address')).toBe(false);
    });
  });

  describe('isValidChainId', () => {
    it('should validate correct chain ID', () => {
      expect(isValidChainId('1')).toBe(true);
      expect(isValidChainId('137')).toBe(true);
    });

    it('should reject invalid chain ID', () => {
      expect(isValidChainId('0')).toBe(false);
      expect(isValidChainId('-1')).toBe(false);
      expect(isValidChainId('not a number')).toBe(false);
    });
  });

  describe('isValidURI', () => {
    it('should validate correct URI', () => {
      expect(isValidURI('https://example.com')).toBe(true);
      expect(isValidURI('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URI', () => {
      expect(isValidURI('not a uri')).toBe(false);
      expect(isValidURI('http://')).toBe(false);
    });
  });

  describe('isValidISODate', () => {
    it('should validate correct ISO date', () => {
      expect(isValidISODate('2023-01-01T00:00:00.000Z')).toBe(true);
    });

    it('should reject invalid ISO date', () => {
      expect(isValidISODate('2023-01-01')).toBe(false);
      expect(isValidISODate('not a date')).toBe(false);
    });
  });
});

describe('Message Verification', () => {
  it('should verify valid message and signature', async () => {
    const message = `example.com wants you to sign in with your Ethereum account:
0x0000000000000000000000000000000000000000

Sign in to Example App

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: 12345abcde
Issued At: 2023-01-01T00:00:00.000Z`;
    
    const signature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    
    // Mock SiweMessage.verify to return success
    vi.spyOn(SiweMessage.prototype, 'verify').mockResolvedValueOnce({ success: true, data: {} });
    
    const result = await verifyMessage(message, signature);
    expect(result).toBe(true);
  });

  it('should reject invalid message and signature', async () => {
    const message = 'Invalid message';
    const signature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    
    // Mock SiweMessage.verify to return failure
    vi.spyOn(SiweMessage.prototype, 'verify').mockResolvedValueOnce({ success: false, data: {} });
    
    const result = await verifyMessage(message, signature);
    expect(result).toBe(false);
  });
}); 