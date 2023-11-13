import type { Forecast } from "~/interfaces/forecast";

export default function DailyHighLow(
  { forecast,
    setDay
  }: {
    forecast: Forecast,
    setDay: React.Dispatch<React.SetStateAction<number>>,
  }
) {

  const maxTemps: number[] = [];
  const minTemps: number[] = [];
  const days: string[] = [];
  const precipitation: string[] = [];

  for (let day = 0; day < forecast.hourly.time.length / 24; day++) {
    maxTemps.push(Math.max(...forecast.hourly.temperature_2m.slice(24 * day, 24 * (day + 1))));
    minTemps.push(Math.min(...forecast.hourly.temperature_2m.slice(24 * day, 24 * (day + 1))));
    precipitation.push(forecast.hourly.precipitation.slice(24 * day, 24 * (day + 1)).reduce((sum, mm) => sum + mm, 0).toFixed(1));

    if (forecast && forecast.hourly && forecast.hourly.time && 24 * day <= forecast.hourly.time.length && forecast.hourly.time[24 * day]) {
      const forecastDate = new Date(`${forecast.hourly.time[24 * day] ?? ""}`).toString()
      const dayOfWeek = forecastDate.split(' ')[0];
      if (!dayOfWeek) throw new Error("Invalid forecast data");
      days.push(dayOfWeek);
    }
  }

  return (
    <ol className="flex flex-wrap justify-center w-full text-xs md:text-sm gap-1: md:gap-4 pb-5 font-mono">
      {maxTemps.map((max, i: number) => <li key={days[i]}>
        <ul className="cursor-pointer border-grey border-2 py-2 px-4 rounded" onClick={() => void setDay(i)}>
          <li className="w-full text-center font-bold">{days[i]}</li>
          <li>L:{minTemps[i]?.toFixed(1)}{forecast.hourly_units.temperature_2m}</li>
          <li>H:{maxTemps[i]?.toFixed(1)}{forecast.hourly_units.temperature_2m}</li>
          <li>P:{precipitation[i]}{forecast.hourly_units.precipitation}</li>
        </ul>
      </li>)}
    </ol>
  )
}