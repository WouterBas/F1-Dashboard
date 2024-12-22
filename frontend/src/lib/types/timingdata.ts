export type TimingData = {
	Lines: {
		[key: string]: {
			GapToLeader: string;
			IntervalToPositionAhead?: {
				Value: string;
				Catching: boolean;
			};
			Line: number;
			Stats?: Stats[];
			Position: string;
			ShowPosition: boolean;
			RacingNumber: string;
			Retired: boolean;
			InPit: boolean;
			PitOut: boolean;
			Stopped: boolean;
			Status: number;
			Sectors: Sector[];
			BestLapTime: BestLapTime;
			LastLapTime: LastLapTime;
			NumberOfLaps: number;
			NumberOfPitStops: number;
			TimeDiffToPositionAhead?: string;
		};
	};
	SessionPart?: number;
	Withheld?: boolean;
};

type Sector = {
	Stopped: boolean;
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
	PreviousValue: string;
};

type BestLapTime = {
	Value: string;
	Lap: number;
};

type LastLapTime = {
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

type Stats = { TimeDiffToFastest: string; TimeDifftoPositionAhead: string };
