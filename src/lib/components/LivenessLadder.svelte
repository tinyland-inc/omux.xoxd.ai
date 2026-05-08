<script lang="ts">
	// TIN-801 phase 2, updated after the 2026-05-07 managed dogfood-9 truth pass.
	// This is a compact view of the current Codex Max managed-frame state, not
	// a universal provider claim.
	//
	// Sources:
	// - oauth-mux/dist/live-qa/managed-resume-dogfood-9/status.ndjson
	// - oauth-mux/docs/spec/paid-cohort-soak-claim-policy-2026-05-03.md

	type Verdict = 'available' | 'auth' | 'quota' | 'dead';

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
			account: 'max-1',
			capability: 'codex-max',
			http: '401',
			verdict: 'auth',
			decision: 'auth_retry',
			note: 'dogfood-9 auth_unauthorized — buffered before Codex saw it',
			explain:
				'The managed frame launched here, then oauth-mux observed an upstream auth failure and retried on another route without delivering the 401 to Codex.',
		},
		{
			account: 'max-2',
			capability: 'codex-max',
			http: '401',
			verdict: 'auth',
			decision: 'auth_retry',
			note: 'dogfood-9 auth_unauthorized — continued retry chain',
			explain:
				'The next account also returned auth_unauthorized, so oauth-mux kept the turn inside the proxy and advanced to the next route.',
		},
		{
			account: 'max-3',
			capability: 'codex-max',
			http: '401',
			verdict: 'auth',
			decision: 'auth_retry',
			note: 'dogfood-9 auth_unauthorized — terminal retry source',
			explain:
				'This was the last failing auth route in the observed chain before oauth-mux retried the same turn on max-4.',
		},
		{
			account: 'max-4',
			capability: 'codex-max',
			http: '200',
			verdict: 'available',
			decision: 'current_wire_route',
			note: 'dogfood-9 recovered — continuing responses traffic',
			explain:
				'The managed session recovered here and has continued serving successful brokered Codex traffic. This proves auth continuity, not quota handoff.',
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
			case 'dead':
				return 'preset-filled-error-500';
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
			case 'dead':
				return 'text-error-700-300';
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
		Codex Max cohort · one provider, four routes
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
		Cohort truth: dogfood-9 launched on <code class="font-mono">max-1</code>, recovered through auth fallback to
		<code class="font-mono">max-4</code>, and has not yet observed provider-originated
		<code class="font-mono">usage_limit_reached</code> quota handoff.
	</div>
</figure>
