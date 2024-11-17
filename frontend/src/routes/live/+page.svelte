<script lang="ts">
	import { onMount } from 'svelte';
	import type { SSE } from '$lib/types';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import Weather from '$lib/components/Weather.svelte';
	import type { CircuitPoints } from '$lib/types';

	let data: SSE | undefined = $state();
	const circuitKey = $derived(data?.SessionInfo.Meeting.Circuit.Key);
	let circuitPoints: CircuitPoints | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		const source = new EventSource('http://localhost:3000/sse');

		source.onmessage = function (event) {
			data = JSON.parse(event.data);
		};

		return () => {
			source.close();
		};
	});

	$effect(() => {
		if (!circuitKey) return;
		fetch(`http://localhost:4000/api/v1/circuit/points/${circuitKey}`)
			.then((response) => response.json())
			.then((data) => (circuitPoints = data));
	});

	$effect(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;
		ctx.fillStyle = 'green';
		ctx.fillRect(10, 10, 150, 100);
	});
</script>

<svelte:head>
	<title>F1 Dashboard | Live</title>
</svelte:head>

<main class="mt-1 grid grid-rows-[auto_auto_1fr] gap-2 text-xs">
	{#if data?.SessionInfo}
		<section class="grid grid-cols-[auto_1fr_auto] gap-x-1 border-t border-neutral-700 pt-1">
			<h2>{data?.SessionInfo.Meeting.Name}</h2>
			{#if data?.LapCount}
				<p class="col-start-3 font-bold">{data?.LapCount.CurrentLap}/{data?.LapCount.TotalLaps}</p>
			{/if}
			<h3 class="text-[10px]">{data?.SessionInfo.Type}</h3>

			<p class="col-start-3 text-center text-[10px]">00:00</p>
		</section>
	{/if}
	<section class="relative h-64 rounded bg-neutral-800/60">
		<div
			class="absolute right-1 top-1 rounded border border-green-500 px-1 text-[10px] text-green-500"
		>
			track Clear
		</div>

		<canvas bind:this={canvas} class="h-full w-full border"></canvas>

		{#if data?.WeatherData}
			<Weather weather={data.WeatherData} />
		{/if}

		<div></div>
	</section>

	{#if data?.DriverList}
		<Leaderboard driverList={data.DriverList} />
	{/if}
</main>
