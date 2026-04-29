<script lang="ts">
	// M5.1 (TIN-787) — agent-snippet page.
	// Renders the "drop this into your AI assistant" snippet from the
	// product adoption sprint plan as copy-friendly markdown.

	const snippet = `oauth-mux is a typed OAuth multiplexer that gives multi-account AI harnesses
deterministic account fallback and redacted account discovery.

Live-proven: Codex (one provider).
Schema-modeled: GPT5, Anthropic, MCP servers, GitHub, Linear, Vercel, Figma, FlakeHub.
Planned: Bedrock, Azure.

Install: npm install -g oauth-mux
First run: oauth-mux codex onboard && oauth-mux codex probe-all
Discover redacted accounts: oauth-mux codex discover --redact
Status: oauth-mux codex status

Provider matrix (machine-readable): https://omux.xoxd.ai/api/providers
Source: https://github.com/Jesssullivan/oauth-mux
Site:   https://omux.xoxd.ai
`;

	let copied = $state(false);
	let copyError = $state(false);

	async function copySnippet() {
		copied = false;
		copyError = false;
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(snippet);
				copied = true;
			} else {
				// Fallback for older browsers / non-secure contexts.
				const textarea = document.createElement('textarea');
				textarea.value = snippet;
				textarea.style.position = 'fixed';
				textarea.style.left = '-9999px';
				document.body.appendChild(textarea);
				textarea.select();
				const ok = document.execCommand('copy');
				document.body.removeChild(textarea);
				if (ok) {
					copied = true;
				} else {
					copyError = true;
				}
			}
		} catch {
			copyError = true;
		}
		if (copied) {
			setTimeout(() => {
				copied = false;
			}, 2000);
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

<main class="bg-surface-50-950">
	<section class="container mx-auto px-6 py-12 lg:py-16">
		<div class="max-w-4xl space-y-8">
			<header>
				<h1 class="h1 mb-4">Agent snippet</h1>
				<p class="text-lg text-surface-700-300">
					Paste this into your AI coding assistant (Claude/Cursor/Codex/ChatGPT) so it knows how to use oauth-mux when
					running commands on your behalf.
				</p>
			</header>

			<div class="space-y-3">
				<div class="flex flex-wrap items-center gap-3">
					<button type="button" class="btn preset-filled-primary-500" onclick={copySnippet} aria-live="polite">
						{#if copied}
							Copied!
						{:else if copyError}
							Copy failed — select and copy manually
						{:else}
							Copy to clipboard
						{/if}
					</button>
				</div>
				<pre
					class="overflow-x-auto rounded-lg border border-surface-300-700 bg-surface-100-900 p-4 text-sm leading-relaxed"><code
						class="font-mono">{snippet}</code
					></pre>
			</div>

			<aside class="rounded-lg border border-surface-300-700 bg-surface-100-900 p-5">
				<p class="text-sm text-surface-700-300">
					This snippet is also available at
					<a class="anchor font-mono" href="/api/providers">https://omux.xoxd.ai/api/providers</a>
					as machine-readable JSON.
				</p>
			</aside>
		</div>
	</section>
</main>
