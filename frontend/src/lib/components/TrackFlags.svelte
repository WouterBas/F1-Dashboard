<script lang="ts">
	import type { TrackStatus } from '$lib/types/trackStatus';
	import { Flag, CarTaxiFront } from 'lucide-svelte';

	const { trackStatus }: { trackStatus: TrackStatus | undefined } = $props();
	let visible = $state(true);
	let color = $state('#22c55e');
	let text = $state('All Clear');
	let icon = $state('Flag');

	const green = '#22c55e';
	const yellow = '#facc15';
	const red = '#ef4444';

	$effect(() => {
		if (trackStatus?.Message === 'AllClear') {
			color = green;
			text = 'All Clear';
			icon = 'Flag';
			const timeout = setTimeout(() => {
				visible = false;
			}, 5000);

			return () => {
				clearTimeout(timeout);
			};
		} else {
			visible = true;
		}
		if (trackStatus?.Message === 'Yellow') {
			color = yellow;
			text = 'Yellow Flag';
			icon = 'Flag';
		}
		if (trackStatus?.Message === 'Red') {
			color = red;
			text = 'Red Flag';
			icon = 'Flag';
		}
		if (trackStatus?.Message === 'VSCDeployed') {
			color = yellow;
			text = 'VSC Deployed';
			icon = 'Car';
		}
		if (trackStatus?.Message === 'VSCEnding') {
			color = green;
			text = 'VSC Ending';
			icon = 'Car';
		}
		if (trackStatus?.Message === 'SCDeployed') {
			color = yellow;
			text = 'SC Deployed';
			icon = 'Car';
		}
		if (trackStatus?.Message === 'SCEnding') {
			color = green;
			text = 'SC Ending';
			icon = 'Car';
		}
	});
</script>

{#if trackStatus && visible}
	<div
		class="absolute right-1 top-1 flex items-center gap-1 rounded border px-1 text-[10px]"
		style={`border-color: ${color}; color: ${color}`}
	>
		{#if icon === 'Flag'}
			<Flag fill={color} stroke={color} class="h-3 w-3" />
		{:else}
			<CarTaxiFront stroke={color} class="h-3 w-3" />
		{/if}

		<p>{text}</p>
	</div>
{/if}
