import type { Entries } from '$lib/types/position';
import type { DriverList } from '$lib/types/driver';
type CanvasStats = {
	calcWidth: number;
	calcHeight: number;
	scale: number;
	minX: number;
	minY: number;
};

export function drawDrivers(
	i: number,
	canvas: HTMLCanvasElement,
	canvasStats: CanvasStats,
	driverPositions: Entries,
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

	ctx.beginPath();

	ctx.arc(20, 50, 5 * Math.abs(Math.cos(i)), 0, 2 * Math.PI);

	ctx.fillStyle = '#fff';
	ctx.fill();

	if (!driverPositions) return;
	const positions = Object.keys(driverPositions).map((key) => {
		const dx = driverPositions[key].X - center.x;
		const dy = driverPositions[key].Y - center.y;
		const angleRad = (angle * Math.PI) / 180;
		const nx = center.x + Math.cos(angleRad) * dx - Math.sin(angleRad) * dy;
		const ny = center.y + Math.sin(angleRad) * dx + Math.cos(angleRad) * dy;
		return {
			X: nx,
			Y: ny,
			abbreviation: driverList[key]?.Tla || 'SC',
			teamColor: driverList[key]?.TeamColour || 'fbbf24',
			offTrack: driverPositions[key].X && driverPositions[key].Y ? false : true
		};
	});

	// scale driver positions
	positions.forEach((driver) => {
		driver.X = (driver.X + Math.abs(canvasStats.minX)) / canvasStats.scale + width / 20;
		driver.Y = (driver.Y + Math.abs(canvasStats.minY)) / canvasStats.scale + width / 20 - 8;
	});

	// flip points vertically
	positions.forEach((driver) => {
		driver.Y = canvasStats.calcHeight - driver.Y;
	});

	positions.forEach(({ abbreviation, teamColor, X, Y, offTrack }) => {
		if (offTrack) return;

		ctx.beginPath();

		ctx.arc(X, Y, 4 * deviceWidth, 0, 2 * Math.PI, false);
		ctx.fillStyle = teamColor ? '#' + teamColor : 'white';

		ctx.fill();

		ctx.beginPath();
		ctx.roundRect(
			X - 6 * deviceWidth,
			Y - 4 * deviceWidth,
			16 * deviceWidth,
			-8 * deviceWidth,
			deviceWidth
		);
		ctx.fillStyle = 'rgba(50, 50, 50, 0.85)';
		ctx.fill();

		ctx.font = `${8 * deviceWidth}px monospace`;
		ctx.fillStyle = 'white';
		ctx.fillText(abbreviation ? abbreviation : '', X - 5 * deviceWidth, Y - 5 * deviceWidth);
	});
}
