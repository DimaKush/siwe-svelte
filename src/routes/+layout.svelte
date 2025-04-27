<script lang="ts">
	import '../app.css';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import WalletConnector from '$lib/components/WalletConnector.svelte';
</script>

<div class="app">
	<header>
		<div class="header-container">
			<div class="logo">SIWE Message Signer</div>
			<div class="header-right">
				<LanguageSwitcher />
				<div class="wallet-wrapper">
					<WalletConnector />
				</div>
			</div>
		</div>
	</header>
	<main>
		<slot></slot>
	</main>
</div>

<style>
	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
			'Helvetica Neue', Arial, sans-serif;
		margin: 0;
		padding: 0;
		color: #333;
		background: #f9f9f9;
	}
	
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	
	header {
		background-color: #fff;
		border-bottom: 1px solid #eee;
		padding: 0.5rem 1rem;
		position: sticky;
		top: 0;
		z-index: 100;
	}
	
	.header-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.logo {
		font-weight: bold;
		font-size: 1.2rem;
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.wallet-wrapper :global(.wallet-connector) {
		margin: 0;
	}
	
	.wallet-wrapper :global(.wallet-connector .error) {
		position: absolute;
		margin-top: 0.25rem;
	}
	
	main {
		flex: 1;
		padding: 1rem;
	}
</style>
