<script lang="ts">
	import { onMount } from 'svelte';
	import { MousePointer2, CloudRainWind, SunMedium, Play } from 'lucide-svelte';

	let messages: { type: string; date: string } | undefined = $state();

	// onMount(() => {
	// 	const evtSource = new EventSource('http://localhost:3000/');
	// 	evtSource.onopen = function (event) {
	// 		console.log('open');
	// 	};

	// 	evtSource.onmessage = function (event) {
	// 		messages = JSON.parse(event.data);
	// 	};

	// 	return () => {
	// 		evtSource.close();
	// 	};
	// });
</script>

<svelte:head>
	<title>F1 Dashboard | Live</title>
</svelte:head>

<main class="mt-1 grid grid-rows-[auto_auto_1fr] gap-2 text-xs">
	<section class="grid grid-cols-[auto_1fr_auto] gap-x-1 border-t border-neutral-700 pt-1">
		<h2>São Paulo Grand Prix</h2>
		<p class="col-start-3 font-bold">10/72</p>
		<h3 class="text-[10px]">Race</h3>

		<p class="col-start-3 text-center text-[10px]">00:00</p>
	</section>
	<section class="relative h-64 rounded border-red-500 bg-neutral-800/60">
		<div
			class="absolute right-1 top-1 rounded border border-green-500 px-1 text-[10px] text-green-500"
		>
			track Clear
		</div>

		<div class="absolute left-1 top-1 grid grid-flow-col items-center gap-2 rounded text-[9px]">
			<div class="grid">
				<span class="text-center">29</span>
				<span class="-mt-2 text-center text-[6px]">TRC</span>
			</div>
			<div class="grid">
				<span>38</span>
				<span class="-mt-2 text-center text-[6px]">AIR</span>
			</div>
			<div class="grid">
				<MousePointer2 fill="#fff" class="h-3 w-3 -rotate-180  justify-self-center" />
				<span class="-mt-1 text-[6px]">0.4m/s</span>
			</div>
			<div><CloudRainWind class="h-4 w-4" /></div>
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-stretch gap-1 p-1">
			<button class="aspect-square w-8 rounded-full bg-neutral-700">
				<Play fill="#fff" class="m-auto w-3.5 translate-x-[1px]" />
			</button>
			<select class="h-fit appearance-none rounded bg-neutral-700 px-2 py-0.5">
				<option>x1</option>
				<option>x2</option>
				<option>x4</option>
			</select>
			<input
				type="range"
				class="h-1 w-full appearance-none rounded bg-neutral-500/50 accent-white"
			/>
			<p>00:00</p>
		</div>

		<div></div>
	</section>
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
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as driver}
			<div class="flex justify-around gap-1 border-neutral-700 py-0.5">
				<div class="flex gap-1">
					<p class="w-4 text-right">{driver}</p>
					<div class="w-1 bg-neutral-500"></div>
					<p>ABR</p>
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
					<div
						class="grid aspect-square w-3 place-items-center rounded-full border-2 border-red-500"
					>
						<div class="h-1 w-1 rounded bg-red-500"></div>
					</div>
					<p>P1</p>
				</div>
			</div>
		{/each}
	</section>
</main>
