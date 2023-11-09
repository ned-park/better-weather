import type { Place } from "./place";

export interface Location {
  results: (Place)[];
  generationtime_ms: number;
}
