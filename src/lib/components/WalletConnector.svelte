<script lang="ts">
  import { onMount } from 'svelte';
  import { connectWallet } from '../wallet';
  import { t } from '../i18n';
  import { currentLang } from '../stores/language';
  
  let address: string = '';
  let isConnecting: boolean = false;
  let error: string = '';
  
  async function handleConnect() {
    isConnecting = true;
    error = '';
    
    try {
      address = await connectWallet();
    } catch (err) {
      error = err instanceof Error ? err.message : t('errors.failedToConnect', $currentLang);
    } finally {
      isConnecting = false;
    }
  }
</script>

<div class="wallet-connector">
  {#if address}
    <div class="connected">
      <span class="status">{t('ui.connected', $currentLang)}:</span>
      <span class="address">{address.slice(0, 6)}...{address.slice(-4)}</span>
      <span class="full-address" title={address}>{address}</span>
    </div>
  {:else}
    <button on:click={handleConnect} disabled={isConnecting}>
      {isConnecting ? t('ui.connecting', $currentLang) : t('ui.connect', $currentLang)}
    </button>
    {#if error}
      <div class="error">{error}</div>
    {/if}
  {/if}
</div>

<style>
  .wallet-connector {
    white-space: nowrap;
  }
  
  .connected {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: monospace;
  }
  
  .status {
    font-weight: bold;
  }
  
  .address {
    background: #f0f0f0;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  
  .full-address {
    display: none;
  }
  
  .error {
    color: red;
    margin-top: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 