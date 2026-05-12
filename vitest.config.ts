import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	oxc: {
		// Bazel and fresh worktrees may run Vitest before `.svelte-kit` exists.
		// Disable OXC tsconfig auto-discovery so tests do not depend on generated
		// SvelteKit state outside the declared Bazel inputs.
		tsconfig: false,
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, 'src/lib'),
		},
	},
	test: {
		include: ['src/**/*.test.ts', 'src/**/*.test.svelte.ts', 'scripts/**/*.test.mts'],
		environment: 'node',
		globals: true,
		// Allow vacuous green on empty test set (M0.4 → M0.6 ramp).
		// Set to false in M3 once content + smoke tests land.
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				lines: 50,
				functions: 50,
				branches: 50,
				statements: 50,
			},
			include: ['src/**/*.{ts,svelte.ts}', 'scripts/**/*.mts'],
			exclude: ['**/*.test.ts', '**/*.test.mts', '**/*.test.svelte.ts'],
		},
	},
});
