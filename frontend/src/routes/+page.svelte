<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';
	import Option from './SelectOption.svelte';
</script>

<header>
	<h1 class="text-3xl font-bold">F1 DASHBOARD</h1>
</header>

<main>
	<section class="mx-auto mb-12 mt-8 p-2">
		<div class="mb-12">
			<h2 class="text-center text-2xl font-bold uppercase">live telemetry</h2>
			<p class="font-sans text-sm">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non accumsan orci, sit amet
				egestas nisi. Donec varius justo eleifend.
			</p>
		</div>

		<button
			class="mx-auto mb-12 block w-64 rounded-md border border-emerald-500 bg-neutral-900 px-4 py-2 font-bold uppercase text-emerald-500"
			>Go live</button
		>
		<h2 class="mb-4 text-center text-2xl font-bold uppercase">Pick a session</h2>

		<div class="mx-auto grid max-w-64 gap-4">
			<Option label="Year" />
			<Option label="Grand Prix" />
			<Option label="Session" />
			<button class="mt-4 rounded-md border bg-neutral-900 px-4 py-2 font-bold uppercase"
				>View</button
			>
		</div>
	</section>

	<section>
		<div class="grid gap-2">
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
			<FeatureCard
				title="Live Telemetry"
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
