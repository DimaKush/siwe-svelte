<script lang="ts">
  import MessageSigner from '$lib/components/MessageSigner.svelte';
</script>

<div class="page-content">
  <p class="description">
    Connect your Ethereum wallet, paste a Sign-In with Ethereum message, sign it, and get the hash.
  </p>
  
  <MessageSigner />
</div>

<footer>
  <a href="https://github.com/DimaKush/siwe-svelte">Github</a>
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
  }
</style>
