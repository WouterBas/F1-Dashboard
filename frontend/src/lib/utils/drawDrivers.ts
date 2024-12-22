import type { DriverList } from '$lib/types/driver';
import type { Tween } from 'svelte/motion';

type CanvasStats = {
	calcWidth: number;
	calcHeight: number;
	scale: number;
	minX: number;
	minY: number;
};

export function drawDrivers(
	canvas: HTMLCanvasElement,
	canvasStats: CanvasStats,
	driverPositions: Map<string, Tween<{ X: number; Y: number; Z: number }>>,
	driverList: DriverList,
	width: number,
	dpr: number,
	deviceWidth: number,
	angle: number
) {
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

	ctx.canvas.height = canvasStats.calcHeight * dpr;
	ctx.canvas.width = canvasStats.calcWidth * dpr;

	ctx.scale(dpr, dpr);

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// rotate points by angle degrees around center
	const center = {
		x: width / 2,
		y: width / 2
	};

	if (driverPositions.size === 0) return;

	// draw driver positions
	driverPositions.forEach((value, key) => {
		const { X, Y } = value.current;
		if (X === 0 && Y === 0) return;

		// rotate points by angle degrees around center
		const dx = X - center.x;
		const dy = Y - center.y;
		const angleRad = (angle * Math.PI) / 180;
		let nx = center.x + Math.cos(angleRad) * dx - Math.sin(angleRad) * dy;
		let ny = center.y + Math.sin(angleRad) * dx + Math.cos(angleRad) * dy;

		const abbreviation = driverList[key]?.Tla || 'SC';
		const teamColor = driverList[key]?.TeamColour || 'fbbf24';

		// scale driver positions
		nx = (nx + Math.abs(canvasStats.minX)) / canvasStats.scale + width / 20;
		ny = (ny + Math.abs(canvasStats.minY)) / canvasStats.scale + width / 20 - 8;

		// flip points vertically
		ny = canvasStats.calcHeight - ny;

		// draw dot
		ctx.beginPath();
		ctx.arc(nx, ny, 4 * deviceWidth, 0, 2 * Math.PI, false);
		ctx.fillStyle = teamColor ? '#' + teamColor : 'white';
		ctx.fill();

		// draw abbreviation
		ctx.beginPath();
		ctx.roundRect(
			nx - 6 * deviceWidth,
			ny - 4 * deviceWidth,
			16 * deviceWidth,
			-8 * deviceWidth,
			deviceWidth
		);
		ctx.fillStyle = 'rgba(50, 50, 50, 0.85)';
		ctx.fill();
		ctx.font = `${8 * deviceWidth}px monospace`;
		ctx.fillStyle = 'white';
		ctx.fillText(abbreviation ? abbreviation : '', nx - 5 * deviceWidth, ny - 5 * deviceWidth);
	});
}
