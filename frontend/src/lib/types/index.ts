import type { SessionInfo } from './session';
import type { DriverList } from './driver';
import type { WeatherData } from './weather';
import type { LapCount } from './lapcount';
import type { TimingData } from './timingdata';
import type { TyreStintSeries } from './tire';
import type { TrackStatus } from './trackStatus';
import type { ExtrapolatedClock } from './extrapolatedClock';
import type { Position } from './position';

export type SSE = {
	SessionInfo: SessionInfo;
	DriverList: DriverList;
	WeatherData: WeatherData;
	LapCount: LapCount;
	TimingData: TimingData;
	TyreStintSeries: TyreStintSeries;
	TrackStatus: TrackStatus;
	ExtrapolatedClock: ExtrapolatedClock;
	Position: Position;
};

export type CircuitInfo = {
	circuitPoints: { x: number; y: number }[];
	pitPoints: { x: number; y: number }[];
	angle: number;
	aspectRatio: number;
	finishAngle: number;
	finishPoint: number;
};

export type Session = {
	name: string;
	sessionKey: string;
};
