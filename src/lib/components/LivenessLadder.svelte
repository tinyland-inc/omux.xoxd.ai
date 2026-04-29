<script lang="ts">
	// TIN-801 phase 2. Replaces the 3-column JSON dominance in the Hero with
	// a single high-signal liveness/fallback visualization. Each row is one
	// probe outcome from the canonical live-QA artifacts (or schema-faithful
	// illustration for the third case where no live `dead` artifact exists).
	//
	// Sources:
	// - row 1 live.available: oauth-mux/dist/live-qa/20260427T204722Z/codex_max-1_codex-mini.json:2
	// - row 2 live.quota_exhausted: oauth-mux/dist/live-qa/20260427T210131Z/codex_max-1_codex-max.json:2
	// - row 3 dead.auth_permanently_failed: schema-faithful illustration

	type Verdict = 'available' | 'quota' | 'dead';

	const rows: {
		account: string;
		capability: string;
		http: string;
		verdict: Verdict;
		decision: string;
		note: string;
	}[] = [
		{
			account: 'codex_max-1',
			capability: 'codex-mini',
			http: '200',
			verdict: 'available',
			decision: 'use_this',
			note: 'live.available — probe succeeded, route traffic here',
		},
		{
			account: 'codex_max-1',
			capability: 'codex-max',
			http: '429',
			verdict: 'quota',
			decision: 'try_next_account',
			note: 'live.quota_exhausted — known reset window',
		},
		{
			account: 'example-failed',
			capability: '*',
			http: '401',
			verdict: 'dead',
			decision: 'skip',
			note: 'dead.auth_permanently_failed — schema-faithful illustration',
		},
	];

	function pillClass(v: Verdict): string {
		switch (v) {
			case 'available':
				return 'preset-filled-success-500';
			case 'quota':
				return 'preset-filled-warning-500';
			case 'dead':
				return 'preset-filled-error-500';
		}
	}

	function decisionTone(v: Verdict): string {
		switch (v) {
			case 'available':
				return 'text-success-700-300';
			case 'quota':
				return 'text-warning-700-300';
			case 'dead':
				return 'text-error-700-300';
		}
	}

	import { Tooltip, Portal } from '@skeletonlabs/skeleton-svelte';

	function decisionExplain(v: Verdict): string {
		switch (v) {
			case 'available':
				return 'Probe succeeded. The mux routes traffic to this account+capability and stops walking the ladder.';
			case 'quota':
				return 'Account hit a known quota wall but is otherwise healthy. The mux walks to the next row and may retry after the reset window.';
			case 'dead':
				return 'Account is permanently unusable for this capability (auth or shape mismatch). The mux skips it for the rest of this run.';
		}
	}
</script>

<figure class="code-frame my-2 overflow-hidden">
	<figcaption
		class="border-b border-surface-300-700 bg-surface-100-900 px-4 py-2 text-xs uppercase tracking-wide text-surface-600-400"
	>
		fallback ladder · one provider, three accounts
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
						→ {r.decision}
					</Tooltip.Trigger>
					<Portal>
						<Tooltip.Positioner>
							<Tooltip.Content
								class="bg-surface-950 text-surface-50 max-w-xs rounded-md px-3 py-2 text-xs leading-snug shadow-lg"
							>
								{decisionExplain(r.verdict)}
							</Tooltip.Content>
						</Tooltip.Positioner>
					</Portal>
				</Tooltip>
			</li>
		{/each}
	</ol>
	<div class="border-t border-surface-300-700 bg-surface-100-900 px-4 py-2 text-xs text-surface-600-400">
		Decision algebra: <code class="font-mono">use_this</code> stops here;
		<code class="font-mono">try_next_account</code> walks to the next row;
		<code class="font-mono">skip</code> treats the row as permanently dead.
	</div>
</figure>
