<script lang="ts">
	// TIN-801 phase 2, updated after the 2026-05-09 engineered managed quota-handoff proof.
	// This is a compact view of the Codex Max managed-frame proof and route
	// inspection boundary, not a universal provider claim.
	//
	// Sources:
	// - oauth-mux/docs/evidence/codex-engineered-quota-handoff-20260509/
	// - oauth-mux/docs/qa-handoff-matrix.md
	// - oauth-mux/docs/spec/paid-cohort-soak-claim-policy-2026-05-03.md

	type Verdict = 'available' | 'auth' | 'quota' | 'blocked' | 'info';

	const rows: {
		account: string;
		capability: string;
		http: string;
		verdict: Verdict;
		decision: string;
		note: string;
		explain: string;
	}[] = [
		{
			account: 'max-2',
			capability: 'codex-max',
			http: '200',
			verdict: 'available',
			decision: 'selected_route_ok',
			note: 'successful traffic before the quota event',
			explain:
				'The engineered 2026-05-09 artifact includes successful max-2 responses before provider-originated quota exhaustion.',
		},
		{
			account: 'max-2',
			capability: 'codex-max',
			http: '429',
			verdict: 'quota',
			decision: 'quota_exhausted',
			note: 'usage_limit_reached stayed inside the proxy',
			explain:
				'oauth-mux recorded durable quota evidence, did not deliver the 429 to Codex, and selected an eligible fallback route.',
		},
		{
			account: 'max-3',
			capability: 'codex-max',
			http: '200',
			verdict: 'available',
			decision: 'fallback_200',
			note: 'same buffered request recovered on fallback',
			explain:
				'oauth-mux dropped x-codex-turn-state, retried the same responses request with max-3 credentials, and received status 200.',
		},
		{
			account: 'codex-max',
			capability: 'live route state',
			http: 'inspect',
			verdict: 'info',
			decision: 'preflight_required',
			note: 'route availability moves with auth and quota state',
			explain:
				'Current route counts are operator-local and volatile. Use oauth-mux codex preflight and route explain before making route-state claims.',
		},
	];

	function pillClass(v: Verdict): string {
		switch (v) {
			case 'available':
				return 'preset-filled-success-500';
			case 'auth':
				return 'preset-filled-warning-500';
			case 'quota':
				return 'preset-filled-warning-500';
			case 'blocked':
				return 'preset-filled-error-500';
			case 'info':
				return 'preset-tonal-surface';
		}
	}

	function decisionTone(v: Verdict): string {
		switch (v) {
			case 'available':
				return 'text-success-700-300';
			case 'auth':
				return 'text-warning-700-300';
			case 'quota':
				return 'text-warning-700-300';
			case 'blocked':
				return 'text-error-700-300';
			case 'info':
				return 'text-surface-700-300';
		}
	}

	import { Tooltip, Portal } from '@skeletonlabs/skeleton-svelte';
	import { ArrowRight } from '@lucide/svelte';

	function decisionExplain(row: (typeof rows)[number]): string {
		return row.explain;
	}
</script>

<figure class="my-2">
	<figcaption
		class="border-b border-surface-300-700 bg-surface-100-900 px-4 py-2 text-xs uppercase tracking-wide text-surface-600-400"
	>
		Codex Max managed proof · one provider, route truth moves
	</figcaption>
	<ol class="divide-y divide-surface-200-800">
		{#each rows as r, i (r.account + r.capability + i)}
			<li
				class="grid min-w-0 grid-cols-[auto_1fr] items-center gap-4 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto]"
			>
				<span class="font-mono text-xs text-surface-500">#{i + 1}</span>

				<div class="min-w-0">
					<div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
						<span class="font-mono text-sm font-medium">{r.account}</span>
						<span class="text-surface-500">·</span>
						<span class="font-mono text-sm text-surface-700-300">{r.capability}</span>
					</div>
					<p class="mt-1 text-xs text-surface-600-400">{r.note}</p>
				</div>

				<span class="chip {pillClass(r.verdict)} font-mono text-xs sm:justify-self-end">{r.http}</span>

				<Tooltip openDelay={150} positioning={{ placement: 'top' }}>
					<Tooltip.Trigger
						class="font-mono text-sm {decisionTone(r.verdict)} sm:justify-self-end cursor-help"
						aria-label={`Decision ${r.decision}`}
					>
						<ArrowRight class="inline h-3.5 w-3.5 align-[-1px]" />
						{r.decision}
					</Tooltip.Trigger>
					<Portal>
						<Tooltip.Positioner>
							<Tooltip.Content
								class="bg-surface-950 text-surface-50 max-w-xs rounded-md px-3 py-2 text-xs leading-snug shadow-lg"
							>
								{decisionExplain(r)}
							</Tooltip.Content>
						</Tooltip.Positioner>
					</Portal>
				</Tooltip>
			</li>
		{/each}
	</ol>
	<div class="border-t border-surface-300-700 bg-surface-100-900 px-4 py-2 text-xs text-surface-600-400">
		Cohort truth: the 2026-05-09 engineered artifact proves managed quota handoff from
		<code class="font-mono">max-2</code>
		to <code class="font-mono">max-3</code>. It does not claim same-thread provider continuity or mid-turn streaming
		recovery.
	</div>
</figure>
