<script lang="ts">
	// M3.1 + TIN-801 Hero. Composition follows the launch-bar acceptance:
	// name, literal value prop, install command, ONE high-signal liveness viz
	// (LivenessLadder), and TWO clear CTAs. Raw probe JSON moves into a
	// disclosure so it stays accessible without dominating the first viewport.
	//
	// Sources retained for the disclosed JSON:
	// - live.available: oauth-mux/dist/live-qa/20260427T204722Z/codex_max-1_codex-mini.json:2
	// - live.quota_exhausted: oauth-mux/dist/live-qa/20260427T210131Z/codex_max-1_codex-max.json:2
	// - dead.auth_permanently_failed: schema-faithful illustration (no live artifact)
	import CodeBlock from './CodeBlock.svelte';
	import LivenessLadder from './LivenessLadder.svelte';

	const REPO_URL = 'https://github.com/Jesssullivan/oauth-mux';

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
	<header class="mx-auto max-w-3xl">
		<p class="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-500">typed OAuth fallback</p>
		<h1 class="h1 text-5xl font-bold tracking-tight lg:text-7xl">oauth-mux</h1>
		<p class="mt-4 text-xl text-surface-700-300 lg:text-2xl">
			Deterministic account routing for AI coding harnesses. Redacted discovery, schema-modeled providers, one
			live-proven path today.
		</p>

		<!-- Two CTAs: primary scrolls to install, secondary opens upstream repo. -->
		<div class="mt-8 flex flex-wrap gap-3">
			<a href="#install" class="btn preset-filled-primary-500 px-5 py-2.5 text-sm font-semibold tracking-tight">
				Install &nbsp;→
			</a>
			<a
				href={REPO_URL}
				rel="noreferrer noopener"
				target="_blank"
				class="btn preset-tonal-surface px-5 py-2.5 text-sm font-semibold tracking-tight"
			>
				View on GitHub
			</a>
		</div>
	</header>

	<!-- Single high-signal liveness viz replaces the previous 3-up JSON dump. -->
	<div class="mx-auto mt-12 max-w-4xl">
		<LivenessLadder />
	</div>

	<!-- Inline install snippet right under the viz so the eye lands on the
	     copyable command before scrolling. -->
	<div class="mx-auto mt-10 max-w-3xl">
		<h2 class="h3 mb-2">Install and probe</h2>
		<CodeBlock html={installHtml} lang="bash" />
	</div>

	<!-- Raw probe JSON moves into a disclosure: still inspectable, but no
	     longer dominating the first viewport. (TIN-801.) -->
	<details class="mx-auto code-frame mt-10 max-w-4xl">
		<summary class="cursor-pointer px-4 py-3 text-sm font-medium text-surface-700-300 hover:text-primary-500">
			View raw probe JSON (3 examples)
		</summary>
		<div class="grid gap-6 px-4 pb-4 lg:grid-cols-3">
			<div class="min-w-0">
				<h3 class="mb-1 font-mono text-xs uppercase tracking-wide text-success-700-300">live.available</h3>
				<CodeBlock html={liveAvailHtml} lang="json" />
			</div>
			<div class="min-w-0">
				<h3 class="mb-1 font-mono text-xs uppercase tracking-wide text-warning-700-300">live.quota_exhausted</h3>
				<CodeBlock html={liveQuotaHtml} lang="json" />
			</div>
			<div class="min-w-0">
				<h3 class="mb-1 font-mono text-xs uppercase tracking-wide text-error-700-300">dead.auth_permanently_failed</h3>
				<CodeBlock
					html={deadIllusHtml}
					lang="json"
					caption="schema-faithful illustration — no live `dead` artifact captured"
				/>
			</div>
		</div>
	</details>
</section>
