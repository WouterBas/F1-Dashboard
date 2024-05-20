export type Session = {
  Meeting: Meeting;
  ArchiveStatus: ArchiveStatus;
  Key: number;
  Type: string;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  GmtOffset: string;
  Path: string;
};

export type ArchiveStatus = {
  Status: string;
};

export type Meeting = {
  Key: number;
  Name: string;
  OfficialName: string;
  Location: string;
  Country: Country;
  Circuit: Circuit;
};

export type Circuit = {
  Key: number;
  ShortName: string;
};

export type Country = {
  Key: number;
  Code: string;
  Name: string;
};

export type Driver = {
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
  NameFormat?: string;
};

export type schedule = {
  Key: number;
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit_;
  date: Date;
  time: string;
  FirstPractice: FirstPractice;
  SecondPractice: FirstPractice;
  ThirdPractice?: FirstPractice;
  Sprint?: FirstPractice;
  Qualifying: FirstPractice;
};

export type Circuit_ = {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
};

export type Location = {
  lat: string;
  long: string;
  locality: string;
  country: string;
};

export type FirstPractice = {
  date: Date;
  time: string;
};

export type NewDriver = {
  racingNumber: number;
  abbreviation: string;
  teamColor: string;
};

export type NewSession = {
  name: string;
  officialName: string;
  location: string;
  meetingKey: number;
  sessionKey: number;
  type: string;
  startDate: Date;
  endDate: Date;
  gmtOffset: string;
  country: {
    code: string;
    name: string;
  };
  drivers: NewDriver[];
};

export type Entrie = {
  Status: string;
  X: number;
  Y: number;
  Z: number;
};
