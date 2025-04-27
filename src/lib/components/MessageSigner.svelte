<script lang="ts">
  import { signMessage, getMessageHash, validateSiweMessageFormat, parseSiweMessage, 
    isValidEthereumAddress, isValidChainId, isValidURI, isValidISODate, isWalletConnected, connectWallet } from '../wallet';
  import { t } from '../i18n';
  import { onMount } from 'svelte';
  import type { SiweMessage } from 'siwe';
  import { currentLang } from '../stores/language';
  
  // Sample SIWE message to use as placeholder
  const sampleMessage = `localhost wants you to sign in with your Ethereum account:
0x0000000000000000000000000000000000000000

This is a test statement.

URI: https://localhost/login
Version: 1
Chain ID: 1
Nonce: oNCEHm5jzQU2WvuBB
Issued At: 2022-01-28T23:28:16.013Z`;
  
  let message: string = '';
  let signature: string = '';
  let messageHash: string = '';
  let isSigningMessage: boolean = false;
  let error: string = '';
  let isValidFormat: boolean = true;
  let diagnosticMessage = '';
  let parsedMessage: SiweMessage | null = null;
  
  // Проверяем формат сообщения при изменении
  $: {
    if (message.trim()) {
      isValidFormat = validateSiweMessageFormat(message);
      parsedMessage = isValidFormat ? parseSiweMessage(message) : null;
      
      if (!isValidFormat) {
        // Анализируем возможные ошибки в формате сообщения
        diagnosticMessage = diagnoseMessageFormat(message);
      } else {
        diagnosticMessage = '';
      }
    } else {
      isValidFormat = true;
      diagnosticMessage = '';
      parsedMessage = null;
    }
  }
  
  async function handleSignMessage() {
    if (!message.trim()) {
      error = t('errors.enterMessage', $currentLang);
      return;
    }
    
    if (!isValidFormat) {
      error = t('errors.invalidMessage', $currentLang);
      return;
    }
    
    error = '';
    isSigningMessage = true;
    
    try {
      // Импортируем и проверяем, подключен ли уже кошелек
      if (!isWalletConnected()) {
        // Если кошелек не подключен, сначала подключаем
        await connectWallet();
      }
      
      const result = await signMessage(message);
      signature = result.signature;
      messageHash = getMessageHash(message);
    } catch (err) {
      error = err instanceof Error ? err.message : t('errors.failedToSign', $currentLang);
    } finally {
      isSigningMessage = false;
    }
  }
  
  // Используем более интеллектуальную диагностику
  function diagnoseMessageFormat(message: string): string {
    if (!message.trim()) return '';
    
    try {
      // Используем функцию parseSiweMessage вместо прямого вызова конструктора
      const siweMessage = parseSiweMessage(message);
      if (siweMessage) return ''; // Если успешно разобрали, нет ошибок
      
      // Если парсинг вернул null, но ошибки не было выброшено
      return analyzeMessageStructure(message);
    } catch (error: any) {
      // Возвращаем сообщение об ошибке
      if (error && error.message) {
        return `Ошибка в формате SIWE: ${error.message}`;
      }
      
      return analyzeMessageStructure(message);
    }
  }
  
  // Анализатор структуры сообщения для определения проблем
  function analyzeMessageStructure(message: string): string {
    const lines = message.trim().split('\n');
    const diagnostics = [];
    
    // Проверяем базовую структуру SIWE сообщения
    if (!lines[0] || !lines[0].includes(' wants you to sign in with your Ethereum account:')) {
      diagnostics.push('• Первая строка должна содержать "wants you to sign in with your Ethereum account:"');
    }
    
    // Используем isValidEthereumAddress вместо регулярного выражения
    if (!lines[1] || !isValidEthereumAddress(lines[1].trim())) {
      diagnostics.push('• Вторая строка должна содержать валидный Ethereum адрес');
    }
    
    // Проверяем обязательные поля в SIWE сообщении
    const requiredFields = [
      { name: 'URI:', present: false, value: '', validator: isValidURI },
      { name: 'Version:', present: false, value: '' },
      { name: 'Chain ID:', present: false, value: '', validator: isValidChainId },
      { name: 'Nonce:', present: false, value: '' },
      { name: 'Issued At:', present: false, value: '', validator: isValidISODate }
    ];
    
    lines.forEach(line => {
      requiredFields.forEach(field => {
        if (line.startsWith(field.name)) {
          field.present = true;
          field.value = line.substring(field.name.length).trim();
        }
      });
    });
    
    requiredFields.forEach(field => {
      if (!field.present) {
        diagnostics.push(`• Отсутствует обязательное поле "${field.name}"`);
      } else if (field.validator && field.value && !field.validator(field.value)) {
        diagnostics.push(`• Некорректное значение в поле "${field.name}": ${field.value}`);
      }
    });
    
    return diagnostics.length > 0 ? diagnostics.join('\n') : 'Неизвестная ошибка в формате SIWE сообщения';
  }
</script>

<div class="message-signer">
  <div class="input-group">
    <label for="message">{t('ui.messageLabel', $currentLang)}</label>
    <textarea 
      id="message" 
      bind:value={message} 
      placeholder={sampleMessage}
      rows="10"
    ></textarea>
    
    {#if !isValidFormat && message.trim()}
      <div class="format-warning">
        <p>{t('ui.invalidFormat', $currentLang)}</p>
        {#if diagnosticMessage}
          <details open>
            <summary>{t('ui.details', $currentLang)}</summary>
            <pre class="diagnostic">{diagnosticMessage}</pre>
          </details>
        {/if}
      </div>
    {:else if parsedMessage && message.trim()}
      <div class="format-success">
        <p>{t('ui.validFormat', $currentLang)}</p>
        <details>
          <summary>{t('ui.details', $currentLang)}</summary>
          <div class="message-details">
            <div><strong>{t('ui.domain', $currentLang)}:</strong> {parsedMessage.domain}</div>
            <div><strong>{t('ui.address', $currentLang)}:</strong> {parsedMessage.address}</div>
            <div><strong>{t('ui.uri', $currentLang)}:</strong> {parsedMessage.uri}</div>
            <div><strong>{t('ui.version', $currentLang)}:</strong> {parsedMessage.version}</div>
            <div><strong>{t('ui.chainId', $currentLang)}:</strong> {parsedMessage.chainId}</div>
          </div>
        </details>
      </div>
    {/if}
  </div>
  
  <div class="actions">
    <button on:click={handleSignMessage} disabled={isSigningMessage || !message.trim() || !isValidFormat}>
      {isSigningMessage ? t('ui.signing', $currentLang) : t('ui.signMessage', $currentLang)}
    </button>
  </div>
  
  {#if signature}
    <div class="result">
      <div class="result-group">
        <h3>{t('ui.messageHash', $currentLang)}</h3>
        <div class="hash">{messageHash}</div>
      </div>
      
      <div class="result-group">
        <h3>{t('ui.signature', $currentLang)}</h3>
        <div class="signature">{signature}</div>
      </div>
    </div>
  {/if}
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .message-signer {
    max-width: 800px;
    margin: 1rem auto;
  }
  
  .input-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
  }
  
  .actions {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
  }
  
  button {
    padding: 0.5rem 1.5rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .result {
    margin-top: 1.5rem;
  }
  
  .result-group {
    margin-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  .hash, .signature {
    word-break: break-all;
    background: #f0f0f0;
    padding: 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
  }
  
  .error {
    color: red;
    margin-top: 1rem;
  }
  
  .format-warning {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  
  .diagnostic {
    font-family: monospace;
    font-size: 0.8rem;
    background: #f8f8f8;
    padding: 0.5rem;
    border-left: 3px solid #e74c3c;
    margin-top: 0.5rem;
    white-space: pre-wrap;
  }
  
  details {
    margin-top: 0.5rem;
  }
  
  summary {
    cursor: pointer;
    color: #3498db;
  }
  
  .format-success {
    color: #27ae60;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  
  .message-details {
    font-family: monospace;
    font-size: 0.8rem;
    background: #f8f8f8;
    padding: 0.5rem;
    border-left: 3px solid #27ae60;
    margin-top: 0.5rem;
  }
</style> 