<script lang="ts">
	// M3.2 Provider matrix.
	// Sources (verbatim where stated):
	// - tier list (live-proven=Codex; schema-modeled=Claude/GitHub/Linear/Vercel/Figma/FlakeHub/MCP HTTP):
	//   oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md:134-138
	// - per-provider admission matrix table:
	//   oauth-mux/docs/spec/provider-probe-admission-matrix-2026-04-26.md:26-39
	import type { ProviderMatrix } from '$lib/content/providers.schema';

	let { matrix }: { matrix: ProviderMatrix } = $props();

	const liveProven = $derived(matrix.providers.filter((p) => p.status === 'live-proven'));
	const schemaModeled = $derived(matrix.providers.filter((p) => p.status === 'schema-modeled'));
	const planned = $derived(matrix.providers.filter((p) => p.status === 'planned'));

	function tierChip(status: 'live-proven' | 'schema-modeled' | 'planned'): string {
		switch (status) {
			case 'live-proven':
				return 'chip preset-filled-success-500';
			case 'schema-modeled':
				return 'chip preset-filled-warning-500';
			case 'planned':
				return 'chip preset-tonal-surface';
		}
	}
</script>

<section id="providers" class="container mx-auto px-6 py-16 lg:py-20">
	<div class="max-w-5xl">
		<h2 class="h2 mb-4">Provider matrix</h2>
		<p class="mb-6 text-lg text-surface-700-300">
			Provider support is separated into three tiers. Only Codex is currently live-proven; everything else is modeled
			against the admission matrix and awaits operator-scoped live QA.
		</p>

		<dl class="mb-8 grid gap-y-6 sm:grid-cols-3 sm:gap-x-8">
			<div class="border-l-2 border-success-500/60 pl-4">
				<dt class="font-mono text-xs uppercase tracking-wide text-success-700-300">live-proven</dt>
				<dd class="mt-1 text-3xl font-bold tracking-tight">{liveProven.length}</dd>
				<dd class="mt-1 text-xs text-surface-600-400">{liveProven.map((p) => p.name).join(', ') || '—'}</dd>
			</div>
			<div class="border-l-2 border-warning-500/60 pl-4">
				<dt class="font-mono text-xs uppercase tracking-wide text-warning-700-300">schema-modeled</dt>
				<dd class="mt-1 text-3xl font-bold tracking-tight">{schemaModeled.length}</dd>
				<dd class="mt-1 text-xs text-surface-600-400">awaiting operator-scoped live QA</dd>
			</div>
			<div class="border-l-2 border-surface-400/60 pl-4">
				<dt class="font-mono text-xs uppercase tracking-wide text-surface-600-400">planned</dt>
				<dd class="mt-1 text-3xl font-bold tracking-tight">{planned.length}</dd>
				<dd class="mt-1 text-xs text-surface-600-400">declared in admission matrix only</dd>
			</div>
		</dl>

		<p class="mb-3 text-sm text-surface-600-400">
			Source: <code class="font-mono">oauth-mux/docs/spec/provider-probe-admission-matrix-2026-04-26.md:26-39</code>
			(table verbatim). Generated <code class="font-mono">{matrix.generatedAt}</code>.
		</p>

		<!-- Mobile: card list. Long docsUrl wraps with break-all so the document
		     never widens past the viewport. (TIN-802.) -->
		<ul class="space-y-3 md:hidden">
			{#each matrix.providers as p (p.slug)}
				<li class="rounded-lg border border-surface-300-700 bg-surface-100-900 p-4">
					<div class="mb-2 flex items-start justify-between gap-3">
						<div class="min-w-0 flex-1">
							<div class="font-medium">{p.name}</div>
							{#if p.docsUrl}
								<a
									class="anchor mt-0.5 block break-all text-xs"
									href={p.docsUrl}
									rel="noreferrer noopener"
									target="_blank">{p.docsUrl}</a
								>
							{/if}
						</div>
						<span class={`${tierChip(p.status)} shrink-0`}>{p.status}</span>
					</div>
					<dl class="space-y-1 text-xs">
						<div>
							<dt class="inline text-surface-600-400">Admission:</dt>
							<dd class="ml-1 inline">{p.admission ?? '—'}</dd>
						</div>
						<div>
							<dt class="inline text-surface-600-400">Probe shape:</dt>
							<dd class="ml-1 inline">{p.probeShape ?? '—'}</dd>
						</div>
					</dl>
				</li>
			{/each}
		</ul>

		<!-- Tablet/desktop: full table. min-w-0 on the wrapper's parent prevents
		     intrinsic min-content from leaking into the document layout. -->
		<div class="hidden min-w-0 md:block">
			<div class="overflow-x-auto rounded-lg border border-surface-300-700">
				<table class="table w-full text-left text-sm">
					<thead class="bg-surface-100-900">
						<tr>
							<th class="px-3 py-2">Provider</th>
							<th class="px-3 py-2">Tier</th>
							<th class="px-3 py-2">Admission</th>
							<th class="px-3 py-2">Probe shape</th>
						</tr>
					</thead>
					<tbody>
						{#each matrix.providers as p (p.slug)}
							<tr class="border-t border-surface-300-700 align-top">
								<td class="px-3 py-2">
									<div class="font-medium">{p.name}</div>
									{#if p.docsUrl}
										<a class="anchor break-all text-xs" href={p.docsUrl} rel="noreferrer noopener" target="_blank"
											>{p.docsUrl}</a
										>
									{/if}
								</td>
								<td class="px-3 py-2">
									<span class={tierChip(p.status)}>{p.status}</span>
								</td>
								<td class="px-3 py-2 text-xs">{p.admission ?? '—'}</td>
								<td class="px-3 py-2 text-xs">{p.probeShape ?? '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<p class="mt-3 text-xs text-surface-600-400">
			Citation for every row: <code class="font-mono"
				>oauth-mux/docs/spec/provider-probe-admission-matrix-2026-04-26.md:26-39</code
			>.
		</p>
	</div>
</section>
