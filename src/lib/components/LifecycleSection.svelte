<script lang="ts">
	import { ArrowRight, FileJson, GitBranch, RotateCcw } from '@lucide/svelte';

	const lifecycle = [
		'Install',
		'init',
		'enroll accounts',
		'local diagnostics',
		'route selection',
		'managed harness launch',
		'provider signal observed',
		'broker decision',
		'fallback materialization',
		'redacted status artifact',
		'repair / revalidate loop',
	];

	const states = [
		'available',
		'quota_exhausted',
		'rate_limited',
		'tier_insufficient',
		'auth_permanently_failed',
		'credential_unavailable',
		'revalidation_needed',
		'not_afloat',
	];
</script>

<section id="lifecycle" class="border-surface-200-800 bg-surface-100-900 border-y px-6 py-16 lg:py-20">
	<div class="container mx-auto">
		<div class="mx-auto max-w-5xl space-y-10">
			<header class="max-w-3xl">
				<p class="text-primary-600-400 mb-3 font-mono text-xs uppercase tracking-[0.18em]">lifecycle</p>
				<h2 class="h2 mb-4">A brokered harness session, not a background wish.</h2>
				<p class="text-lg text-surface-700-300">
					The usable surface is a managed launch/resume path, route-state evidence, and a redacted artifact trail that a
					human or agent can inspect without touching credential material.
				</p>
			</header>

			<ol class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
				{#each lifecycle as step, i (step)}
					<li class="border-surface-200-800 bg-surface-50-950 rounded-lg border p-4">
						<div class="mb-2 flex items-center gap-2">
							<span class="chip preset-tonal-surface font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
							{#if i < lifecycle.length - 1}
								<ArrowRight class="text-primary-500 h-4 w-4" aria-hidden="true" />
							{:else}
								<RotateCcw class="text-primary-500 h-4 w-4" aria-hidden="true" />
							{/if}
						</div>
						<p class="font-mono text-sm text-surface-800-200">{step}</p>
					</li>
				{/each}
			</ol>

			<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-start">
				<div>
					<div class="mb-4 flex items-center gap-3">
						<GitBranch class="text-primary-500 h-5 w-5" aria-hidden="true" />
						<h3 class="h3">Managed Codex flow</h3>
					</div>
					<p class="text-surface-700-300">
						<code class="font-mono">oauth-mux codex resume</code> selects a route, builds a mux-owned auth/config overlay,
						bridges native session authority, spawns Codex, classifies provider responses, retries fallback when eligible,
						and writes redacted evidence.
					</p>
				</div>

				<aside class="border-primary-500/40 bg-primary-500/10 rounded-lg border p-5">
					<div class="mb-3 flex items-center gap-2">
						<FileJson class="text-primary-600-400 h-5 w-5" aria-hidden="true" />
						<h3 class="h4">Route-state vocabulary</h3>
					</div>
					<ul class="flex flex-wrap gap-2">
						{#each states as state (state)}
							<li class="chip preset-tonal-surface font-mono text-xs">{state}</li>
						{/each}
					</ul>
				</aside>
			</div>
		</div>
	</div>
</section>
