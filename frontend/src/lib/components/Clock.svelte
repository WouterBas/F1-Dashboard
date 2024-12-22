<script lang="ts">
	import { onMount } from 'svelte';
	import type { ExtrapolatedClock } from '$lib/types/extrapolatedClock';

	const { extrapolatedClock }: { extrapolatedClock: ExtrapolatedClock } = $props();

	let clock = $state('00:00:00');

	onMount(() => {
		const interval = setInterval(() => {
			if (!extrapolatedClock?.serverTime) return;
			const raceStartTime = new Date(extrapolatedClock.Utc);
			const serverStartTime = new Date(extrapolatedClock.serverTime);

			const diff = serverStartTime.getTime() - raceStartTime.getTime();
			const time = new Date(Date.now() - diff);

			const secondsSinceStart = time.getTime() - raceStartTime.getTime();
			const fakeClock = new Date('01 Jan 1970 ' + extrapolatedClock.Remaining);
			const newClock = new Date(fakeClock.getTime() - secondsSinceStart);

			clock = newClock.toTimeString().split(' ')[0];
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<p class="col-start-3 text-center text-[10px] md:text-xs lg:text-sm">
	{clock}
</p>
