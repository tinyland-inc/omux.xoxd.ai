<script lang="ts">
	// M3.2 First-run flows, refreshed from oauth-mux README 2026-05-10.
	// Sources (verbatim where stated):
	// - Codex paid cohort path: oauth-mux/docs/onboarding.md + docs/live-provider-qa.md
	// - Generic provider author path steps: oauth-mux/docs/adoption.md:53-66
	// - Generic provider validation commands: oauth-mux/docs/onboarding.md:155-163
	// - Agent discovery commands: oauth-mux/docs/onboarding.md:107-114
	// - Agent must-not list: oauth-mux/docs/onboarding.md:132-137
	// - Agent safe commands: oauth-mux/dist/live-qa/20260427T204722Z/discover.json:1
	import CodeBlock from './CodeBlock.svelte';
	import { AGENT_SAFE_COMMANDS, AGENT_MUST_NOT } from '$lib/content/cli-examples';

	let {
		codexHappyHtml,
		genericValidateHtml,
		agentDiscoveryHtml,
	}: {
		codexHappyHtml: string;
		genericValidateHtml: string;
		agentDiscoveryHtml: string;
	} = $props();

	// Verbatim from oauth-mux/docs/adoption.md:57-66
	const authorSteps: string[] = [
		'Write a JSON provider definition with credential parsing, injection, probes, and failure rules.',
		"Add redacted fixtures for the provider's success, rate-limit, quota, degraded, and auth-dead responses.",
		'Run `oauth-mux config validate` and the no-secret E2E harness.',
		'Run live QA only with explicit account-scoped consent.',
	];
</script>

<section id="first-run" class="container mx-auto px-6 py-16 lg:py-20">
	<div class="mx-auto max-w-4xl space-y-14">
		<header>
			<h2 class="h2 mb-4">Usage paths</h2>
			<p class="text-lg text-surface-700-300">
				Humans get a native managed Codex path. Agents get redacted JSON inspection. Provider authors get typed
				validation before any live proof lane.
			</p>
		</header>

		<div>
			<h3 class="h3 mb-2">Human Codex path</h3>
			<p class="mb-3 text-surface-700-300">
				The managed command keeps Codex inside the oauth-mux frame while preserving native chooser/session authority.
			</p>
			<CodeBlock html={codexHappyHtml} lang="bash" caption="oauth-mux/README.md — human first run" />
			<p class="mt-2 text-sm text-surface-600-400">
				If upstream auth is stale, run the labeled command from route explanation, such as
				<code class="font-mono">oauth-mux codex login-device max-3</code>.
			</p>
		</div>

		<div>
			<h3 class="h3 mb-2">Generic provider author path</h3>
			<p class="mb-3 text-surface-700-300">A new provider should usually start as data, not Zig:</p>
			<ol class="mb-4 list-decimal space-y-2 pl-6 text-surface-700-300">
				{#each authorSteps as step, i (i)}
					<li>{step}</li>
				{/each}
			</ol>
			<p class="mb-2 text-sm text-surface-600-400">
				Operator validation commands (verbatim, from <code class="font-mono">oauth-mux/docs/onboarding.md:155-163</code
				>):
			</p>
			<CodeBlock
				html={genericValidateHtml}
				lang="bash"
				caption="oauth-mux/docs/onboarding.md:460-481 — provider onboarding checklist"
			/>
		</div>

		<div>
			<h3 class="h3 mb-2">Agent-safe inspection path</h3>
			<p class="mb-3 text-surface-700-300">
				Agents start with redacted JSON discovery and never reach for credential paths. These commands expose runtime
				readiness, route state, repair actions, and status evidence without spending provider calls.
			</p>
			<CodeBlock html={agentDiscoveryHtml} lang="bash" caption="oauth-mux/README.md — agent-safe inspection" />

			<h4 class="h4 mt-6 mb-2">Agent-safe command surface</h4>
			<ul class="space-y-1 font-mono text-sm text-surface-700-300">
				{#each AGENT_SAFE_COMMANDS as cmd (cmd)}
					<li>{cmd}</li>
				{/each}
			</ul>

			<h4 class="h4 mt-6 mb-2">Agents must not</h4>
			<ul class="list-disc space-y-1 pl-6 text-surface-700-300">
				{#each AGENT_MUST_NOT as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
