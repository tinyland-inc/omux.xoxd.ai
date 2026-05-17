<script lang="ts">
	// Top-of-page agent-safe operations surface.
	// Sources:
	// - no-spend/runtime/account inventory: oauth-mux/docs/onboarding.md:72-109
	// - foreground stay-afloat contract: oauth-mux/docs/onboarding.md:214-270
	// - permission broker boundary: oauth-mux/docs/spec/stay-afloat-permission-broker-contract-2026-05-01.md:23-44
	// - paid proof cohort / claim policy: oauth-mux/docs/spec/paid-multi-account-proof-cohort-2026-05-01.md:186-239
	// - live quota handoff evidence: oauth-mux/docs/evidence/codex-engineered-quota-handoff-20260509/
	import { Activity, ShieldCheck, UserPlus, Video } from '@lucide/svelte';
	import CodeBlock from './CodeBlock.svelte';

	let {
		stayAfloatProofHtml,
		enrollmentHandoffHtml,
		reauthHandoffHtml,
		videoDemoHtml,
	}: {
		stayAfloatProofHtml: string;
		enrollmentHandoffHtml: string;
		reauthHandoffHtml: string;
		videoDemoHtml: string;
	} = $props();

	const truths: { label: string; text: string }[] = [
		{
			label: 'Works now',
			text: 'Installed oauth-mux codex resume has live managed-frame evidence for provider-originated quota handoff; traffic recovered onto another account without restarting the harness process.',
		},
		{
			label: 'Safe by default',
			text: 'Inspection commands return redacted JSON and do not open browser auth, copy provider stores, or spend provider calls.',
		},
		{
			label: 'Explicit handoffs',
			text: 'Login, reauth, live probes, and revalidation remain labeled user-mediated or spend-confirmed commands.',
		},
	];
</script>

<section id="stay-afloat" class="border-surface-200-800 bg-surface-100-900 border-y px-6 py-14 lg:py-20">
	<div class="container mx-auto">
		<div class="mx-auto max-w-5xl space-y-10">
			<header class="max-w-3xl">
				<p class="text-primary-600-400 mb-3 font-mono text-xs uppercase tracking-[0.18em]">agent-safe operations</p>
				<h2 class="h2 mb-4">Inspect auth and route state without touching secrets.</h2>
				<p class="text-lg text-surface-700-300">
					The control plane is built for humans and agents: inspect configured accounts, prove runtime access, explain
					route health, and receive exact next-action commands without printing token material.
				</p>
			</header>

			<div class="grid gap-4 lg:grid-cols-3">
				{#each truths as truth (truth.label)}
					<div class="border-surface-200-800 bg-surface-50-950 rounded-lg border p-5">
						<h3 class="mb-2 text-base font-semibold">{truth.label}</h3>
						<p class="text-sm leading-relaxed text-surface-700-300">{truth.text}</p>
					</div>
				{/each}
			</div>

			<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)] lg:items-start">
				<div>
					<div class="mb-4 flex items-center gap-3">
						<Activity class="text-primary-500 h-5 w-5" aria-hidden="true" />
						<h3 class="h3">No-spend inspection</h3>
					</div>
					<p class="mb-3 text-surface-700-300">
						Run these before any live probe. The outputs show route availability, local runtime readiness, repair
						actions, and latest managed Codex evidence without spending provider calls.
					</p>
					<CodeBlock html={stayAfloatProofHtml} lang="bash" caption="oauth-mux/README.md — agent-safe inspection" />
				</div>

				<aside class="border-primary-500/40 bg-primary-500/10 rounded-lg border p-5">
					<div class="mb-3 flex items-center gap-2">
						<ShieldCheck class="text-primary-600-400 h-5 w-5" aria-hidden="true" />
						<h3 class="h4">Reality check</h3>
					</div>
					<ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-surface-700-300">
						<li>The strongest preserved proof is the 2026-05-09 engineered managed quota handoff artifact.</li>
						<li>Public package lanes now resolve to 0.1.7; source dogfood remains a separate provenance lane.</li>
						<li>
							Same-thread provider continuity, mid-turn streaming recovery, and unmanaged daemon hot-swap are not
							claimed.
						</li>
					</ul>
				</aside>
			</div>

			<div class="grid gap-8 lg:grid-cols-2">
				<div>
					<div class="mb-4 flex items-center gap-3">
						<UserPlus class="text-primary-500 h-5 w-5" aria-hidden="true" />
						<h3 class="h3">Enroll the next account</h3>
					</div>
					<p class="mb-3 text-surface-700-300">
						Enrollment mutates oauth-mux-owned config and store scaffolding only. Upstream login remains a user-mediated
						handoff, then route explanation or repair planning records fresh next actions.
					</p>
					<CodeBlock html={enrollmentHandoffHtml} lang="bash" caption="oauth-mux/docs/onboarding.md" />
				</div>

				<div>
					<div class="mb-4 flex items-center gap-3">
						<ShieldCheck class="text-primary-500 h-5 w-5" aria-hidden="true" />
						<h3 class="h3">Repair without silent auth</h3>
					</div>
					<p class="mb-3 text-surface-700-300">
						Interactive reauth is a labeled command that the user runs. oauth-mux should not silently repair upstream
						OAuth state in the background.
					</p>
					<CodeBlock html={reauthHandoffHtml} lang="bash" caption="oauth-mux/docs/provider-repair-contracts.md" />
				</div>
			</div>

			<div class="border-surface-200-800 rounded-lg border p-5">
				<div class="mb-4 flex items-center gap-3">
					<Video class="text-primary-500 h-5 w-5" aria-hidden="true" />
					<h3 class="h3">Live path boundary</h3>
				</div>
				<p class="mb-3 text-surface-700-300">
					Live Codex work is explicit. Use the managed launch path, then inspect the redacted status artifact; do not
					treat raw wrapper scripts or repo-local binaries as public acceptance evidence.
				</p>
				<CodeBlock html={videoDemoHtml} lang="bash" caption="spend-confirmed/live path boundary" />
			</div>
		</div>
	</div>
</section>
