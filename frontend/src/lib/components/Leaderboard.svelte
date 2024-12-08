<script lang="ts">
	import type { DriverList } from '$lib/types/driver';
	import type { TimingData } from '$lib/types/timingdata';
	import type { TyreStintSeries } from '$lib/types/tire';
	import { flip } from 'svelte/animate';

	const {
		driverList,
		timingData,
		tyreStintSeries
	}: { driverList: DriverList; timingData: TimingData; tyreStintSeries: TyreStintSeries } =
		$props();

	// TODO swap driverlist line with timingdata postion
	function convertList(list: DriverList) {
		return Object.keys(driverList)
			.filter((driver) => driverList[driver].Tla)
			.sort((a, b) => {
				return driverList[a].Line - driverList[b].Line;
			});
	}

	let newList = $derived(convertList(driverList));

	function tireColor(tyre: string) {
		switch (tyre) {
			case 'soft':
				return '#ef4444';
			case 'medium':
				return '#fbbf24';
			case 'hard':
				return '#f5f5f5';
			case 'intermediate':
				return '#22c55e';
			case 'wet':
				return '#0284c7';
			default:
				return '#525252';
		}
	}
</script>

<section
	class="grid self-start rounded bg-neutral-800/60 px-1 py-1 text-[11px] sm:row-start-1 md:text-xs lg:px-2 lg:text-sm"
>
	<table>
		<thead>
			<tr class="uppercase text-neutral-300">
				<th>Pos</th>
				<th>gap</th>
				<th>lap time</th>
				<th>sectors</th>
				<th>tire</th>
			</tr>
		</thead>

		<tbody>
			{#each newList as driver (driver)}
				<tr
					class="border-t border-neutral-700 p-10"
					class:opacity-30={timingData.Lines[driver]?.Retired || timingData.Lines[driver]?.Stopped}
					animate:flip={{ duration: 500 }}
				>
					<td class="flex gap-1 md:py-[1px] lg:gap-1.5 lg:py-0.5 xl:py-1">
						<p class="w-4 text-right">{timingData.Lines[driver]?.Position || '?'}</p>
						<div class="w-1" style={`background-color: #${driverList[driver].TeamColour}`}></div>
						<p>{driverList[driver].Tla}</p>
					</td>

					<!-- gap -->
					<td
						class="px-1 lg:px-1.5"
						class:text-green-500={timingData.Lines[driver]?.IntervalToPositionAhead?.Catching}
					>
						<p class="m-auto w-[46px] text-right md:w-[52px] lg:w-[60px]">
							{#if timingData.SessionPart}
								{timingData.Lines[driver]?.Stats?.[timingData.SessionPart - 1]
									?.TimeDifftoPositionAhead || '__.___'}
							{:else}
								{timingData.Lines[driver]?.IntervalToPositionAhead?.Value ||
									timingData.Lines[driver]?.Stats?.[timingData.Lines[driver].Stats.length - 1]
										.TimeDifftoPositionAhead ||
									'__.___'}
							{/if}
						</p>
					</td>

					<!-- lap time -->
					<td
						class="px-1 text-center lg:px-1.5"
						class:text-purple-500={timingData.Lines[driver]?.LastLapTime.OverallFastest}
					>
						{timingData.Lines[driver]?.LastLapTime?.Value || '_:__.___'}
					</td>

					<!-- sectors -->
					<td class="px-1 lg:px-1.5">
						<div
							class="flex justify-center gap-1 divide-x text-[9px] text-neutral-400 md:text-[10px] lg:gap-1.5 lg:text-xs"
						>
							<div
								class="border-neutral-700"
								class:text-green-500={timingData.Lines[driver]?.Sectors[0].PersonalFastest}
								class:text-purple-500={timingData.Lines[driver]?.Sectors[0].OverallFastest}
							>
								{timingData.Lines[driver]?.Sectors[0]?.Value || '__.___'}
							</div>
							<div
								class="border-neutral-700 pl-1 lg:pl-1.5"
								class:text-green-500={timingData.Lines[driver]?.Sectors[1].PersonalFastest}
								class:text-purple-500={timingData.Lines[driver]?.Sectors[1].OverallFastest}
							>
								{timingData.Lines[driver]?.Sectors[1]?.Value || '__.___'}
							</div>
							<div
								class="border-neutral-700 pl-1 lg:pl-1.5"
								class:text-green-500={timingData.Lines[driver]?.Sectors[2].PersonalFastest}
								class:text-purple-500={timingData.Lines[driver]?.Sectors[2].OverallFastest}
							>
								{timingData.Lines[driver]?.Sectors[2]?.Value || '__.___'}
							</div>
						</div>
					</td>

					<!-- tire -->
					<td class="flex items-center justify-end gap-1 text-neutral-300 md:pl-1">
						{#if timingData.Lines[driver]?.InPit}
							<p class="w-full rounded-sm bg-neutral-600 px-2 text-center text-white">PIT</p>
						{:else}
							<p>
								{tyreStintSeries?.Stints[driver][tyreStintSeries.Stints[driver].length - 1]
									?.TotalLaps || '0'}
							</p>
							<div
								class="grid aspect-square w-3 place-items-center rounded-full border-2"
								style={`border-color: ${tireColor(tyreStintSeries?.Stints[driver][tyreStintSeries.Stints[driver].length - 1]?.Compound.toLowerCase())};`}
							>
								<div
									class="h-1 w-1 rounded"
									style={`background-color: ${tireColor(tyreStintSeries?.Stints[driver][tyreStintSeries.Stints[driver].length - 1]?.Compound.toLowerCase())};`}
								></div>
							</div>
							<p>P{tyreStintSeries?.Stints[driver].length - 1 || '0'}</p>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
	th {
		font-weight: 400;
	}
</style>
