
import { Station, MetroLine } from '../types';

/**
 * MetroAPI handles fetching of real-time metro data.
 */
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

export class MetroAPI {
    /**
     * Fetches all metro stations for the given network from OpenStreetMap.
     * This ensures coordinates and names are always current.
     */
    static async fetchStations(): Promise<Station[]> {
        const query = `
            [out:json][timeout:25];
            area["name"="Kolkata"]->.searchArea;
            (
                node["railway"="station"]["station"="subway"](area.searchArea);
                node["railway"="station"]["operator"~"Kolkata Metro",i](area.searchArea);
            );
            out body;
        `;

        try {
            const response = await fetch(OVERPASS_BASE_URL, {
                method: 'POST',
                body: `data=${encodeURIComponent(query)}`
            });

            if (!response.ok) throw new Error('Failed to fetch from Overpass API');

            const data = await response.json();
            
            return data.elements.map((el: any) => ({
                id: el.id.toString(),
                name: el.tags.name || el.tags['name:en'],
                lat: el.lat,
                lng: el.lon,
                line: this.guessLine(el.tags),
                isInterchange: el.tags.interchange === 'yes' || !!el.tags.connection
            }));
        } catch (error) {
            console.error('Error fetching stations:', error);
            return []; // Fallback to static data in metroData.ts
        }
    }

    private static guessLine(tags: any): string {
        const name = tags.name?.toLowerCase() || '';
        if (tags.line === 'Blue' || tags.colour === 'Blue') return 'Blue';
        if (tags.line === 'Green' || tags.colour === 'Green') return 'Green';
        return 'Blue';
    }

    /**
     * REAL-TIME API INTEGRATION
     * Connect your real-time provider here (e.g., IndianRailAPI, RapidAPI)
     */
    static async getLiveTrainPositions() {
        // Placeholder for real API call:
        // const response = await fetch('https://api.indianrailapi.com/v2/live-metro/kolkata?apikey=YOUR_KEY');
        // return response.json();
        
        return null; // Return null to fallback to the smart-schedule engine in tracker.ts
    }
}
