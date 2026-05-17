<script lang="ts">
	// M5.1 (TIN-787) + TIN-801 phase 4 — agent-snippet page.
	// Renders the "drop this into your AI assistant" snippet as copy-friendly
	// markdown. Copy feedback now goes through Skeleton 4 Toast (Zag.js
	// underneath) instead of inline button-text mutation, so the affordance
	// is consistent with the rest of the design system.
	import { createToaster, Toast, Portal } from '@skeletonlabs/skeleton-svelte';

	const snippet = `oauth-mux is OAuth/account multiplexing for professional AI harnesses and autonomous agents.
Use it to inspect accounts, route around exhausted credentials, and keep managed harness sessions usable through explicit foreground checks.

Live-proven today: managed Codex launch/resume, native session authority bridge, root-partitioned config passthrough, and installed-runtime quota handoff from codex:max-2 to codex:max-3.
Strongest proof: oauth-mux/docs/evidence/codex-engineered-quota-handoff-20260509/.
Version truth: public GitHub Release, npm, Homebrew, curl, and deb/rpm lanes resolve to 0.1.7; source dogfood is only for unreleased checkout behavior.
Capability-modeled / in proof lanes: Claude, GitHub, Linear, Vercel, Figma, FlakeHub, MCP.
Not claimed: same-thread provider continuity, mid-turn streaming recovery, unmanaged bare-Codex daemon hot-swap, universal provider support, or non-Codex stay-afloat proof.

Install: npm install -g oauth-mux
First run:
  oauth-mux init --codex-max
  oauth-mux doctor
  oauth-mux route explain --profile codex-max --capability codex-max
  oauth-mux codex resume

Agent-safe inspection:
  oauth-mux doctor runtime --profile codex-max --capability codex-max --json
  oauth-mux accounts list --provider codex --json
  oauth-mux route explain --profile codex-max --capability codex-max --json
  oauth-mux repair-plan --profile codex-max --capability codex-max --json
  oauth-mux codex status-latest --json

Agent rules:
  Do not read secret.path files.
  Do not print token-shaped values.
  Do not copy OAuth stores between accounts.
  Do not infer codex-max availability from Spark/mini/credit dashboard text.
  Do not run live probes or revalidation unless the user explicitly authorizes spend.

Provider matrix (machine-readable): https://omux.xoxd.ai/api/providers
Source: https://github.com/Jesssullivan/oauth-mux
Site:   https://omux.xoxd.ai
`;

	const toaster = createToaster({ placement: 'bottom-end', overlap: true });

	async function copySnippet() {
		try {
			await navigator.clipboard.writeText(snippet);
			toaster.create({
				title: 'Copied to clipboard',
				description: 'Snippet ready to paste into your AI coding assistant.',
				type: 'success',
				duration: 3000,
			});
		} catch {
			toaster.create({
				title: 'Copy failed',
				description: 'Browser blocked clipboard access — select the text manually.',
				type: 'error',
				duration: 5000,
			});
		}
	}
</script>

<svelte:head>
	<title>Agent snippet — oauth-mux</title>
	<meta
		name="description"
		content="Copy-friendly snippet to paste into Claude, Cursor, Codex, or ChatGPT so it knows how to use oauth-mux."
	/>
</svelte:head>

<main>
	<section class="container mx-auto px-6 py-12 lg:py-16">
		<div class="mx-auto max-w-4xl space-y-8">
			<header>
				<h1 class="h1 mb-4">Agent snippet</h1>
				<p class="text-lg text-surface-700-300">
					Paste this into your AI coding assistant (Claude/Cursor/Codex/ChatGPT) so it knows how to use oauth-mux when
					running commands on your behalf.
				</p>
			</header>

			<div class="space-y-3">
				<button
					type="button"
					class="btn preset-filled-primary-500 px-5 py-2.5 text-sm font-semibold tracking-tight"
					onclick={copySnippet}
				>
					Copy to clipboard
				</button>
				<pre class="p-4 text-sm leading-relaxed"><code class="font-mono">{snippet}</code></pre>
			</div>

			<aside class="border-l-2 border-primary-500/40 pl-6">
				<p class="text-sm text-surface-700-300">
					The provider matrix is also available at
					<a class="anchor font-mono" href="/api/providers">https://omux.xoxd.ai/api/providers</a>
					as machine-readable JSON.
				</p>
			</aside>
		</div>
	</section>
</main>

<Portal>
	<Toast.Group {toaster} />
</Portal>
