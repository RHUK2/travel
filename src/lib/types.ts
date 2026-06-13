export type Category =
  | "move"
  | "sight"
  | "sight2"
  | "food"
  | "hot"
  | "sleep"
  | "shop"
  | "etc";

export interface TripItem {
  id: string;
  category: Category;
  name: string;
  desc: string;
  badge?: string;
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
  day: number;
  title: string;
  subtitle: string;
  color: string;
  items: TripItem[];
  mapSpots: MapSpot[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  note?: string;
}

export interface ChecklistGroup {
  section: "국내" | "해외";
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
  item_id: string;
  is_done: boolean;
  memo: string;
  value: string;
  updated_at: string;
}

export interface PersonalState {
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

export interface TravelTip {
  title: string;
  body: string;
}

export interface Session {
  id: string;
  name: string;
  token: string;
  photo_url: string;
  message: string;
}
