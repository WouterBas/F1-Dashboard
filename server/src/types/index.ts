import { ObjectId } from "mongodb";

export type circuitPoints = {
  x: number;
  y: number;
};

// export type Position = {
//   _id: string;
//   timestamp: Date;
//   entries: { [key: string]: Entry };
//   sessionKey: number;
// };

export type Entry = {
  Status: string;
  X: number;
  Y: number;
  Z: number;
};

export type PatchCircuit = {
  circuitPoints: circuitPoints[];
  selectedDriver: number;
  startTime: Date;
  duration: number;
};

export type Session = {
  [Practice_1: string]:
    | string
    | [Practice_2: string]
    | [Practice_3: string]
    | [Sprint_Shootout: string]
    | [Sprint: string]
    | [Qualifying: string]
    | [Sprint_Qualifying: string]
    | [Race: string];
};

export type Schedule = {
  _id: ObjectId;
  name: string;
  year: string;
  date: Date;
  sessions: Session[];
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
  ArchiveStatus: string;
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
  gmtOffset: string;
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
  [key: string]: {
    X: number;
    Y: number;
  };
};

export type F1Position = {
  [key: string]: any;
  Timestamp: string;
  Entries: F1Entries;
};

export type Position = {
  timestamp: string;
  entries: Entrie;
  sessionKey: number;
};
