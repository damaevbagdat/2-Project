declare module 'astro:content' {
  // Minimal ambient declarations to satisfy TypeScript in CI/local typecheck.
  // For full types rely on Astro's generated types during build.
  import type { z as ZodNamespace } from 'zod';

  export const z: typeof ZodNamespace;

  export function defineCollection<T = any>(input: any): any;
}

export {};
