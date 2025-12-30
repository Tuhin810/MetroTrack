
import { MetroLine, Station } from '../types';

/**
 * Kolkata Metro Official Data (Updated 2024/2025)
 * Sources: Metro Railway Kolkata Official Site, KMRCL, OpenStreetMap
 */

export const BLUE_LINE_STATIONS: Station[] = [
  { id: 'dak', name: 'Dakshineswar', lat: 22.6548, lng: 88.3582, line: 'Blue' },
  { id: 'bar', name: 'Baranagar', lat: 22.6457, lng: 88.3653, line: 'Blue' },
  { id: 'noa', name: 'Noapara', lat: 22.6391, lng: 88.3904, line: 'Blue', isInterchange: true },
  { id: 'dum', name: 'Dum Dum', lat: 22.6225, lng: 88.3785, line: 'Blue' },
  { id: 'bel', name: 'Belgachia', lat: 22.6053, lng: 88.3813, line: 'Blue' },
  { id: 'shyam', name: 'Shyambazar', lat: 22.6009, lng: 88.3713, line: 'Blue' },
  { id: 'shova', name: 'Shovabazar Sutanuti', lat: 22.5956, lng: 88.3643, line: 'Blue' },
  { id: 'gir', name: 'Girish Park', lat: 22.5866, lng: 88.3601, line: 'Blue' },
  { id: 'mg', name: 'Mahatma Gandhi Road', lat: 22.5815, lng: 88.3601, line: 'Blue' },
  { id: 'cen', name: 'Central', lat: 22.5684, lng: 88.3601, line: 'Blue' },
  { id: 'cha', name: 'Chandni Chowk', lat: 22.5653, lng: 88.3563, line: 'Blue' },
  { id: 'esp', name: 'Esplanade', lat: 22.5645, lng: 88.3506, line: 'Blue', isInterchange: true },
  { id: 'par', name: 'Park Street', lat: 22.5539, lng: 88.3501, line: 'Blue' },
  { id: 'mai', name: 'Maidan', lat: 22.5459, lng: 88.3496, line: 'Blue' },
  { id: 'rab_s', name: 'Rabindra Sadan', lat: 22.5386, lng: 88.3486, line: 'Blue' },
  { id: 'net_b', name: 'Netaji Bhavan', lat: 22.5323, lng: 88.3475, line: 'Blue' },
  { id: 'jat', name: 'Jatin Das Park', lat: 22.5222, lng: 88.3475, line: 'Blue' },
  { id: 'kal', name: 'Kalighat', lat: 22.5186, lng: 88.3470, line: 'Blue' },
  { id: 'rab_sa', name: 'Rabindra Sarobar', lat: 22.5056, lng: 88.3456, line: 'Blue' },
  { id: 'mukh', name: 'Mahanayak Uttam Kumar', lat: 22.4947, lng: 88.3463, line: 'Blue' },
  { id: 'net_s', name: 'Netaji', lat: 22.4842, lng: 88.3463, line: 'Blue' },
  { id: 'mas', name: 'Masterda Surya Sen', lat: 22.4745, lng: 88.3603, line: 'Blue' },
  { id: 'git', name: 'Gitanjali', lat: 22.4645, lng: 88.3743, line: 'Blue' },
  { id: 'knaz', name: 'Kavi Nazrul', lat: 22.4545, lng: 88.3883, line: 'Blue' },
  { id: 'shuk', name: 'Shahid Khudiram', lat: 22.4445, lng: 88.3983, line: 'Blue' },
  { id: 'ksub', name: 'Kavi Subhash', lat: 22.4345, lng: 88.4083, line: 'Blue', isInterchange: true },
];

export const GREEN_LINE_STATIONS: Station[] = [
  { id: 'hm', name: 'Howrah Maidan', lat: 22.5855, lng: 88.3243, line: 'Green' },
  { id: 'hw', name: 'Howrah Station', lat: 22.5823, lng: 88.3421, line: 'Green' },
  { id: 'mk', name: 'Mahakaran', lat: 22.5745, lng: 88.3486, line: 'Green' },
  { id: 'esp_g', name: 'Esplanade', lat: 22.5645, lng: 88.3506, line: 'Green', isInterchange: true },
  { id: 'sea', name: 'Sealdah', lat: 22.5671, lng: 88.3712, line: 'Green' },
  { id: 'phoo', name: 'Phoolbagan', lat: 22.5735, lng: 88.3905, line: 'Green' },
  { id: 'sls', name: 'Salt Lake Stadium', lat: 22.5755, lng: 88.4021, line: 'Green' },
  { id: 'bc', name: 'Bengal Chemical', lat: 22.5835, lng: 88.4098, line: 'Green' },
  { id: 'cc', name: 'City Centre', lat: 22.5875, lng: 88.4143, line: 'Green' },
  { id: 'cp', name: 'Central Park', lat: 22.5895, lng: 88.4201, line: 'Green' },
  { id: 'kar', name: 'Karunamoyee', lat: 22.5855, lng: 88.4285, line: 'Green' },
  { id: 'slsv', name: 'Salt Lake Sector V', lat: 22.5785, lng: 88.4356, line: 'Green', isInterchange: true },
];

export const PURPLE_LINE_STATIONS: Station[] = [
  { id: 'joka', name: 'Joka', lat: 22.4372, lng: 88.3042, line: 'Purple' },
  { id: 'thak', name: 'Thakurpukur', lat: 22.4505, lng: 88.3072, line: 'Purple' },
  { id: 'sakh', name: 'Sakherbazar', lat: 22.4665, lng: 88.3115, line: 'Purple' },
  { id: 'bc_p', name: 'Behala Chowrasta', lat: 22.4825, lng: 88.3168, line: 'Purple' },
  { id: 'bb_p', name: 'Behala Bazar', lat: 22.4925, lng: 88.3212, line: 'Purple' },
  { id: 'tar', name: 'Taratala', lat: 22.5028, lng: 88.3242, line: 'Purple' },
  { id: 'maj', name: 'Majerhat', lat: 22.5185, lng: 88.3248, line: 'Purple' },
];

export const ORANGE_LINE_STATIONS: Station[] = [
  { id: 'ksub_o', name: 'Kavi Subhash', lat: 22.4345, lng: 88.4083, line: 'Orange', isInterchange: true },
  { id: 'sray', name: 'Satyajit Ray', lat: 22.4545, lng: 88.4115, line: 'Orange' },
  { id: 'jnandi', name: 'Jyotirindra Nandi', lat: 22.4785, lng: 88.4152, line: 'Orange' },
  { id: 'ksuk', name: 'Kavi Sukanta', lat: 22.4925, lng: 88.4182, line: 'Orange' },
  { id: 'hmukh', name: 'Hemanta Mukhopadhyay', lat: 22.5125, lng: 88.4215, line: 'Orange' },
];

export const YELLOW_LINE_STATIONS: Station[] = [
  { id: 'noa_y', name: 'Noapara', lat: 22.6391, lng: 88.3904, line: 'Yellow', isInterchange: true },
  { id: 'ddc', name: 'Dum Dum Cantonment', lat: 22.6455, lng: 88.4105, line: 'Yellow' },
];

export const METRO_LINES: MetroLine[] = [
  { id: 'blue', name: 'Blue Line', color: '#0066b3', stations: BLUE_LINE_STATIONS },
  { id: 'green', name: 'Green Line', color: '#00a651', stations: GREEN_LINE_STATIONS },
  { id: 'purple', name: 'Purple Line', color: '#8e2f8e', stations: PURPLE_LINE_STATIONS },
  { id: 'yellow', name: 'Yellow Line', color: '#fdb913', stations: YELLOW_LINE_STATIONS },
  { id: 'orange', name: 'Orange Line', color: '#f37021', stations: ORANGE_LINE_STATIONS },
];

export const ALL_STATIONS = [
  ...BLUE_LINE_STATIONS,
  ...GREEN_LINE_STATIONS,
  ...PURPLE_LINE_STATIONS,
  ...YELLOW_LINE_STATIONS,
  ...ORANGE_LINE_STATIONS,
];

export const LINE_COLORS: Record<string, string> = {
  Blue: '#0066b3',
  Green: '#00a651',
  Purple: '#8e2f8e',
  Yellow: '#fdb913',
  Orange: '#f37021',
};
