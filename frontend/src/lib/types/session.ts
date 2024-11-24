export type SessionInfo = {
	Meeting: Meeting;
	ArchiveStatus: {
		Status: string;
	};
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
