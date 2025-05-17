<script lang="ts">
  import { currentLang, toggleLanguage } from '../stores/language';
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'zh', label: '中文' }
  ];
</script>

<div class="language-switcher">
  {#each languages as lang}
    <button 
      class:active={$currentLang === lang.code}
      on:click={() => currentLang.set(lang.code)}
    >
      {lang.label}
    </button>
  {/each}
</div>

<style>
  .language-switcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  button {
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: inherit;
    color: inherit;
    transition: opacity 0.2s;
    opacity: 0.6;
  }
  
  button:hover {
    opacity: 0.8;
  }

  button.active {
    opacity: 1;
    font-weight: 500;
  }
</style> 