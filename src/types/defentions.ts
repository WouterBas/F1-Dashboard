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
    minX?: number;
    minY?: number;
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
