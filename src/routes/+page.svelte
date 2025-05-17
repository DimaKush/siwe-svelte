<script lang="ts">
  import MessageSigner from '$lib/components/MessageSigner.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import { t } from '$lib/i18n';
  import { currentLang } from '$lib/stores/language';
</script>

<div class="page-content">
  <p class="description">
    {t('description.main', $currentLang)}
  </p>
  
  <MessageSigner />
</div>

<footer>
  <a href="https://github.com/DimaKush/siwe-svelte">Github</a>
  <span class="separator">|</span>
  <LanguageSwitcher />
</footer>

<style>
  .description {
    text-align: center;
    margin-bottom: 2rem;
    color: #666;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .page-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem 0;
  }
  
  footer {
    text-align: center;
    padding: 1rem;
    color: #888;
    font-size: 0.618rem;
    margin-top: 2rem;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .separator {
    color: #888;
  }
</style>
