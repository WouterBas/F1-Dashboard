export type driverList = {
  racingNumber: number;
  abbreviation: string;
  teamColor: string;
};

export type Country = {
  code: string;
  name: string;
};

export type Circuit = {
  _id: string;
  name: string;
  cicuitPoints?: { x: number; y: number }[];
  duration?: number;
  selectedDriver?: number;
  startTime?: Date;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
};

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

export type CircuitPoints = {
  x: number;
  y: number;
};

export type CircuitList = {
  _id: string;
  name: string;
  latestSession: number;
};

export type CircuitInfo = {
  _id: string;
  name: string;
  duration?: number;
  selectedDriver?: number;
  startTime?: string;
  sessionInfo: {
    sessionKey: number;
    startDate: string;
    drivers: { racingNumber: number; abbreviation: string }[];
  };
};