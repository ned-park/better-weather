import type { Forecast } from "~/interfaces/forecast";

export default function DailyHighLow(
  { forecast }:
    { forecast: Forecast}
  ) {

  const maxTemps = [];
  const minTemps:number[] = [];
  const days: (string|undefined)[] = [];

  for (let day = 0; day < 7; day++) {
    maxTemps.push(Math.max(...forecast.hourly.temperature_2m.slice(24 * day, 24 * (day + 1))));
    minTemps.push(Math.min(...forecast.hourly.temperature_2m.slice(24 * day, 24 * (day + 1))));
    if (!forecast || !forecast.hourly || !forecast.hourly.time || !forecast.hourly.time[24 * day]) throw new Error("Unexpected date value");
    days.push(new Date(forecast.hourly.time[24 * day]!).toString().split(' ')[0]);
  }

  console.log(maxTemps);

  return (
    <ol>
      {maxTemps.map((max, i)=> <li key={days[i]}>{max}, {minTemps[i]}, {days[i]}</li>)}
    </ol>
  )
}