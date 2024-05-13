export type Session = {
  sessionKey: string;
  name: string;
  type: string;
  year: number;
};

export type driverList = {
  racingNumber: number;
  abbreviation: string;
  teamColor: string;
};

export type Country = {
  code: string;
  name: string;
};

export type Circuit = [
  {
    _id: string;
    name: string;
    imageURL?: string;
    imageHeight?: number;
    imageWidth?: number;
    offset?: number;
    scale?: number;
    minX: number;
    minY: number;
    maxY: number;
  },
];

export type SessionGp = {
  _id: string;
  name: string;
  officialName: string;
  location: string;
  meetingKey: number;
  sessionKey: number;
  type: string;
  startDate: Date;
  endDate: Date;
  gmtOffset: string;
  country: Country;
  drivers: driverList[];
  circuit: string;
  circuitInfo: Circuit;
};

export type Position = {
  _id: string;
  timestamp: Date;
  entries: { [key: string]: Entry };
  sessionKey: number;
};

export type Entry = {
  Status: "OnTrack";
  X: number;
  Y: number;
  Z: number;
};

export type driverPosition = Required<driverList> & {
  x: number;
  y: number;
  z: number;
};

export type CircuitPointsApi = {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  x: number;
  y: number;
  z: number;
};

export type CircuitPoints = {
  x: number;
  y: number;
};
