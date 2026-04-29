<script lang="ts">
	// M3.1 + M3.2 page composition.
	// Hero + Problem + FallbackAlgebra (M3.1) + Install + FirstRun + ProviderMatrix (M3.2).
	// M3.3 will add security/contribute/contact + sitemap + SEO.
	import Hero from '$lib/components/Hero.svelte';
	import ProblemStatement from '$lib/components/ProblemStatement.svelte';
	import FallbackAlgebra from '$lib/components/FallbackAlgebra.svelte';
	import InstallSurface from '$lib/components/InstallSurface.svelte';
	import FirstRunFlows from '$lib/components/FirstRunFlows.svelte';
	import ProviderMatrix from '$lib/components/ProviderMatrix.svelte';
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
	<InstallSurface
		npmHtml={data.npmHtml}
		tarballsHtml={data.tarballsHtml}
		brewHtml={data.brewHtml}
		debRpmHtml={data.debRpmHtml}
		curlHtml={data.curlHtml}
		curlOverrideHtml={data.curlOverrideHtml}
	/>
	<FirstRunFlows
		codexHappyHtml={data.codexHappyHtml}
		genericValidateHtml={data.genericValidateHtml}
		agentDiscoveryHtml={data.agentDiscoveryHtml}
	/>
	<ProviderMatrix matrix={data.providerMatrix} />
</main>
