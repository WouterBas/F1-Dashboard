<script lang="ts">
	import { MousePointer2, CloudRainWind } from 'lucide-svelte';
	import type { WeatherData } from '$lib/types';

	const { weather }: { weather: WeatherData } = $props();
</script>

<div class="absolute left-1 top-1 grid grid-flow-col items-center gap-2 rounded text-[8px]">
	<div class="grid">
		<span>{weather.AirTemp}</span>
		<span class="-mt-2 text-center text-[6px]">AIR</span>
	</div>

	<div class="grid">
		<span class="text-center">{weather.TrackTemp}</span>
		<span class="-mt-2 text-center text-[6px]">TRC</span>
	</div>

	<div class="grid">
		<MousePointer2
			fill="#fff"
			class="h-3 w-3 justify-self-center"
			style={`transform: rotate(${weather.WindDirection}deg)`}
		/>
		<span class="-mt-1 text-[6px]">{weather.WindSpeed}m/s</span>
	</div>

	{#if weather.Rainfall === '1'}
		<CloudRainWind class="h-4 w-4" />
	{/if}
</div>
