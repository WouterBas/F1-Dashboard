import { ObjectId } from "mongodb";

export type circuitPoints = {
  x: number;
  y: number;
};

export type Entry = {
  Status: string;
  X: number;
  Y: number;
  Z: number;
};

export type PatchCircuit = {
  circuitPoints: circuitPoints[];
  startTime: Date;
  duration: number;
  circuitKey: number;
  sessionKey: number;
  driverKey: number;
  angle: number;
  aspectRatio: number;
};

export type Session = {
  type: string;
  date: string;
};

export type Schedule = {
  name: string;
  date: string;
  year: string;
  sessions: Session[];
};

export type convertedSchedule = {
  name: string;
  raceDate: string;
  type: string;
  date: Date;
};

export type F1Meeting = {
  Meeting: {
    Key: number;
    Name: string;
    OfficialName: string;
    Location: string;
    Country: {
      Key: number;
      Code: string;
      Name: string;
    };
    Circuit: {
      Key: number;
      ShortName: string;
    };
  };
  ArchiveStatus: { Status: string };
  Key: number;
  Type: string;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  GmtOffset: string;
  Path: string;
};

export type Meeting = {
  name: string;
  sessionKey: number;
  type: string;
  startDate: Date;
  endDate: Date;
  url: string;
  circuitKey: number;
  circuitName: string;
};

export type F1DriverObject = {
  [key: string]: F1Driver;
};
export type F1Driver = {
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
  HeadshotUrl?: string;
  CountryCode: string;
  NameFormat?: string;
};

export type F1Entries = {
  [key: string]: {
    Status: string;
    X: number;
    Y: number;
    Z: number;
  };
};

export type Entrie = {
  driverNumber: number;
  X: number;
  Y: number;
};

export type F1Position = {
  [key: string]: any;
  Timestamp: string;
  Entries: F1Entries;
};

export type Position = {
  timestamp: Date;
  entries: Entrie[];
  sessionKey: number;
};

export type RawTimingDataObject = {
  [key: string]: {
    Position?: string;
    Retired?: boolean;
    InPit?: boolean;
    PitOut?: boolean;
    Stopped?: boolean;
    GapToLeader?: string;
    IntervalToPositionAhead?: {
      Value: number;
      Catching: boolean;
    };
    RacingNumber?: string;
    Status?: number;
    NumberOfLaps?: number;
    Sectors: object[];
  };
};

export type RawTireStintObject = {
  [key: string]: {
    [key: string]: {
      Compound?: string;
      New?: string;
      TyresNotChanged: string;
      TotalLaps: number;
      StartLaps: number;
    };
  };
};

export type Tirestints = {
  timestamp: Date;
  sessionKey: number;
  lines: {
    driverNumber: number;
    compound?: string;
    age?: number;
    pitStops?: number;
  }[];
};

export type DriverObject = {
  driverNumber: number;
  Position?: string;
  Retired?: boolean;
  InPit?: boolean;
  PitOut?: boolean;
  Stopped?: boolean;
  GapToLeader?: string;
  IntervalToPositionAhead?: {
    Value: number;
    Catching: boolean;
  };
  RacingNumber?: string;
  Status?: number;
  NumberOfLaps?: number;
  Sectors?: object[];
};

export type DriverClean = {
  driverNumber: number;
  position?: number;
  retired?: boolean;
  inPit?: boolean;
  pitOut?: boolean;
  stopped?: boolean;
};

export type TimingData = {
  timestamp: Date;
  sessionKey: number;
  lines: DriverClean[];
};

export type SessionData = {
  Series: Series[];
  StatusSeries: StatusSery[];
};

export type Series = {
  Utc: Date;
  Lap?: number;
  QualifyingPart?: number;
};

export type StatusSery = {
  Utc: Date;
  TrackStatus?: string;
  SessionStatus?: string;
};

// schedule types
export type ScheduleApi = {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: Date;
  time: string;
  FirstPractice: FirstPractice;
  SecondPractice: FirstPractice;
  ThirdPractice: FirstPractice;
  Qualifying: FirstPractice;
};

export type Circuit = {
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
