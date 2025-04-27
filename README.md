# SIWE Message Signer

A decentralized application built with SvelteKit that allows users to paste a Sign-In with Ethereum (SIWE) message, sign it using their wallet, and get the resulting hash.

## Features

- **Wallet Connection**: Connect your Ethereum wallet (MetaMask, etc.)
- **SIWE Message Signing**: Paste and sign SIWE messages
- **Hash Generation**: Get the cryptographic hash of your signed message
- **Multilingual Support**: Available in English, Russian, and Chinese


## What is SIWE?
Sign-In with Ethereum (SIWE) is a authentication method that allows users to securely authenticate using their Ethereum wallet. Instead of traditional username/password combinations, SIWE leverages cryptographic signatures to verify identity without sharing sensitive information. This provides:

- **Self-sovereign identity** - You control your digital identity with your wallet
- **No password management** - No need to remember or store passwords
- **Phishing resistance** - Cryptographic signatures are more resistant to common attacks
- **Cross-platform identity** - Use the same wallet across multiple services

## Common Use Cases

- **Web3 Authentication** - Log into dApps and services without creating new accounts
- **Proof of Ownership** - Verify ownership of an Ethereum address 
- **Authorization** - Grant permission to applications to perform actions on your behalf
- **Message Verification** - Demonstrate a message came from a specific Ethereum address

## Technical Implementation

The application implements SIWE using the following flow:
1. Creates a standard SIWE message (following EIP-4361)
2. Passes this message to the user's wallet (MetaMask, etc.)
3. The wallet displays the message for user approval
4. When approved, the wallet generates a cryptographic signature
5. The application verifies this signature against the original message
6. If valid, the signature and message hash can be used for authentication purposes

The verification can be performed by any service that understands the SIWE protocol, making this a powerful cross-platform identity solution.


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/siwe-signer.git
   cd siwe-signer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Building for Production

```bash
npm run build
```

This will create a `build` directory with all static files needed for deployment.

### Previewing the Production Build

```bash
npm run preview
```

### Deployment Options

You can deploy this application to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Google Cloud Storage
- Any standard web hosting service

Simply upload the contents of the `build` directory to your hosting provider.

## Architecture

### Technology Stack

- **Frontend**: [Svelte](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/) - A lightweight and efficient frontend framework
- **Web3 Integration**: [ethers.js](https://docs.ethers.org/) - For Ethereum wallet connectivity and message signing
- **SIWE Protocol**: [siwe](https://github.com/spruceid/siwe) - Sign-In with Ethereum implementation

### Components

1. **WalletConnector Component**: 
   - Manages connection to Ethereum wallets
   - Displays connection status and account information

2. **MessageSigner Component**:
   - Provides textarea for entering SIWE messages
   - Handles message signing with connected wallet
   - Displays signature and message hash

3. **LanguageSwitcher Component**:
   - Allows users to switch between supported languages
   - Automatically detects browser language

### Data Flow

1. User connects their Ethereum wallet
2. User inputs or pastes a SIWE message into the textarea
3. Application processes the message and prepares it for signing
4. User signs the message using their connected wallet
5. Application displays the signature and corresponding hash

## SIWE Message Format

A standard SIWE message follows this format:

```
${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${uri}
Version: ${version}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}
```

## Security Considerations

- Always review the message content before signing
- This application does not store your private keys
- Your wallet will prompt you to confirm each signature request
- Signing messages does not require gas fees or token transfers

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- An Ethereum wallet (MetaMask, etc.)

### Building for Different Environments

To customize the build for different environments, edit the `svelte.config.js` file:

```js
// For relative paths (useful for local file hosting)
paths: {
  base: '',
}

// For SPA mode with client-side routing
adapter: adapter({
  fallback: 'index.html'
}),
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

