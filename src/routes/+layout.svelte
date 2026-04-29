<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { theme } from '$lib/theme.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<div class="bg-surface-50-950 min-h-screen">
	<header class="absolute top-4 right-4 z-50">
		<ThemeSwitcher />
	</header>
	{@render children?.()}
</div>
