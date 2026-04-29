<script lang="ts">
	// M3.3 Security & Privacy posture.
	// Sources (verbatim where stated):
	// - four claims: oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md:127-131
	// - secret backends list: oauth-mux/docs/spec/provider-authoring-checklist-2026-04-26.md:82-90
	// - redaction posture paragraph: oauth-mux/docs/onboarding.md:139-141
	// - daemon boundary "Not Allowed Yet": oauth-mux/docs/daemon-boundary.md:1-23

	// Verbatim from oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md:128-131
	const claims: string[] = [
		'no `.env` token dumping;',
		'no committed credential stores;',
		'no raw token output in discovery/health;',
		'explicit live probes only when they may spend calls.',
	];

	// Backend list verbatim from oauth-mux/docs/spec/provider-authoring-checklist-2026-04-26.md:82-90.
	// One-line descriptions paraphrase the surrounding prose for site readers.
	const backends: { name: string; blurb: string }[] = [
		{ name: 'env', blurb: 'read raw secret material from a process environment variable.' },
		{ name: 'file', blurb: 'read raw secret material from a file path on disk.' },
		{ name: 'keychain', blurb: 'read raw secret material from the OS keychain / secret service.' },
		{ name: 'sops', blurb: 'read raw secret material decrypted through a sops-managed file.' },
		{ name: 'age', blurb: 'read raw secret material decrypted through an age-managed file.' },
		{ name: 'command', blurb: 'read raw secret material from the stdout of an explicit command.' },
		{ name: 'stdin', blurb: 'read raw secret material from stdin at the moment of use.' },
	];

	// Verbatim "Not Allowed Yet" list from oauth-mux/docs/daemon-boundary.md:17-23.
	const daemonNotAllowed: string[] = [
		'Background polling of live provider probes.',
		'Automatic subscription-spending checks.',
		'Silent token refresh for providers whose refresh semantics are owned by an upstream CLI.',
		'Any release gate that depends on a long-running daemon.',
	];
</script>

<section id="security" class="container mx-auto px-6 py-16 lg:py-20">
	<div class="max-w-4xl space-y-12">
		<header>
			<h2 class="h2 mb-4">Security &amp; Privacy</h2>
			<p class="text-lg text-surface-700-300">
				oauth-mux holds four hard guarantees around how secrets enter the harness, where they live, and what shows up in
				machine-readable output.
			</p>
		</header>

		<div>
			<h3 class="h4 mb-3">Four guarantees</h3>
			<ul class="list-disc space-y-2 pl-6">
				{#each claims as claim (claim)}
					<li>{claim}</li>
				{/each}
			</ul>
			<p class="mt-3 text-xs text-surface-600-400">
				Source:
				<code class="font-mono">oauth-mux/docs/spec/product-adoption-sprint-2026-04-28.md:127-131</code>
				(verbatim).
			</p>
		</div>

		<div>
			<h3 class="h4 mb-3">Allowed secret backends</h3>
			<p class="mb-4 text-surface-700-300">
				The backend stores or returns raw secret material. It does not define provider logic. Any of the following seven
				backends is allowed; everything else is rejected at config validation time.
			</p>
			<ul class="space-y-2">
				{#each backends as b (b.name)}
					<li class="flex flex-col gap-1 sm:flex-row sm:gap-3">
						<code class="font-mono text-sm font-semibold sm:w-24 sm:shrink-0">{b.name}</code>
						<span class="text-sm text-surface-700-300">{b.blurb}</span>
					</li>
				{/each}
			</ul>
			<p class="mt-3 text-xs text-surface-600-400">
				Source:
				<code class="font-mono">oauth-mux/docs/spec/provider-authoring-checklist-2026-04-26.md:82-90</code>
				(list verbatim).
			</p>
		</div>

		<div>
			<h3 class="h4 mb-3">Redaction posture</h3>
			<p class="text-surface-700-300">
				<code class="font-mono">discover --json</code> is intentionally redacted. It reports config path, state path, providers,
				account names, secret backend names, tags, profiles, and safe command templates. It does not include token material.
			</p>
			<p class="mt-3 text-xs text-surface-600-400">
				Source: <code class="font-mono">oauth-mux/docs/onboarding.md:139-141</code> (verbatim).
			</p>
		</div>

		<aside class="rounded-lg border border-warning-500/40 bg-warning-500/10 p-5">
			<h3 class="h4 mb-2">Daemon boundary</h3>
			<p class="text-surface-700-300">
				The daemon exists, but it is not a production dependency yet. The default production path remains explicit
				selection, explicit probe, env injection, and exec handoff. The following are explicitly <em>not allowed yet</em
				>:
			</p>
			<ul class="mt-3 list-disc space-y-1 pl-6 text-sm">
				{#each daemonNotAllowed as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
			<p class="mt-3 text-xs text-surface-600-400">
				Source: <code class="font-mono">oauth-mux/docs/daemon-boundary.md:1-23</code>
				("The daemon exists, but it is not a production dependency yet." — verbatim).
			</p>
		</aside>
	</div>
</section>
