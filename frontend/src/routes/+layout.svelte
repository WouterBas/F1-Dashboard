<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<header>
	<a href="/"><h1 class="text-3xl font-bold">F1 DASHBOARD</h1></a>
</header>

{@render children()}
