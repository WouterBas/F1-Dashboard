<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="m-auto max-w-[1920px]">
	<header>
		<a href="/"><h1 class="text-2xl font-bold md:text-3xl">F1 DASHBOARD</h1></a>
	</header>

	{@render children()}
</div>

<style lang="postcss">
	:global(body) {
		@apply bg-neutral-950;
	}
</style>
