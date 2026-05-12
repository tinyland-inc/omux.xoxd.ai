import { describe, expect, it } from 'vitest';

import providers from './providers.json';
import { decodeOrThrow } from '$lib/effect/schema';
import { ProviderMatrix } from './providers.schema';

const decodeProviderMatrix = decodeOrThrow(ProviderMatrix);

describe('provider matrix schema', () => {
	it('accepts the checked-in provider matrix', () => {
		const decoded = decodeProviderMatrix(providers);

		expect(decoded.providers.length).toBeGreaterThan(0);
		expect(decoded.providers.map((provider) => provider.slug)).toContain('codex');
	});

	it('rejects provider statuses outside the admission vocabulary', () => {
		const invalid = {
			generatedAt: '2026-05-12T00:00:00.000Z',
			providers: [
				{
					slug: 'example',
					name: 'Example',
					status: 'hand-wavy',
					flow: 'oauth2',
				},
			],
		};

		expect(() => decodeProviderMatrix(invalid)).toThrow();
	});
});
