<script lang="ts">
	import type { DriverList } from '$lib/types/driver';
	import type { TimingData } from '$lib/types/timingdata';
	import type { TyreStintSeries } from '$lib/types/tire';

	const {
		driverList,
		timingData,
		tyreStintSeries
	}: { driverList: DriverList; timingData: TimingData; tyreStintSeries: TyreStintSeries } =
		$props();

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
				return 'red-500';
			case 'medium':
				return 'amber-400';
			case 'hard':
				return 'neutral-200';
			case 'intermediate':
				return 'green-600';
			case 'wet':
				return 'sky-600';
			default:
				return 'neutral-500';
		}
	}
</script>

<section class="grid divide-y rounded bg-neutral-800/60 px-1 text-[11px]">
	<div
		class="flex justify-around gap-1 border-neutral-700 py-0.5 text-center text-[10px] uppercase text-neutral-400"
	>
		<p class="w-12">Pos</p>
		<p class="w-12">gap</p>
		<p class="w-14">lap time</p>
		<p class="w-28">sectors</p>
		<p class="w-12">tire</p>
	</div>

	{#each newList as driver}
		<div
			class="flex justify-around gap-1 border-neutral-700 py-0.5"
			class:opacity-30={timingData.Lines[driver].Retired}
		>
			<div class="flex gap-1">
				<p class="w-4 text-right">{timingData.Lines[driver].Position}</p>
				<div class="w-1" style={`background-color: #${driverList[driver].TeamColour}`}></div>
				<p>{driverList[driver].Tla}</p>
			</div>

			<!-- gap -->
			<p
				class="w-12 text-right"
				class:text-green-500={timingData.Lines[driver].IntervalToPositionAhead.Catching}
			>
				{timingData.Lines[driver].IntervalToPositionAhead.Value || '__.___'}
			</p>

			<!-- lap time -->
			<p
				class="font-light text-neutral-100"
				class:text-purple-500={timingData.Lines[driver].LastLapTime.OverallFastest}
			>
				{timingData.Lines[driver].LastLapTime.Value || '__.___'}
			</p>

			<!-- sectors -->
			<div class="flex divide-x text-[9px] text-neutral-300/70">
				<div
					class="border-neutral-700 pr-1"
					class:text-green-500={timingData.Lines[driver].Sectors[0].PersonalFastest}
					class:text-purple-500={timingData.Lines[driver].Sectors[0].OverallFastest}
				>
					{timingData.Lines[driver].Sectors[0].Value || '__.___'}
				</div>
				<div
					class="border-neutral-700 px-1"
					class:text-green-500={timingData.Lines[driver].Sectors[1].PersonalFastest}
					class:text-purple-500={timingData.Lines[driver].Sectors[1].OverallFastest}
				>
					{timingData.Lines[driver].Sectors[1].Value || '__.___'}
				</div>
				<div
					class="border-neutral-700 pl-1"
					class:text-green-500={timingData.Lines[driver].Sectors[2].PersonalFastest}
					class:text-purple-500={timingData.Lines[driver].Sectors[2].OverallFastest}
				>
					{timingData.Lines[driver].Sectors[2].Value || '__.___'}
				</div>
			</div>

			<!-- tire -->
			<div class="flex w-12 items-center justify-end gap-1 font-light text-neutral-300">
				<p>{tyreStintSeries.Stints[driver][tyreStintSeries.Stints[driver].length - 1].TotalLaps}</p>
				<div
					class={`border-${tireColor(tyreStintSeries.Stints[driver][tyreStintSeries.Stints[driver].length - 1].Compound.toLowerCase())} grid aspect-square w-3 place-items-center rounded-full border-2`}
				>
					<div
						class={`bg-${tireColor(tyreStintSeries.Stints[driver][tyreStintSeries.Stints[driver].length - 1].Compound.toLowerCase())} h-1 w-1 rounded`}
					></div>
				</div>
				<p>P{tyreStintSeries.Stints[driver].length}</p>
			</div>
		</div>
	{/each}
</section>
