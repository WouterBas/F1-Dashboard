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
