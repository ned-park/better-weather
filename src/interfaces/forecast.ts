interface Hourly {
  time: Array<string>;
  temperature_2m: Array<number>;
  precipitation_probability: Array<number>;
  precipitation: Array<number>;
  weathercode: Array<number>;
  relativehumidity_2m: Array<number>;
  windspeed_10m: Array<number>;
}

interface HourlyUnits {
  "time": string;
  "temperature_2m": string;
  "relativehumidity_2m": string;
  "precipitation_probability": string;
  "precipitation": string;
  "weathercode": string;
  "windspeed_10m": string;
}

export interface ForecastData {
  labels?: Array<string>;
  data?: Array<number>;
  backgroundColor?: string;
  borderColor?: string;
  datasets: Array<number>;
}

export interface Forecast {
  elevation: number;
  generationtime_ms: number;
  hourly: Hourly;
  hourly_units: HourlyUnits;
  temperature_2m?: string;
  time?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}