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
  startDate: string;
  endDate: string;
  gmtOffset: string;
  url: string;
  circuitKey: number;
  circuitName: string;
  drivers: driverList[];
};

export type SessionList = {
  name: string;
  sessionKey: number;
  type:
    | "Race"
    | "Practice 1"
    | "Practice 2"
    | "Qualifying"
    | "Sprint"
    | "Sprint Qualifying"
    | "Sprint Shootout";
  year: number;
};

export type Position = {
  _id: string;
  timestamp: Date;
  entries: { [key: string]: Entry };
  sessionKey: number;
};

export type Entry = {
  X: number;
  Y: number;
};

export type DriverPosition = {
  timestamp: Date;
  entries: { [key: string]: { X: number; Y: number } };
};

export type SortedDriverPosition = {
  racingNumber: number;
  abbreviation: string;
  teamColor: string;
  X: number;
  Y: number;
  retired: boolean;
  stopped: boolean;
};

export type CircuitPoints = {
  x: number;
  y: number;
};

export type CircuitList = {
  name: string;
  circuitKey: number;
  duration?: number;
  startTime?: string;
  sessionKey?: number;
  driverKey?: number;
  sessions: {
    startDate: string;
    type: string;
    sessionKey: number;
    drivers: driverList[];
  }[];
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

export type CircuitDimensions = {
  scale: number;
  calcHeight: number;
  calcWidth: number;
  minX: number;
  minY: number;
};

export type TimgingData = {
  timestamp: Date;
  lines: {
    [key: string]: {
      inPit: boolean;
      pitOut: boolean;
      retired: boolean;
      position: number;
      stopped: boolean;
    };
  };
};

export type DriverTimingList = {
  racingNumber: number;
  abbreviation: string;
  teamColor: string;
  inPit: boolean;
  pitOut: boolean;
  retired: boolean;
  position: number;
  stopped: boolean;
};

export type Trackstatus = {
  timestamp: string;
  status: string;
};
