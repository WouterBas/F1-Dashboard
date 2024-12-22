<script lang="ts">
	import { onMount } from 'svelte';
	import type { SSE } from '$lib/types/';
	import { Circuit, Leaderboard, Weather, Clock, TrackFlags } from '$lib/components';
	import merge from 'lodash/merge';
	import { Tween } from 'svelte/motion';
	import { linear } from 'svelte/easing';

	let data: SSE | undefined = $state();
	let driversPosition: Map<string, Tween<{ X: number; Y: number; Z: number }>> = $state(new Map());

	let lastUpdate = $state(performance.now());

	// SSE data
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
				const duration = performance.now() - lastUpdate;
				lastUpdate = performance.now();

				Object.keys(dataUpdate.Entries).forEach((driverId) => {
					const driverData = dataUpdate.Entries[driverId];
					if (!driversPosition.has(driverId)) {
						driversPosition.set(
							driverId,
							new Tween(
								{ X: driverData.X, Y: driverData.Y, Z: driverData.Z },
								{ duration, easing: linear }
							)
						);
					} else {
						driversPosition
							.get(driverId)
							?.set(
								{ X: driverData.X, Y: driverData.Y, Z: driverData.Z },
								{ duration, easing: linear }
							);
					}
				});
			}
		});
		return () => {
			source.close();
		};
	});
</script>

<svelte:head>
	<title>F1 Dashboard | Live</title>
</svelte:head>

<main class="mt-1 grid gap-2 text-xs sm:grid-cols-[auto_1fr]">
	<div>
		{#if data?.SessionInfo}
			<section
				class="grid grid-cols-[auto_1fr_auto] gap-x-1 border-t border-neutral-700 pt-1 md:text-sm lg:text-base"
			>
				<h2>{data?.SessionInfo.Meeting.Name}</h2>
				<p class="col-start-3 text-right font-bold">
					{#if data?.LapCount}
						{data?.LapCount.CurrentLap}/{data?.LapCount.TotalLaps}
					{/if}
					{#if data?.TimingData.SessionPart}
						Q{data?.TimingData.SessionPart}
					{/if}
				</p>
				<h3 class="text-[10px] md:text-xs lg:text-sm">{data?.SessionInfo.Name}</h3>

				<Clock extrapolatedClock={data.ExtrapolatedClock} />
			</section>
		{/if}
		<section class="relative rounded bg-neutral-800/50">
			<TrackFlags trackStatus={data?.TrackStatus} />

			<Circuit
				circuitKey={data?.SessionInfo.Meeting.Circuit.Key}
				{driversPosition}
				driverList={data?.DriverList}
			/>

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
