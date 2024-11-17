export type SSE = {
	SessionInfo: SessionInfo;
	DriverList: DriverList;
	WeatherData: WeatherData;
	LapCount: LapCount;
};

type SessionInfo = {
	Meeting: Meeting;
	ArchiveStatus: ArchiveStatus;
	Key: number;
	Type: string;
	Name: string;
	StartDate: Date;
	EndDate: Date;
	GmtOffset: string;
	Path: string;
	_kf: boolean;
};

type Meeting = {
	Key: number;
	Name: string;
	OfficialName: string;
	Location: string;
	Number: number;
	Country: Country;
	Circuit: Circuit;
};
type Circuit = {
	Key: number;
	ShortName: string;
};

type Country = {
	Key: number;
	Code: string;
	Name: string;
};

type ArchiveStatus = {
	Status: string;
};

export type DriverList = {
	[key: string]: {
		RacingNumber: string;
		BroadcastName: string;
		FullName: string;
		Tla: string;
		Line: number;
		TeamName: string;
		TeamColour: string;
		FirstName: string;
		LastName: string;
		Reference: string;
		HeadshotUrl: string;
		CountryCode: string;
		NameFormat: string;
	};
};

export type WeatherData = {
	AirTemp: string;
	Humidity: string;
	Pressure: string;
	Rainfall: string;
	TrackTemp: string;
	WindDirection: string;
	WindSpeed: string;
	_kf: boolean;
};

export type LapCount = {
	CurrentLap: number;
	TotalLaps: number;
	_kf: boolean;
};

export type CircuitPoints = {
	circuitPoints: { x: number; y: number }[];
	pitPoints: { x: number; y: number }[];
	angle: number;
	aspectRatio: number;
	finishAngle: number;
	finishPoint: number;
};
