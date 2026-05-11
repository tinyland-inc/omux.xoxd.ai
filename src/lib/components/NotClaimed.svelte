<script lang="ts">
	import { CircleAlert } from '@lucide/svelte';

	const notClaimed = [
		'same-thread provider semantic continuity across account boundaries',
		'mid-turn streaming recovery',
		'unmanaged bare-Codex daemon hot-swap',
		'universal provider support',
		'non-Codex stay-afloat proof',
	];
</script>

<section id="not-claimed" class="border-surface-200-800 border-t px-6 py-16 lg:py-20">
	<div class="container mx-auto">
		<div class="mx-auto max-w-4xl">
			<div class="mb-4 flex items-center gap-3">
				<CircleAlert class="text-warning-600-400 h-6 w-6" aria-hidden="true" />
				<h2 class="h2">What is not claimed</h2>
			</div>
			<p class="mb-6 text-lg text-surface-700-300">
				The current public proof is deliberately narrower than the product ambition. These remain research, adapter, or
				evidence lanes:
			</p>
			<ul class="grid gap-3 sm:grid-cols-2">
				{#each notClaimed as item (item)}
					<li class="border-surface-200-800 bg-surface-50-950 rounded-lg border p-4 text-sm text-surface-700-300">
						{item}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
