<script lang="ts">
	import { MousePointer2, CloudRainWind } from 'lucide-svelte';
	import type { WeatherData } from '$lib/types/weather';

	const { weather }: { weather: WeatherData } = $props();
</script>

<div
	class="absolute left-1 top-1 grid grid-flow-col items-center gap-2 rounded bg-neutral-700 px-1 text-[8px] lg:left-2 lg:top-2 lg:px-1.5 lg:py-0.5 lg:text-[10px] xl:px-2 xl:py-1 xl:text-xs"
>
	<div class="grid">
		<span>{weather.AirTemp}</span>
		<span class="-mt-2 text-center text-[6px] lg:-mt-1 lg:text-[8px] xl:-mt-0.5 xl:text-[10px]"
			>AIR</span
		>
	</div>

	<div class="grid">
		<span class="text-center">{weather.TrackTemp}</span>
		<span class="-mt-2 text-center text-[6px] lg:-mt-1 lg:text-[8px] xl:-mt-0.5 xl:text-[10px]"
			>TRC</span
		>
	</div>

	<div class=" grid h-fit">
		<MousePointer2
			fill="#fff"
			class="mt-[1px] h-2.5 w-2.5 justify-self-center lg:mt-0 lg:h-3 lg:w-3 xl:h-4 xl:w-4"
			style={`transform: rotate(${weather.WindDirection}deg)`}
		/>
		<span class="-mt-1 h-3 text-[6px] lg:-mt-0.5 lg:text-[8px] xl:-mt-0 xl:text-[10px]"
			>{weather.WindSpeed}m/s</span
		>
	</div>

	{#if weather.Rainfall === '1'}
		<CloudRainWind class="h-4 w-4" />
	{/if}
</div>
