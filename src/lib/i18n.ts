export type Messages = {
  [lang: string]: {
    [category: string]: {
      [key: string]: string;
    };
  };
};

export const messages: Messages = {
  en: {
    errors: {
      invalidMessage: 'The message does not appear to be a valid SIWE message format',
      enterMessage: 'Please enter a message to sign',
      failedToSign: 'Failed to sign message',
      failedToConnect: 'Failed to connect wallet',
      invalidAddress: 'Invalid Ethereum address',
      invalidChainId: 'Invalid Chain ID',
      invalidUri: 'Invalid URI format',
      invalidDate: 'Invalid date format'
    },
    ui: {
      signMessage: 'Sign Message',
      signing: 'Signing...',
      messageLabel: 'SIWE Message',
      messagePlaceholder: 'Paste your Sign-In with Ethereum message here',
      invalidFormat: 'The message does not conform to SIWE format',
      validFormat: 'The message conforms to SIWE format',
      details: 'Details',
      domain: 'Domain',
      address: 'Address',
      uri: 'URI',
      version: 'Version',
      chainId: 'Chain ID',
      messageHash: 'Message Hash',
      signature: 'Signature',
      connect: 'Connect Wallet',
      connecting: 'Connecting...',
      connected: 'Connected'
    },
    description: {
      main: 'Connect your Ethereum wallet, paste a Sign-In with Ethereum message, sign it, and get the hash.'
    }
  },
  ru: {
    errors: {
      invalidMessage: 'Сообщение не соответствует формату SIWE',
      enterMessage: 'Пожалуйста, введите сообщение для подписи',
      failedToSign: 'Не удалось подписать сообщение',
      failedToConnect: 'Не удалось подключить кошелек',
      invalidAddress: 'Некорректный Ethereum адрес',
      invalidChainId: 'Некорректный Chain ID',
      invalidUri: 'Некорректный формат URI',
      invalidDate: 'Некорректный формат даты'
    },
    ui: {
      signMessage: 'Подписать сообщение',
      signing: 'Подписываем...',
      messageLabel: 'SIWE Сообщение',
      messagePlaceholder: 'Вставьте ваше сообщение Sign-In with Ethereum здесь',
      invalidFormat: 'Сообщение не соответствует формату SIWE',
      validFormat: 'Сообщение соответствует формату SIWE',
      details: 'Подробности',
      domain: 'Домен',
      address: 'Адрес',
      uri: 'URI',
      version: 'Версия',
      chainId: 'Chain ID',
      messageHash: 'Хеш сообщения',
      signature: 'Подпись',
      connect: 'Подключить кошелек',
      connecting: 'Подключаем...',
      connected: 'Подключен'
    },
    description: {
      main: 'Подключите ваш Ethereum кошелек, вставьте Sign-In with Ethereum сообщение, подпишите его и получите хеш.'
    }
  },
  zh: {
    errors: {
      invalidMessage: '此消息不符合SIWE消息格式',
      enterMessage: '请输入要签名的消息',
      failedToSign: '消息签名失败',
      failedToConnect: '连接钱包失败',
      invalidAddress: '无效的以太坊地址',
      invalidChainId: '无效的Chain ID',
      invalidUri: '无效的URI格式',
      invalidDate: '无效的日期格式'
    },
    ui: {
      signMessage: '签名消息',
      signing: '签名中...',
      messageLabel: 'SIWE消息',
      messagePlaceholder: '在此粘贴您的以太坊登录消息',
      invalidFormat: '消息不符合SIWE格式',
      validFormat: '消息符合SIWE格式',
      details: '详情',
      domain: '域名',
      address: '地址',
      uri: 'URI',
      version: '版本',
      chainId: 'Chain ID',
      messageHash: '消息哈希',
      signature: '签名',
      connect: '连接钱包',
      connecting: '连接中...',
      connected: '已连接'
    },
    description: {
      main: '连接您的以太坊钱包，粘贴以太坊登录消息，签名并获取哈希值。'
    }
  }
};

export function t(key: string, lang = 'en'): string {
  // Реализация получения текста по ключу
  const keys = key.split('.');
  let result: any = messages[lang];
  for (const k of keys) {
    if (!result[k]) return key;
    result = result[k];
  }
  return result;
} 