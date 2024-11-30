export type Position = {
	Timestamp: string;
	Entries: Entries;
};

export type Entries = {
	[key: string]: {
		Status: string;
		X: number;
		Y: number;
		Z: number;
	};
};
