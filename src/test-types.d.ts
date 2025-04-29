// Add declaration for Svelte components in tests
declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

// Add declaration for @testing-library/svelte
declare module '@testing-library/svelte' {
  import { SvelteComponent } from 'svelte';
  
  export function render(
    component: typeof SvelteComponent,
    options?: any
  ): {
    container: HTMLElement;
    component: SvelteComponent;
    debug: (element?: HTMLElement) => void;
    rerender: (props?: Record<string, any>) => void;
    unmount: () => void;
  };
  
  export const screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    findByText: (text: string | RegExp) => Promise<HTMLElement>;
    // Add more methods as needed
  };
  
  export const fireEvent: {
    click: (element: HTMLElement) => Promise<void>;
    // Add more events as needed
  };
}

// Extend Vitest's expect with jest-dom matchers
interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  // Add other jest-dom matchers if needed
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
} 