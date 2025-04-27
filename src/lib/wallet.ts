import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;

/**
 * Checks if a wallet is available in the browser
 */
export function isWalletAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum;
}

/**
 * Validates if a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Validates if a number is a valid Ethereum Chain ID
 */
export function isValidChainId(chainId: string): boolean {
  // Chain ID должен быть положительным числом
  const parsedChainId = parseInt(chainId, 10);
  return !isNaN(parsedChainId) && parsedChainId > 0;
}

/**
 * Validates if a string is a valid URI
 */
export function isValidURI(uri: string): boolean {
  try {
    new URL(uri);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validates if a string represents a valid ISO 8601 date
 */
export function isValidISODate(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.includes('T'); // Проверка на полный формат ISO с временем
  } catch (e) {
    return false;
  }
}

/**
 * Connects to an Ethereum wallet (MetaMask or other browser wallets)
 */
export async function connectWallet(): Promise<string> {
  if (!isWalletAvailable()) {
    throw new Error('No Ethereum provider found. Please install MetaMask or another wallet');
  }
  
  provider = new ethers.BrowserProvider(window.ethereum);
  
  try {
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error: any) {
    // Handle specific error cases
    if (error.code === 4001) {
      throw new Error('Connection rejected. Please approve the connection request in your wallet.');
    }
    console.error('Error connecting to wallet:', error);
    throw new Error('Failed to connect to wallet. Please try again.');
  }
}

/**
 * Signs a SIWE message using the connected wallet
 */
export async function signMessage(message: string): Promise<{signature: string, address: string}> {
  if (!signer) {
    throw new Error('No wallet connected. Please connect a wallet first.');
  }
  
  // Проверяем, что сообщение валидно перед подписью
  try {
    // Используем библиотечный парсер для проверки
    const siweMessage = new SiweMessage(message);
    
    // Получаем адрес подписывающего, чтобы сравнить с сообщением
    const signerAddress = await signer.getAddress();
    
    // Проверяем, совпадает ли адрес в сообщении с адресом кошелька
    if (siweMessage.address.toLowerCase() !== signerAddress.toLowerCase()) {
      throw new Error('The Ethereum address in the message does not match your connected wallet address.');
    }

    // Дополнительные проверки (можно включить при необходимости)
    if (!isValidEthereumAddress(siweMessage.address)) {
      throw new Error('Invalid Ethereum address in the message.');
    }

    if (!isValidChainId(siweMessage.chainId.toString())) {
      throw new Error('Invalid Chain ID in the message.');
    }

    if (!isValidURI(siweMessage.uri)) {
      throw new Error('Invalid URI in the message.');
    }
  } catch (error: any) {
    if (error.message && error.message.includes('does not match')) {
      throw error; // Пробрасываем ошибку о несовпадении адресов
    }
    throw new Error('Invalid SIWE message format: ' + (error.message || 'Unknown error'));
  }
  
  try {
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    return { signature, address };
  } catch (error: any) {
    // Handle user rejection
    if (error.code === 4001) {
      throw new Error('Signature request rejected. Please approve the signature request in your wallet.');
    }
    console.error('Error signing message:', error);
    throw new Error('Failed to sign message. Please try again.');
  }
}

/**
 * Verifies a signed SIWE message using the official siwe library
 */
export async function verifyMessage(message: string, signature: string): Promise<boolean> {
  try {
    const siweMessage = new SiweMessage(message);
    const { success, data } = await siweMessage.verify({ signature });
    return success;
  } catch (error) {
    console.error('Error verifying message:', error);
    return false;
  }
}

/**
 * Gets the hash of a signed message
 */
export function getMessageHash(message: string): string {
  return ethers.hashMessage(message);
}

/**
 * Parses a SIWE message string using the official siwe library
 * Returns true if it appears to be a valid SIWE message format
 */
export function validateSiweMessageFormat(message: string): boolean {
  if (!message.trim()) return false;
  
  try {
    // Используем встроенный парсер SiweMessage
    const siweMessage = new SiweMessage(message);
    
    // Если сообщение успешно спарсено, оно валидно
    return true;
  } catch (error) {
    console.warn('SIWE message validation error:', error);
    return false;
  }
}

/**
 * Gets detailed information about a SIWE message
 * Returns structured data or null if invalid
 */
export function parseSiweMessage(message: string): SiweMessage | null {
  try {
    return new SiweMessage(message);
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a wallet is already connected
 */
export function isWalletConnected(): boolean {
  return signer !== null;
} 