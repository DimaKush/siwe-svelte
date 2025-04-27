<script lang="ts">
  import { currentLang, toggleLanguage } from '../stores/language';
  
  // Флаги для языков (можно заменить на иконки или другие символы)
  const flags: { [key: string]: string } = {
    ru: 'Русский',
    en: 'English',
    zh: '中文'
  };
  
  // Function to get next language label
  function getNextLanguage(current: string): string {
    if (current === 'en') return 'Русский';
    if (current === 'ru') return '中文';
    return 'English';
  }
</script>

<div class="language-switcher">
  <button on:click={toggleLanguage}>
    <span class="current-flag">{flags[$currentLang]}</span>
    <span class="switch-text">{getNextLanguage($currentLang)}</span>
  </button>
</div>

<style>
  .language-switcher {
    display: flex;
    justify-content: flex-end;
    margin: 1rem;
  }
  
  button {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background: #e0e0e0;
  }
  
  .current-flag {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
  
  .switch-text {
    font-weight: 500;
  }
</style> 