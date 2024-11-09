<script>
	import FeatureCard from './FeatureCard.svelte';
	import Option from './SelectOption.svelte';
</script>

<header>
	<h1 class="text-3xl font-bold">F1 DASHBOARD</h1>
</header>

<main class="mx-2">
	<section class="mx-auto mb-8 mt-4 p-2">
		<h2 class="text-2xl font-bold">Pick a Session</h2>
		<div class="mx-auto grid max-w-72 gap-3">
			<Option />
			<Option />
			<Option />
			<button class="rounded border bg-neutral-900 px-4 py-1 shadow">View</button>
			<button class="rounded border bg-neutral-900 px-4 py-1 shadow">Go live</button>
		</div>
	</section>

	<section>
		<h2 class="text-2xl font-bold">Features</h2>
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
