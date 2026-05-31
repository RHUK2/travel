export type Category = "move" | "sight" | "sight2" | "food" | "hot" | "sleep";

export interface TripItem {
  id: string;
  time: string;
  category: Category;
  name: string;
  desc: string;
  tip?: string;
  mapLink?: string;
}

export interface MapSpot {
  lat: number;
  lng: number;
  emoji: string;
  name: string;
  desc: string;
}

export interface DayData {
  day: 1 | 2 | 3;
  title: string;
  subtitle: string;
  color: string;
  items: TripItem[];
  mapSpots: MapSpot[];
}

export interface WeatherDay {
  label: string;
  icon: string;
  temp: string;
  feelsLike: string;
  rain: string;
  uv: number;
  wind: number;
  sunrise: string;
  sunset: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  note?: string;
}

export interface ChecklistGroup {
  label: string;
  items: ChecklistItem[];
}

export interface ExpenseRow {
  id: string;
  label: string;
  estimate: string;
  jpyRange?: [number, number];
  subRows?: { label: string }[];
  isTotal?: boolean;
}

export interface ItemState {
  trip_id: string;
  item_id: string;
  is_done: boolean;
  memo: string;
  value: string;
  updated_at: string;
}

export interface PersonalState {
  trip_id: string;
  item_id: string;
  user_id: string;
  is_done: boolean;
  memo: string;
  value: string;
  updated_at: string;
}

export interface AirportStep {
  num: number;
  tag: string;
  title: string;
  body: string;
  tip?: string;
}

export interface AirportBlock {
  title: string;
  steps: AirportStep[];
}

export interface Session {
  id: string;
  name: string;
  token: string;
  photo_url: string;
  message: string;
}
