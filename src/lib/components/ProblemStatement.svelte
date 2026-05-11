<script lang="ts">
	// M3.1 Problem statement, refreshed from oauth-mux README 2026-05-10.
</script>

<section id="problem" class="container mx-auto px-6 py-16 lg:py-20">
	<div class="mx-auto max-w-4xl">
		<p class="text-primary-600-400 mb-3 font-mono text-xs uppercase tracking-[0.18em]">what oauth-mux is</p>
		<h2 class="h2 mb-6">A broker for AI harness auth, quota, tier, and local runtime state.</h2>
		<div class="grid gap-6 lg:grid-cols-2">
			<p class="text-lg leading-relaxed text-surface-700-300">
				Developers and agents increasingly operate across personal, work, team, subscription, API-key, and service
				identities. Current CLIs often expose one active account path, so quota exhaustion or stale auth becomes a
				manual context switch.
			</p>
			<p class="text-lg leading-relaxed text-surface-700-300">
				oauth-mux wraps a harness with route-state diagnostics, managed auth/config overlays, and labeled fallback
				decisions. The goal is to keep the harness usable when account state changes without hiding the evidence from
				operators.
			</p>
		</div>
	</div>
</section>
