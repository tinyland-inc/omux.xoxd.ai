<script lang="ts">
	// M3.1 Fallback Algebra.
	// Sources (verbatim where stated):
	// - CredentialLiveness + Availability: oauth-mux/src/types.zig:152-215
	// - DegradedReason + DeadReason: oauth-mux/src/types.zig:224-240
	// - MuxDecision + fromHttpStatus: oauth-mux/src/types.zig:245-261
	// - Routing semantics: oauth-mux/docs/spec/provider-authoring-checklist-2026-04-26.md:223-231
	import CodeBlock from './CodeBlock.svelte';
	import { MUX_DECISION_ROWS } from '$lib/content/cli-examples';

	let { livenessHtml, deadDegradedHtml }: { livenessHtml: string; deadDegradedHtml: string } = $props();
</script>

<section id="fallback" class="container mx-auto px-6 py-16 lg:py-20">
	<div class="mx-auto max-w-4xl">
		<h2 class="h2 mb-4">Fallback algebra</h2>
		<p class="mb-6 text-lg text-surface-700-300">
			oauth-mux models credential health as a typed three-layer union — authentication, operability, and availability —
			so the pipeline can pick the right next move instead of guessing at an opaque 401 or 429.
		</p>

		<h3 class="h3 mt-8">CredentialLiveness &amp; Availability</h3>
		<CodeBlock html={livenessHtml} lang="zig" caption="oauth-mux/src/types.zig:152-215" />

		<h3 class="h3 mt-10">DegradedReason &amp; DeadReason</h3>
		<CodeBlock html={deadDegradedHtml} lang="zig" caption="oauth-mux/src/types.zig:224-240" />

		<h3 class="h3 mt-10">MuxDecision</h3>
		<p class="mb-3 text-surface-700-300">
			Source: <code class="font-mono">oauth-mux/src/types.zig:245-261</code> —
			<code class="font-mono">MuxDecision.fromHttpStatus</code> defines the canonical mapping.
		</p>
		<div class="code-frame">
			<table class="table w-full text-left">
				<thead class="bg-surface-100-900">
					<tr>
						<th class="px-4 py-2 font-mono text-sm">decision</th>
						<th class="px-4 py-2 text-sm">HTTP status</th>
						<th class="px-4 py-2 text-sm">routing semantics</th>
					</tr>
				</thead>
				<tbody>
					{#each MUX_DECISION_ROWS as row (row.decision)}
						<tr class="border-t border-surface-300-700">
							<td class="px-4 py-2 font-mono text-sm">{row.decision}</td>
							<td class="px-4 py-2 text-sm">{row.httpStatus}</td>
							<td class="px-4 py-2 text-sm">{row.semantics}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h3 class="h3 mt-10">Routing semantics</h3>
		<p class="mb-3 text-sm text-surface-600-400">
			Source: <code class="font-mono">oauth-mux/docs/spec/provider-authoring-checklist-2026-04-26.md:224-231</code> (verbatim).
		</p>
		<ul class="space-y-2 text-surface-700-300">
			<li>
				<code class="font-mono">dead</code>: user action required; do not automatically retry.
			</li>
			<li>
				<code class="font-mono">degraded</code>: try the next account for this route; retry only after a long window or
				explicit step-up.
			</li>
			<li>
				<code class="font-mono">rate_limited</code>: skip briefly or wait and retry after the short window.
			</li>
			<li>
				<code class="font-mono">quota_exhausted</code>: skip until the quota window resets.
			</li>
			<li>
				<code class="font-mono">provider_degraded</code>: try the next provider, not only the next account.
			</li>
		</ul>
	</div>
</section>
