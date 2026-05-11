<script lang="ts">
	// M3.1 Proof ladder and route-state algebra.
	// Sources (verbatim where stated):
	// - Claim ladder: oauth-mux/docs/lifecycle.md
	// - CredentialLiveness + Availability: oauth-mux/src/types.zig:152-215
	// - DegradedReason + DeadReason: oauth-mux/src/types.zig:224-240
	// - MuxDecision + fromHttpStatus: oauth-mux/src/types.zig:245-261
	// - Routing semantics: oauth-mux/docs/spec/provider-authoring-checklist-2026-04-26.md:223-231
	import CodeBlock from './CodeBlock.svelte';

	let {
		livenessHtml,
		deadDegradedHtml,
		muxDecisionHtml,
	}: {
		livenessHtml: string;
		deadDegradedHtml: string;
		muxDecisionHtml: string;
	} = $props();

	const claimLevels = [
		{
			level: 'prepared_fallback',
			status: 'diagnostic',
			text: 'A candidate fallback exists. This does not prove a harness turn survived account exhaustion.',
		},
		{
			level: 'broker_owned',
			status: 'implemented',
			text: 'The harness ran through oauth-mux-owned auth/config and redacted status instrumentation.',
		},
		{
			level: 'next_turn_seamless',
			status: 'live-proven for managed Codex',
			text: 'Quota exhaustion was observed, retried on a distinct fallback account, and kept the Codex process alive.',
		},
		{
			level: 'mid_turn_streaming',
			status: 'open',
			text: 'Streaming recovery during an active provider stream remains research.',
		},
		{
			level: 'cross_session_thread_continuity',
			status: 'open',
			text: 'Same-thread provider semantics across account boundaries remain unclaimed.',
		},
		{
			level: 'unmanaged_daemon_handoff',
			status: 'open',
			text: 'Bare Codex hot-swap from a background daemon is not part of the proven managed path.',
		},
	];
</script>

<section id="fallback" class="container mx-auto px-6 py-16 lg:py-20">
	<div class="mx-auto max-w-4xl">
		<h2 class="h2 mb-4">Proof ladder</h2>
		<p class="mb-6 text-lg text-surface-700-300">
			oauth-mux separates diagnostics from product proof. The current public proof reaches
			<code class="font-mono">next_turn_seamless</code>
			for managed Codex quota handoff; higher continuity claims remain open.
		</p>

		<div class="mb-10 grid min-w-0 gap-3">
			{#each claimLevels as claim (claim.level)}
				<div class="border-surface-200-800 min-w-0 rounded-lg border p-4">
					<div class="mb-2 flex min-w-0 flex-wrap items-center gap-3">
						<h3 class="min-w-0 break-all font-mono text-sm font-semibold">{claim.level}</h3>
						<span class="chip preset-tonal-surface text-xs">{claim.status}</span>
					</div>
					<p class="min-w-0 text-sm leading-relaxed break-words text-surface-700-300">{claim.text}</p>
				</div>
			{/each}
		</div>

		<h3 class="h3 mt-8">CredentialLiveness &amp; Availability</h3>
		<CodeBlock html={livenessHtml} lang="zig" caption="oauth-mux/src/types.zig:152-215" />

		<h3 class="h3 mt-10">DegradedReason &amp; DeadReason</h3>
		<CodeBlock html={deadDegradedHtml} lang="zig" caption="oauth-mux/src/types.zig:224-240" />

		<h3 class="h3 mt-10">MuxDecision</h3>
		<p class="mb-4 text-surface-700-300">
			The <code>fromHttpStatus</code> switch is the canonical routing-semantics table — HTTP status maps to a single decision,
			no extra prose required.
		</p>
		<CodeBlock html={muxDecisionHtml} lang="zig" caption="oauth-mux/src/types.zig:245-261" />
	</div>
</section>
