<script lang="ts">
	import { onMount } from 'svelte';
	import type { SSE, CircuitInfo } from '$lib/types/';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import Weather from '$lib/components/Weather.svelte';
	import { drawCircuit } from '$lib/utils/drawCircuit';
	import { drawDrivers } from '$lib/utils/drawDrivers';
	import { handleResize } from '$lib/utils/resize';
	import merge from 'lodash/merge';

	let data: SSE | undefined = $state();
	const circuitKey = $derived(data?.SessionInfo.Meeting.Circuit.Key);
	let circuit: CircuitInfo | undefined = $state();
	let canvasCircuit: HTMLCanvasElement | undefined = $state();
	let canvasDrivers: HTMLCanvasElement | undefined = $state();

	let width = $state(0);
	let dpr = $state(1);
	let lineWidth = $derived(handleResize(width));

	onMount(() => {
		const source = new EventSource('http://localhost:3000/sse');

		source.addEventListener('init', (event) => {
			data = JSON.parse(event.data);
		});

		source.addEventListener('update', (event) => {
			if (!data) return;
			const update = JSON.parse(event.data);

			const [path, dataUpdate] = update;

			if (path != 'Position') {
				if (path !== 'CarData.z') {
					merge(data[path as keyof typeof data], dataUpdate);
				}
			} else {
				data[path as keyof typeof data] = dataUpdate;
			}
		});

		return () => {
			source.close();
		};
	});

	$effect(() => {
		if (!circuitKey) return;
		fetch(`http://localhost:4000/api/v1/circuit/points/${circuitKey}`)
			.then((response) => response.json())
			.then((data) => (circuit = data));
	});

	let canvasStats = $state({
		calcWidth: 150,
		calcHeight: 300,
		scale: 1,
		minX: 0,
		minY: 0
	});

	$inspect(data?.TimingData);

	$effect(() => {
		if (!circuit || !canvasCircuit) return;
		canvasStats = drawCircuit(
			canvasCircuit,
			circuit.circuitPoints,
			width,
			dpr,
			lineWidth,
			circuit.angle,
			circuit.finishAngle,
			circuit.circuitPoints[circuit.finishPoint],
			circuit.pitPoints
		);
	});

	$effect(() => {
		if (!circuit || !canvasDrivers || !data) return;
		drawDrivers(
			canvasDrivers,
			canvasStats,
			data.Position.Entries,
			data.DriverList,
			width,
			dpr,
			lineWidth,
			circuit.angle
		);
	});
</script>

<svelte:head>
	<title>F1 Dashboard | Live</title>
</svelte:head>

<svelte:window bind:innerWidth={width} bind:devicePixelRatio={dpr} />

<main class="mt-1 grid gap-2 text-xs md:grid-cols-[auto_1fr]">
	<div>
		{#if data?.SessionInfo}
			<section class="grid grid-cols-[auto_1fr_auto] gap-x-1 border-t border-neutral-700 pt-1">
				<h2>{data?.SessionInfo.Meeting.Name}</h2>
				<p class="col-start-3 text-right font-bold">
					{#if data?.LapCount}
						{data?.LapCount.CurrentLap}/{data?.LapCount.TotalLaps}
					{/if}
					{#if data?.TimingData.SessionPart}
						Q{data?.TimingData.SessionPart}
					{/if}
				</p>
				<h3 class="text-[10px]">{data?.SessionInfo.Name}</h3>

				<p class="col-start-3 text-center text-[10px]">{data?.ExtrapolatedClock.Remaining}</p>
			</section>
		{/if}
		<section class="relative rounded bg-neutral-800/60">
			<div
				class="absolute right-1 top-1 rounded border border-green-500 px-1 text-[10px] text-green-500"
			>
				{data?.TrackStatus.Message}
			</div>

			<canvas bind:this={canvasCircuit} bind:clientWidth={width} class="w-full"></canvas>
			<canvas bind:this={canvasDrivers} class="absolute top-0 w-full"></canvas>

			{#if data?.WeatherData}
				<Weather weather={data.WeatherData} />
			{/if}
		</section>
	</div>

	{#if data?.DriverList}
		<Leaderboard
			driverList={data.DriverList}
			timingData={data.TimingData}
			tyreStintSeries={data.TyreStintSeries}
		/>
	{/if}
</main>
