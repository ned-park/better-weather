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
import * as uniqId from 'uniqid';
import Layout from "~/components/layout/Layout";
import WeatherTable from "~/components/WeatherTable";


const LAT = process.env.NEXT_PUBLIC_TEST_LAT || "";
const LONG = process.env.NEXT_PUBLIC_TEST_LONG || "";

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
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,

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

const weatherIcons = new Map<number, string>();
weatherIcons.set(0, "☀️");
weatherIcons.set(1, "🌤️");
weatherIcons.set(2, "🌥️");
weatherIcons.set(3, "☁️");
weatherIcons.set(45, "🌫️");
weatherIcons.set(48, "❄️");
weatherIcons.set(51, "☁️🌧️☁️");
weatherIcons.set(53, "🌧️☁️");
weatherIcons.set(55, "🌧️");
weatherIcons.set(56, "❄️");
weatherIcons.set(57, "❄️❄️");
weatherIcons.set(61, "☁️🌧️☁️");
weatherIcons.set(63, "🌧️☁️");
weatherIcons.set(65, "🌧️");
weatherIcons.set(66, "❄️🌧️");
weatherIcons.set(67, "🌧️❄️🌧️");
weatherIcons.set(71, "🌨️");
weatherIcons.set(73, "🌨️🌨️");
weatherIcons.set(75, "🌨️🌨️🌨️");
weatherIcons.set(77, "❄️");
weatherIcons.set(80, "🌧️");
weatherIcons.set(81, "🌧️🌧️");
weatherIcons.set(82, "🌧️🌧️🌧️");
weatherIcons.set(85, "🌨️");
weatherIcons.set(86, "🌨️🌨️");
weatherIcons.set(95, "⛈️");
weatherIcons.set(96, "⛈️");
weatherIcons.set(99, "⛈️");


function Weather() {
  const [location, setLocation] = useState('location');
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
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latLong.latitude}&longitude=${latLong.longitude}&timezone=auto&hourly=weathercode,temperature_2m,relativehumidity_2m,precipitation_probability,precipitation,windspeed_10m`)
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
    if (!forecast) return [[0]];
    const dayData = new Array(24);
    for (let i = 0; i < 24; i++) {
      const hour: Array<number | string | undefined> = [];
      Object.entries(forecast.hourly)
        .forEach(([key, value]) => {
          if (!Array.isArray(value) || value[24 * day + i] === undefined) throw new Error("Your array isn't what you think");
          hour.push(key === "weathercode" && weatherIcons.has(Number(value[24 * day + i])) ? weatherIcons.get(Number(value[24 * day + i])) : value[24 * day + i] as number | string)
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
          <div className="pb-4">
            <label htmlFor="day">Select date:
              <select
                name="day"
                id="day"
                value={day}
                onChange={e => setDay(Number(e.target.value))}
                className="ml-4 p-2 rounded"
              >
                {new Array(7).fill(0).map((_, i) => <option key={uniqId.default()} value={i}>{String(forecast.hourly.time[24 * i]).split("T")[0]}</option>)}
              </select>
            </label>
          </div>


          <section className="w-full grid md:grid-cols-2 gap-4">
            <section className="border-2 border-black">
              <WeatherTable
                tableData={tableData}
                tableHeaders={Object.keys(forecast.hourly)}
                tableUnits={Object.values(forecast.hourly_units)}
                location={location}
              />
            </section>
            <section className="grid grid-cols-2 grid-rows-2 border-2 border-red">
              <section>
              <Line
                options={{
                  ...options, 
                  plugins: {
                    ...options.plugins,
                    title: {
                      display: true,
                      text: "Temperature °C",
                    },
                  },
                }}
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
              />
              </section>
              <section>
              <Line
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    title: {
                      display: true,
                      text: "Precipitation Probability",
                    },
                  },
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
              />
              </section>
              <section>
              <Line
                options={{
                  ...options, 
                  plugins: {
                    ...options.plugins,
                    title: {
                      display: true,
                      text: "Temperature °C",
                    },
                  },
                }}
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
              />
              </section>
              <section className="bg-slate-400 w-full"></section>
              {/* <Line
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
              /> */}
            </section>
          </section>
        </>
      )}


    </Layout>
  )
}

export default Weather;