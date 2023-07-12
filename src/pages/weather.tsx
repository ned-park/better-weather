import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Layout from "~/components/layout/Layout";


const LAT = process.env.NEXT_PUBLIC_TEST_LAT || "";
const LONG = process.env.NEXT_PUBLIC_TEST_LONG || "";

interface Hourly {
  time: Array<string>;
  temperature_2m: Array<number>;
  precipitation_probability: Array<number>;
  precipitation: Array<number>;
  weathercode: Array<number>;
  dewpoint_2m: Array<number>;
  windspeed_10m: Array<number>;
}

interface HourlyUnits {
  "time": string;
  "temperature_2m": string;
  "dewpoint_2m": string;
  "precipitation_probability": string;
  "precipitation": string;
  "weathercode": string;
  "windspeed_10m": string;
}

interface ForecastData {
  labels?: Array<string>;
  data?: Array<number>;
  backgroundColor?: string;
  borderColor?: string;
  datasets: Array<number>;
}

interface Forecast {
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

interface LatLong {
  latitude: string;
  longitude: string;
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,

    },
    title: {
      display: true,
      text: "Hourly temperatures",
    },
  },
}

export const forecastData: ForecastData = {
  backgroundColor: "rgba(255,99,132, 0.5)",
  borderColor: "rgb(255,99,132)",
  datasets: [],
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const humanReadable = new Map<string, string>();
humanReadable.set("time", "Time");
humanReadable.set("temperature_2m", "Temperature");
humanReadable.set("dewpoint_2m", "DewPoint");
humanReadable.set("precipitation_probability", "PoP");
humanReadable.set("precipitation", "Precipitation");
humanReadable.set("weathercode", "Weather code");
humanReadable.set("windspeed_10m", "Windspeed");

function Weather() {
  const [location, setLocation] = useState('');
  const [latLong, setLatLong] = useState<LatLong/* | undefined*/>({ latitude: LAT, longitude: LONG });
  const [forecast, setForecast] = useState<Forecast>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [day, setDay] = useState(0);

  useEffect(() => {
    // fetch to backend to check if location has coordinates in DB
    // if not send request to position API
    // save response to avoid more queries
    // 

    const getLatLong = async () => {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LONG}&hourly=temperature_2m&timezone=auto&`);
      if (res.ok) {
        const data: LatLong = await res.json() as LatLong;
        if (!data) return;
        setLatLong(data);
      }
    }

    const getForecastData = async () => {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latLong.latitude}&longitude=${latLong.longitude}&timezone=auto&hourly=temperature_2m,dewpoint_2m,precipitation_probability,precipitation,weathercode,windspeed_10m`)
      // const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latLong.latitude}&longitude=${latLong.longitude}&hourly=temperature_2m&timezone=auto&`);
      if (res.ok) {
        const data: Forecast = await res.json() as Forecast;
        if (!data) return;
        setForecast(data);
        setIsLoaded(true);
      }
    }

    const getForecast = async () => {
      // void await getLatLong();
      void await getForecastData();
    }

    void getForecast();
  }, [latLong]);

  const getTableData = () => {
    if (!forecast) return;
    const dayData = new Array(25);
    for (let i = 0; i < dayData.length; i++)
    dayData[0] = (Object.keys(forecast.hourly));
    if (!Array.isArray(dayData[0])) throw new Error("Your array is not an array")
    dayData[0] = dayData[0].map((heading: string) => (humanReadable.has(heading)? humanReadable.get(heading) : heading) as string);
    for (let i = 0; i < 24; i++) {
      const hour: Array<number | string | undefined> = [];
      Object.entries(forecast.hourly)
        .forEach(([_, value]) => {
          if (!Array.isArray(value) || value[24 * day + i] === undefined) throw new Error("Your array isn't what you think");
          hour.push(value[24 * day + i] as number)
        });
      dayData.push(hour);
    }

    return dayData as Array<number[] | string[]>;
  }

  const tableData = getTableData();
  return (
    <Layout>
      <input
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      />
      {isLoaded && forecast && (
        <>
          <table width="100%">
            {tableData?.map((row, i) => {
              if (i === 0) {
                return <tr key={i}>{row.map((heading,j) => <th key={`${i}:${j}`}>{heading}</th>)}</tr>
              }
              return <tr key={i}>{row.map((value,j) => <td key={`${i}:${j}`}>{value}</td>)}</tr>
            })
            }
          </table>

          <ul className="text-black">
            {Object.entries(forecast).map(([key, value], i) => typeof value == 'object' ? <li key={i}>{key}: Object</li> : <li key={i}>{key}: {value}</li>)}
          </ul>
          <label htmlFor="day">Select date:
            <select
              name="day"
              id="day"
              value={day}
              onChange={e => setDay(Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </label>
          <Line
            options={options}
            data={{
              labels: forecast.hourly.time.slice(24 * day, 24 * (day + 1)),
              datasets: [{
                fill: true,
                label: 'Hourly Temperature °C',
                data: forecast.hourly.temperature_2m.slice(24 * day, 24 * (day + 1)).map(Number),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              }],
            }}
            className="p-16"
          />
          <Line
            options={{
              ...options,
              scales: {
                y: {
                  min: 0,
                  max: 100,
                }
              }
            }}
            data={{
              labels: forecast.hourly.time.slice(24 * day, 24 * (day + 1)),
              datasets: [{
                fill: true,
                label: 'Hourly Percent of Precipitation',
                data: forecast.hourly.precipitation_probability.slice(24 * day, 24 * (day + 1)).map(Number),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              }],
            }}
            className="p-16"
          />

        </>
      )}


    </Layout>
  )
}

export default Weather;