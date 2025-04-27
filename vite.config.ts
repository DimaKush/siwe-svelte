import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			exclude: [
				'fs', 
				'path',
				'os',
			],
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
			protocolImports: true,
		}),
	],
	optimizeDeps: {
		include: ['buffer', 'ethers', 'siwe', 'helia', '@helia/json'],
	},
	build: {
		rollupOptions: {
			external: [],
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./src/test-setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
		},
	},
});
