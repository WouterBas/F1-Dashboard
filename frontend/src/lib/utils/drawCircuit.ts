import { circuitSize } from './helpers';
import { mapToCenter, scalePoints, drawPath } from './drawHelpers';

export function drawCircuit(
	canvas: HTMLCanvasElement,
	circuitPoints: { x: number; y: number }[],
	width: number,
	dpr: number,
	lineWidth: number,
	angle: number,
	finishAngle: number,
	finishPoint: { x: number; y: number },
	pitLanePoints: { x: number; y: number }[],
	close = true,
	drawPoints?: boolean
) {
	// rotate points by angle degrees around center
	const center = {
		x: width / 2,
		y: width / 2
	};

	const points = mapToCenter(circuitPoints, center, angle);
	const pitPoints = mapToCenter(pitLanePoints, center, angle);
	const finishLine = mapToCenter([finishPoint], center, angle);

	const minX = Math.min(...points.map((loc) => loc.x));
	const minY = Math.min(...points.map((loc) => loc.y));
	const maxX = Math.max(...points.map((loc) => loc.x)) + Math.abs(minX);
	const maxY = Math.max(...points.map((loc) => loc.y)) + Math.abs(minY);

	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

	const { scale, calcHeight, calcWidth } = circuitSize(maxX, maxY, width);

	ctx.canvas.height = calcHeight * dpr;
	ctx.canvas.width = calcWidth * dpr;

	ctx.scale(dpr, dpr);

	// scale points
	scalePoints(points, scale, minX, minY, width, calcHeight);
	scalePoints(pitPoints, scale, minX, minY, width, calcHeight);
	scalePoints(finishLine, scale, minX, minY, width, calcHeight);

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	//draw pit lane and circuit
	drawPath(ctx, pitPoints, lineWidth, 'grey');
	drawPath(ctx, points, lineWidth, 'whitesmoke', close);

	// draw dots
	if (drawPoints) {
		points.forEach((point, i, arr) => {
			ctx.beginPath();
			ctx.resetTransform();
			ctx.scale(dpr, dpr);

			// first point green
			if (i === 0) {
				ctx.arc(point.x, point.y, 4 * lineWidth, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
				ctx.strokeStyle = 'rgb(52, 211, 153)';
				// last point red
			} else if (i === arr.length - 1) {
				ctx.arc(point.x, point.y, 4 * lineWidth, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
				ctx.strokeStyle = 'rgb(239, 68, 68)';
				// middle points blue
			} else {
				ctx.arc(point.x, point.y, 3 * lineWidth, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgba(96, 165, 250, 0.25)';
				ctx.strokeStyle = 'rgb(96, 165, 250)';
			}

			ctx.lineWidth = 0.5 * lineWidth;
			ctx.fill();
			ctx.stroke();
		});
	}

	// draw finish line
	ctx.beginPath();
	ctx.fillStyle = 'whitesmoke';
	ctx.translate(finishLine[0].x, finishLine[0].y);
	ctx.rotate((finishAngle * Math.PI) / 180);
	ctx.rect(-1.5 * lineWidth, -6 * lineWidth, 3 * lineWidth, 12 * lineWidth);
	ctx.fill();
}
