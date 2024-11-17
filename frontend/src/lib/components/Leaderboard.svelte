<script lang="ts">
	import type { DriverList } from '$lib/types';

	const { driverList }: { driverList: DriverList } = $props();
</script>

<section class="grid divide-y rounded bg-neutral-800/60 px-1 text-[11px]">
	<div
		class="flex justify-around gap-1 border-neutral-700 py-0.5 text-center text-[10px] uppercase text-neutral-400"
	>
		<p class="w-12">Pos</p>
		<p class="w-11">gap</p>
		<p class="w-14">lap time</p>
		<p class="w-32">sectors</p>
		<p class="w-12">tire</p>
	</div>

	{#each Object.keys(driverList).filter((driver) => driverList[driver].Tla) as driver, i}
		<div class="flex justify-around gap-1 border-neutral-700 py-0.5">
			<div class="flex gap-1">
				<p class="w-4 text-right">{i + 1}</p>
				<div class="w-1" style={`background-color: #${driverList[driver].TeamColour}`}></div>
				<p>{driverList[driver].Tla}</p>
			</div>

			<p>+00.000</p>

			<p class="font-light text-neutral-100">1:20.234</p>

			<div class="flex divide-x font-light text-yellow-300/85">
				<p class="border-neutral-700 pr-0.5">20.000</p>
				<p class="border-neutral-700 px-0.5">20.000</p>
				<p class="border-neutral-700 pl-0.5">20.000</p>
			</div>

			<div class="flex items-center gap-1 font-light text-neutral-300">
				<p>10</p>
				<div class="grid aspect-square w-3 place-items-center rounded-full border-2 border-red-500">
					<div class="h-1 w-1 rounded bg-red-500"></div>
				</div>
				<p>P1</p>
			</div>
		</div>
	{/each}
</section>
