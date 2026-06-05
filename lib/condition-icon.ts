// Maps a WMO condition label (e.g. "Light drizzle", "Mainly clear") to a big,
// instantly-readable emoji and a plain word a farmer recognises at a glance.

export function conditionEmoji(label: string): string {
  const c = label.toLowerCase();
  if (/thunder|storm/.test(c)) return "⛈️";
  if (/drizzle|rain|shower/.test(c)) return "🌧️";
  if (/snow|sleet/.test(c)) return "🌨️";
  if (/fog|mist|rime/.test(c)) return "🌫️";
  if (/overcast/.test(c)) return "☁️";
  if (/partly/.test(c)) return "⛅";
  if (/cloud/.test(c)) return "🌤️";
  if (/clear|sunny/.test(c)) return "☀️";
  return "🌡️";
}

// A short, plain-language take on the sky for non-technical readers.
export function conditionPlain(label: string): string {
  const c = label.toLowerCase();
  if (/thunder|storm/.test(c)) return "Stormy";
  if (/heavy rain|heavy drizzle|violent/.test(c)) return "Heavy rain";
  if (/drizzle|rain|shower/.test(c)) return "Rainy";
  if (/snow|sleet/.test(c)) return "Snowy";
  if (/fog|mist|rime/.test(c)) return "Foggy";
  if (/overcast/.test(c)) return "Grey skies";
  if (/partly/.test(c)) return "Some sun";
  if (/cloud/.test(c)) return "Cloudy";
  if (/clear|sunny/.test(c)) return "Sunny";
  return label;
}
