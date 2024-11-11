<script lang="ts">
	import { onMount } from 'svelte';
	let messages: { type: string; date: string } | undefined = $state();

	onMount(() => {
		const evtSource = new EventSource('http://localhost:3000/');
		evtSource.onopen = function (event) {
			console.log('open');
		};

		evtSource.onmessage = function (event) {
			messages = JSON.parse(event.data);
		};

		return () => {
			evtSource.close();
		};
	});
</script>

<svelte:head>
	<title>F1 Dashboard | Live</title>
</svelte:head>
{#if messages}
	<p>{messages?.type}</p>
	<p>{messages?.date}</p>
{/if}
