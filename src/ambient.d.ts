
declare module 'siwe' {
  export class SiweMessage {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
    expirationTime?: string;
    notBefore?: string;
    requestId?: string;
    resources?: string[];
    
    constructor(message: string | MessageFields);
    
    toMessage(): string;
    
    verify(options: {
      signature: string;
      domain?: string;
      nonce?: string;
    }): Promise<{
      success: boolean;
      data: any;
    }>;
  }
  
  interface MessageFields {
    domain: string;
    address: string;
    statement?: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
    expirationTime?: string;
    notBefore?: string;
    requestId?: string;
    resources?: string[];
  }
}
