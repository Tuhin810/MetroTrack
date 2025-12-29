
export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  line: 'Blue' | 'Green' | 'Purple' | 'Yellow' | 'Orange';
  isInterchange?: boolean;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

export interface LiveTrain {
  id: string;
  line: string;
  direction: 'UP' | 'DOWN';
  lat: number;
  lng: number;
  nextStation: string;
}

export type View = 'map' | 'search' | 'timings' | 'tickets';
