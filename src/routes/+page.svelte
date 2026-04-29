<script lang="ts">
	// M3.1 page composition. Hero + Problem + FallbackAlgebra.
	// Install/FirstRun/Provider Matrix sections land in M3.2.
	import Hero from '$lib/components/Hero.svelte';
	import ProblemStatement from '$lib/components/ProblemStatement.svelte';
	import FallbackAlgebra from '$lib/components/FallbackAlgebra.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>oauth-mux</title>
	<meta name="description" content="Typed OAuth fallback for AI harness accounts." />
</svelte:head>

<main>
	<Hero
		installHtml={data.installHtml}
		liveAvailHtml={data.liveAvailHtml}
		liveQuotaHtml={data.liveQuotaHtml}
		deadIllusHtml={data.deadIllusHtml}
	/>
	<ProblemStatement />
	<FallbackAlgebra livenessHtml={data.livenessHtml} deadDegradedHtml={data.deadDegradedHtml} />
</main>
