export type TyreStintSeries = {
	Stints: {
		[key: string]: {
			Compound: Compound;
			New: string;
			TyresNotChanged: string;
			TotalLaps: number;
			StartLaps: number;
		}[];
	};
	_kf: boolean;
};

enum Compound {
	Hard = 'HARD',
	Medium = 'MEDIUM',
	Soft = 'SOFT'
}
