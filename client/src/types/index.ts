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
  slug: string;
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
  entries: { driverNumber: number; X: number; Y: number }[];
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

export type CircuitInfo = {
  circuitPoints: { x: number; y: number }[];
  angle: number;
  aspectRatio: number;
  finishAngle: number;
  finishPoint: number;
  pitPoints: { x: number; y: number }[];
};

export type CircuitList = {
  name: string;
  circuitKey: number;
  duration?: number;
  startTime?: string;
  sessionKey?: number;
  driverKey?: number;
  angle?: number;
  aspectRatio?: number;
  finishAngle?: number;
  finishPoint?: number;
  pitPoints?: { x: number; y: number }[];
  pitTime?: number;
  pitDuration?: number;
  sessions: {
    startDate: string;
    type: string;
    sessionKey: number;
    drivers: driverList[];
  }[];
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
    driverNumber: number;
    inPit: boolean;
    pitOut: boolean;
    retired: boolean;
    position: number;
    stopped: boolean;
  }[];
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
  compound?: string;
  age?: number;
  pitStops?: number;
  interval?: string;
};

export type Trackstatus = {
  timestamp: string;
  status: string;
};

export type LapCount = {
  timestamp: Date;
  lap: number;
};

export type TireStints = {
  timestamp: Date;
  lines: {
    driverNumber: number;
    compound?: string;
    age?: number;
    pitStops?: number;
  }[];
};
