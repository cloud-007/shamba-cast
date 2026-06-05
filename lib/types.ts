export type Units = "metric" | "imperial";

export interface Current {
  temp: number;
  humidity?: number;
  condition: string;
  windKph?: number;     // optional — may be absent on free tier
  precipMm?: number;    // optional
}

export interface DayForecast {
  date: string;         // ISO yyyy-mm-dd
  high: number;
  low: number;
  condition: string;
  precipMm?: number;
}

export interface HourForecast {
  time: string;         // ISO
  temp: number;
  condition: string;
}

export interface Forecast {
  location: string;
  lat: number;
  lon: number;
  units: Units;
  current: Current;
  daily: DayForecast[];
  hourly: HourForecast[];
  summary?: string;
}

export interface GddDay { date: string; gdd: number; accumulated: number; }
export interface GddSeries { base: number; units: Units; days: GddDay[]; total: number; }

export type AdvisoryStatus = "good" | "caution" | "avoid" | "info";
export interface AdvisoryItem {
  kind: "plant" | "spray" | "harvest" | "frost" | "rain";
  status: AdvisoryStatus;
  title: string;
  dayRange?: string;
  reason: string;       // the "why", tied to the forecast
}
export interface AdvisoryReport { items: AdvisoryItem[]; }

export interface NormalizedResponse {
  forecast: Forecast;
  gdd: GddSeries;
  advisory: AdvisoryReport;
}
