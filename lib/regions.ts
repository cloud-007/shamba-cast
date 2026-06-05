export interface Region { id: string; name: string; lat: number; lon: number; note?: string; }

export const REGIONS: Region[] = [
  { id: "bomet",   name: "Bomet",   lat: -0.7833, lon: 35.3417, note: "Tea & maize" },
  { id: "nakuru",  name: "Nakuru",  lat: -0.3031, lon: 36.0800, note: "Mixed farming" },
  { id: "eldoret", name: "Eldoret", lat:  0.5143, lon: 35.2698, note: "Maize basket" },
  { id: "kisumu",  name: "Kisumu",  lat: -0.0917, lon: 34.7680, note: "Lakeside" },
  { id: "nairobi", name: "Nairobi", lat: -1.2921, lon: 36.8219, note: "Capital" },
];

export const DEFAULT_REGION = REGIONS[0];
