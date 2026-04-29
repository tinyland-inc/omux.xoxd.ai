<script lang="ts">
	// M3.1 Hero. Content lifted from:
	// - oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md:84-96
	//   (headline, subhead, install snippet, JSON excerpt requirement)
	// JSON excerpts:
	// - live.available: oauth-mux/dist/live-qa/20260427T204722Z/codex_max-1_codex-mini.json:2
	// - live.quota_exhausted: oauth-mux/dist/live-qa/20260427T210131Z/codex_max-1_codex-max.json:2
	// - dead.auth_permanently_failed: schema-faithful illustration (no live artifact)
	import CodeBlock from './CodeBlock.svelte';

	let {
		installHtml,
		liveAvailHtml,
		liveQuotaHtml,
		deadIllusHtml,
	}: {
		installHtml: string;
		liveAvailHtml: string;
		liveQuotaHtml: string;
		deadIllusHtml: string;
	} = $props();
</script>

<section id="hero" class="container mx-auto px-6 py-16 lg:py-24">
	<header class="mb-10 max-w-3xl">
		<h1 class="h1 text-5xl font-bold tracking-tight lg:text-7xl">oauth-mux</h1>
		<p class="mt-4 text-xl text-surface-700-300 lg:text-2xl">Typed OAuth fallback for AI harness accounts.</p>
	</header>

	<div class="max-w-3xl">
		<h2 class="h3 mb-2">Install and probe</h2>
		<CodeBlock html={installHtml} lang="bash" />
	</div>

	<!-- min-w-0 on grid children is the canonical fix for grid items inheriting
	     intrinsic min-content width and leaking past the viewport. Without it, a
	     long un-breakable Shiki JSON line forces the grid item wider than the
	     container even when the figure has overflow-x-auto. (TIN-802.) -->
	<div class="mt-10 grid gap-6 lg:grid-cols-3">
		<div class="min-w-0">
			<h3 class="h4 mb-1">live.available</h3>
			<p class="text-sm text-surface-600-400">
				Codex max account, capability codex-mini — probe returns 200, decision <code class="font-mono">use_this</code>.
			</p>
			<CodeBlock html={liveAvailHtml} lang="json" />
		</div>
		<div class="min-w-0">
			<h3 class="h4 mb-1">live.quota_exhausted</h3>
			<p class="text-sm text-surface-600-400">
				Same account at codex-max — quota exhausted with a known reset window; decision
				<code class="font-mono">try_next_account</code>.
			</p>
			<CodeBlock html={liveQuotaHtml} lang="json" />
		</div>
		<div class="min-w-0">
			<h3 class="h4 mb-1">dead.auth_permanently_failed</h3>
			<p class="text-sm text-surface-600-400">
				Schema-faithful illustration — no live <code class="font-mono">dead</code> artifact captured.
			</p>
			<CodeBlock
				html={deadIllusHtml}
				lang="json"
				caption="schema-faithful illustration — no live `dead` artifact captured"
			/>
		</div>
	</div>

	<footer class="mt-12 text-sm text-surface-600-400">
		A Jess Sullivan FOSS project built with Tinyland release infrastructure.
		<a class="anchor" href="https://github.com/Jesssullivan/oauth-mux">github.com/Jesssullivan/oauth-mux</a>
	</footer>
</section>
