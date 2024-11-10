<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';
	import Option from './SelectOption.svelte';

	const yearOptions = $state([
		{ name: '2023', value: 2023 },
		{ name: '2024', value: 2024 }
	]);
	const grandPrixOptions = $state([
		{ name: 'Bahrain Grand Prix', value: 9309 },
		{ name: 'Australian Grand Prix', value: 2424 },
		{ name: 'Azerbaijan Grand Prix', value: 2499 }
	]);
	const typeOptions = $state([
		{ name: 'Practice 1', value: 0 },
		{ name: 'Practice 2', value: 1 },
		{ name: 'Practice 3', value: 2 },
		{ name: 'Qualifying', value: 3 },
		{ name: 'Race', value: 4 }
	]);

	let selectedYear = $state(yearOptions[yearOptions.length - 1].value);
	let selectedGrandPrix = $state(grandPrixOptions[grandPrixOptions.length - 1].value);
	let selectedType = $state(typeOptions[typeOptions.length - 1].value);
</script>

<header>
	<h1 class="text-3xl font-bold">F1 DASHBOARD</h1>
</header>

<main>
	<section class="mx-auto mb-16 mt-8 p-2">
		<div class="mb-4">
			<h2 class="text-center text-2xl font-bold uppercase">live telemetry</h2>
			<p class="mx-auto max-w-md font-sans text-sm">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet
				egestas nisi. Donec varius justo eleifend.
			</p>
		</div>

		<button
			class="mx-auto mb-16 block w-64 rounded-md border border-emerald-500 bg-neutral-900 px-4 py-2 font-bold uppercase text-emerald-500"
			>Go live</button
		>
		<h2 class="text-center text-2xl font-bold uppercase">Pick a session</h2>
		<p class=" mx-auto mb-4 max-w-md font-sans text-sm">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet
			egestas nisi. Donec varius justo eleifend.
		</p>

		<div class="mx-auto grid max-w-64 gap-4">
			<Option label="Year" options={yearOptions} bind:value={selectedYear} />
			<Option label="Grand Prix" options={grandPrixOptions} bind:value={selectedGrandPrix} />
			<Option label="Session" options={typeOptions} bind:value={selectedType} />
			<button class="mt-4 rounded-md border bg-neutral-900 px-4 py-2 font-bold uppercase"
				>View</button
			>
		</div>
	</section>

	<section>
		<h2 class="mb-2 text-center text-2xl font-bold uppercase">Features</h2>

		<div class="mx-auto grid max-w-4xl gap-2 sm:grid-cols-2">
			<FeatureCard
				title="Live Telemetry"
				text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet egestas nisi. Donec varius justo eleifend."
			/>
			<FeatureCard
				title="Leaderboard"
				text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet egestas nisi. Donec varius justo eleifend."
			/>
			<FeatureCard
				title="Tire compound and pit stops"
				text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet egestas nisi. Donec varius justo eleifend."
			/>
			<FeatureCard
				title="Time intervals"
				text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet egestas nisi. Donec varius justo eleifend."
			/>
			<div class="grid"></div>
		</div>
	</section>
</main>

<footer class="self-end">
	<p class="text-center font-sans text-[10px] text-neutral-500">
		This project/website is unofficial and is not associated in any way with the Formula 1
		companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and
		related marks are trade marks of Formula One Licensing B.V
	</p>
</footer>
