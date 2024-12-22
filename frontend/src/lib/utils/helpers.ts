export function remap(imageHeight: number, pos: number, min: number, maxY: number): number {
	const padding = imageHeight / 28;
	return (pos + min) / (maxY / (imageHeight - padding)) + padding / 2;
}

export function circuitSize(
	maxX: number,
	maxY: number,
	width: number
): { scale: number; calcHeight: number; calcWidth: number } {
	const aspectRatio = maxX / maxY;
	if (aspectRatio > 1) {
		return {
			scale: maxX / (width - width / 10),
			calcHeight: width / aspectRatio + width / 20,
			calcWidth: width
		};
	} else {
		return {
			scale: maxY / (width - width / 10),
			calcHeight: width,
			calcWidth: width * aspectRatio + width / 20
		};
	}
}

export function handleResize(width: number) {
	switch (true) {
		case width < 640:
			return 1.25;
		case width < 768:
			return 2;
		case width < 1024:
			return 2.5;
		default:
			return 3;
	}
}
