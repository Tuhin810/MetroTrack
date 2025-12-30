
import { Station, LiveTrain } from '../types';
import { METRO_LINES, ALL_STATIONS, LINE_COLORS } from '../data/metroData';

const interpolate = (s1: Station, s2: Station, ratio: number) => {
  return {
    lat: s1.lat + (s2.lat - s1.lat) * ratio,
    lng: s1.lng + (s2.lng - s1.lng) * ratio,
  };
};

export const getLiveTrains = (): LiveTrain[] => {
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  
  // Kolkata Metro typical operational hours: 6:50 AM to 9:40 PM (approx 410 to 1300 mins)
  if (minutesSinceMidnight < 410 || minutesSinceMidnight > 1305) return [];

  const trains: LiveTrain[] = [];
  const isPeak = (now.getHours() >= 9 && now.getHours() <= 11) || (now.getHours() >= 17 && now.getHours() <= 19);
  const frequency = isPeak ? 6 : 10; // Optimized frequency
  
  METRO_LINES.forEach(line => {
    const stations = line.stations;
    // Standardize to 2.8 mins per station for realistic suburban/metro speeds
    const duration = (stations.length - 1) * 2.8; 
    const numTrains = Math.ceil(duration / frequency);

    for (let i = 0; i < numTrains; i++) {
        // UP Direction
        let timeOffset = (minutesSinceMidnight - (i * frequency)) % duration;
        if (timeOffset >= 0) {
            const progress = timeOffset / duration;
            const sIdx = Math.floor(progress * (stations.length - 1));
            const pos = interpolate(stations[sIdx], stations[sIdx + 1], (progress * (stations.length - 1)) % 1);
            trains.push({
                id: `${line.id}-up-${i}`,
                line: stations[0].line,
                direction: 'UP',
                ...pos,
                nextStation: stations[sIdx + 1].name
            });
        }

        // DOWN Direction (Reverse)
        const reverseStations = [...stations].reverse();
        timeOffset = (minutesSinceMidnight - (i * frequency + frequency / 2)) % duration;
        if (timeOffset >= 0) {
            const progress = timeOffset / duration;
            const sIdx = Math.floor(progress * (reverseStations.length - 1));
            const pos = interpolate(reverseStations[sIdx], reverseStations[sIdx + 1], (progress * (reverseStations.length - 1)) % 1);
            trains.push({
                id: `${line.id}-down-${i}`,
                line: stations[0].line,
                direction: 'DOWN',
                ...pos,
                nextStation: reverseStations[sIdx + 1].name
            });
        }
    }
  });

  return trains;
};

export const calculateFare = (distInKm: number, line?: string) => {
  // Official Green Line Slabs (Refined to match Sector V -> Esplanade = 30)
  if (line === 'Green' || line === 'Orange' || line === 'Purple' || line === 'Yellow') {
    if (distInKm <= 2) return 5;
    if (distInKm <= 5) return 10;
    if (distInKm <= 8) return 20;
    return 30; // 8km+ is 30 for these lines based on actual user feedback
  }

  // Classic Blue Line slabs
  if (distInKm <= 2) return 5;
  if (distInKm <= 5) return 10;
  if (distInKm <= 10) return 15;
  if (distInKm <= 15) return 20;
  if (distInKm <= 20) return 25;
  return 30;
};

export const getDistance = (s1: {lat: number, lng: number}, s2: {lat: number, lng: number}) => {
  const R = 6371;
  const dLat = (s2.lat - s1.lat) * Math.PI / 180;
  const dLon = (s2.lng - s1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(s1.lat * Math.PI / 180) * Math.cos(s2.lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findNearestStation = (lat: number, lng: number): { station: Station, distance: number } => {
  let nearest = ALL_STATIONS[0];
  let minDistance = Infinity;

  ALL_STATIONS.forEach(station => {
    const dist = getDistance({ lat, lng }, station);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = station;
    }
  });

  return { station: nearest, distance: minDistance };
};

/**
 * Fetches real road coordinates from OSRM API
 */
export const fetchRoute = async (start: {lat: number, lng: number}, end: {lat: number, lng: number}, mode: 'walking' | 'driving'): Promise<[number, number][]> => {
  const profile = mode === 'walking' ? 'foot' : 'car';
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    }
  } catch (error) {
    console.error("Routing error:", error);
  }
  // Fallback to straight line if API fails
  return [[start.lat, start.lng], [end.lat, end.lng]];
};

export interface JourneyLeg {
  line: string;
  color: string;
  stations: Station[];
  direction: string;
  distance: number;
  fare: number;
}

export const getDetailedRoute = (from: Station, to: Station): JourneyLeg[] => {
  const adj: Record<string, string[]> = {};
  METRO_LINES.forEach(line => {
    for (let i = 0; i < line.stations.length; i++) {
      const s = line.stations[i];
      if (!adj[s.id]) adj[s.id] = [];
      if (i > 0) adj[s.id].push(line.stations[i-1].id);
      if (i < line.stations.length - 1) adj[s.id].push(line.stations[i+1].id);
      ALL_STATIONS.filter(other => other.name === s.name && other.id !== s.id).forEach(other => {
        adj[s.id].push(other.id);
      });
    }
  });

  const queue: string[] = [from.id];
  const visited: Record<string, string | null> = { [from.id]: null };
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === to.id) break;
    for (const neighbor of adj[curr] || []) {
      if (!(neighbor in visited)) {
        visited[neighbor] = curr;
        queue.push(neighbor);
      }
    }
  }

  if (!(to.id in visited)) return [];
  const fullPathIds: string[] = [];
  let temp: string | null = to.id;
  while (temp !== null) {
    fullPathIds.push(temp);
    temp = visited[temp];
  }
  fullPathIds.reverse();
  const fullPathStations = fullPathIds.map(id => ALL_STATIONS.find(s => s.id === id)!);

  const legs: JourneyLeg[] = [];
  let currentLegStations: Station[] = [fullPathStations[0]];
  for (let i = 1; i < fullPathStations.length; i++) {
    const prev = fullPathStations[i-1];
    const curr = fullPathStations[i];
    if (prev.name === curr.name && prev.id !== curr.id) {
      if (currentLegStations.length > 1) legs.push(createLeg(currentLegStations));
      currentLegStations = [curr];
    } else {
      currentLegStations.push(curr);
    }
  }
  if (currentLegStations.length > 1) legs.push(createLeg(currentLegStations));
  return legs;
};

function createLeg(stations: Station[]): JourneyLeg {
  let dist = 0;
  for (let i = 0; i < stations.length - 1; i++) {
    // Add 1.15x factor for track curvature and alignment (Official Rail Distance)
    dist += getDistance(stations[i], stations[i+1]) * 1.15;
  }
  const line = stations[0].line;
  return {
    line,
    color: LINE_COLORS[line] || '#64748b',
    stations,
    direction: stations[stations.length - 1].name,
    distance: dist,
    fare: calculateFare(dist, line)
  };
}
