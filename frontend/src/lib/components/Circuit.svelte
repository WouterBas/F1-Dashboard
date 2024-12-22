<script lang="ts">
	import type { CircuitInfo } from '$lib/types';
	import type { DriverList } from '$lib/types/driver';
	import { drawCircuit } from '$lib/utils/drawCircuit';
	import { drawDrivers } from '$lib/utils/drawDrivers';
	import { handleResize } from '$lib/utils/helpers';
	import { onMount } from 'svelte';
	import type { Tween } from 'svelte/motion';

	const {
		circuitKey,
		driversPosition,
		driverList
	}: {
		circuitKey?: number;
		driversPosition: Map<string, Tween<{ X: number; Y: number; Z: number }>>;
		driverList?: DriverList;
	} = $props();

	let circuit: CircuitInfo | undefined = $state();
	let canvasCircuit: HTMLCanvasElement | undefined = $state();
	let canvasDrivers: HTMLCanvasElement | undefined = $state();

	let drivers: Map<string, Tween<{ X: number; Y: number; Z: number }>> = $state(new Map());

	let width = $state(0);
	let dpr = $state(1);
	let lineWidth = $derived(handleResize(width));

	let canvasStats = $state({
		calcWidth: 150,
		calcHeight: 300,
		scale: 1,
		minX: 0,
		minY: 0
	});

	// fetch circuit data
	$effect(() => {
		if (!circuitKey) return;
		fetch(`http://localhost:4000/api/v1/circuit/points/${circuitKey}`)
			.then((response) => response.json())
			.then((data) => (circuit = data));
	});

	// circuit drawing
	$effect(() => {
		if (!circuit || !canvasCircuit) return;
		canvasStats = drawCircuit(
			canvasCircuit,
			circuit.circuitPoints,
			width,
			dpr,
			lineWidth,
			circuit.angle,
			circuit.finishAngle,
			circuit.circuitPoints[circuit.finishPoint],
			circuit.pitPoints
		);
	});

	onMount(() => {
		let animationFrame: number;
		function draw() {
			if (driversPosition && canvasDrivers && circuit && driverList) {
				drawDrivers(
					canvasDrivers,
					canvasStats,
					driversPosition,
					driverList,
					width,
					dpr,
					lineWidth,
					circuit.angle
				);
			}
			animationFrame = requestAnimationFrame(draw);
		}
		draw();
		return () => cancelAnimationFrame(animationFrame);
	});
</script>

<svelte:window bind:innerWidth={width} bind:devicePixelRatio={dpr} />

<div>
	<canvas bind:this={canvasCircuit} bind:clientWidth={width} class="w-full"></canvas>
	<canvas bind:this={canvasDrivers} class="absolute top-0 w-full"></canvas>
</div>
