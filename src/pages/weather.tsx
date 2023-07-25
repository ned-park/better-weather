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
import Modal from "~/components/Modal";
import WeatherTable from "~/components/WeatherTable";
import { weatherIcons } from "~/utils/hashmaps";

const LAT = "";
const LONG = "";

export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  timezone: string;
  population?: number | null;
  country_id: number;
  country: string;
  admin1: string;
  admin2_id?: number | null;
  postcodes?: (string)[] | null;
  admin2?: string | null;
  admin3_id?: number | null;
  admin3?: string | null;
}

interface Location {
  results: (Place)[];
  generationtime_ms: number;
}

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

export interface LatLong {
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

function Weather() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [latLong, setLatLong] = useState<LatLong/* | undefined*/>({ latitude: LAT, longitude: LONG });
  const [forecast, setForecast] = useState<Forecast>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [places, setPlaces] = useState<Place[]>();
  const [day, setDay] = useState(0);

  const getLatLong = async () => {
    return await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=30&language=en&format=json`);
    // if (res.ok) {
    // const data = await res.json();
    // const results = data.results;
    // console.log(data);
    // if (!results || !results.longitude || !results.latitude) return;
    // setLatLong({longitude: data.longitude, latitude: data.latitude} as LatLong);
    // }
  }

  const findPercentDiffs = (arr: number[]): number[] => {
    if (!arr || arr.length < 1) return arr;
    arr = arr.map(Number);
    const out: number[] = new Array<number>(arr.length - 1).fill(0);
    for (let i = 1; i < arr.length; i++) {
      const x2 = arr[i];
      const x1 = arr[i - 1];
      if (x2 && !isNaN(x2) && x1 && !isNaN(x1))
        if (x1 !== 0) {
          out[i - 1] = (Math.abs((x2 - x1)) / (x1 || 0.00000000000001) * 100);
        } else {
          out[i - 1] = 100;
        }
    }

    return out;
  }

  useEffect(() => {
    const getForecastData = async () => {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latLong.latitude}&longitude=${latLong.longitude}&timezone=auto&hourly=weathercode,temperature_2m,relativehumidity_2m,precipitation_probability,precipitation,windspeed_10m`);
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

    if (latLong.latitude.length > 0 && latLong.longitude.length > 0) {
      void getForecast();
    }

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

  const changeLocation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await getLatLong();
    if (res.ok) {
      const data = await res.json() as Location;
      const results = data.results;
      if (results.length > 1) {
        setShowModal(true);
        setPlaces(results);
      } else if (!results[0]) {
        throw new Error("Invalid name");
        console.log("no results");
      } else {
        setLatLong({
          latitude: String(results[0].latitude),
          longitude: String(results[0].longitude),
        })
      }
      // const results = data.results;
      console.log(data);
    }
  }

  if (showModal && places) {
    return (
      <Modal places={places} setLatLong={setLatLong} setShowModal={setShowModal} setLocation={setLocation} setQuery={setQuery} />
    )
  }
  else {
    return (
      <Layout>
        <section className="flex flex-col md:flex-row gap-4 justify-between items-center px-1 py-4">
          <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => { void changeLocation(e) }}>
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="border-2 border-grey rounded p-2"
            />
            <button className="bg-sky-500 rounded p-2  px-4">
              Submit
            </button>
          </form>
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
            </>
          )}
        </section>

        {isLoaded && forecast && (
          <>
            <section className="w-full grid xl:grid-cols-2 gap-4 mb-8">
              <section>
                <WeatherTable
                  tableData={tableData}
                  tableHeaders={Object.keys(forecast.hourly)}
                  tableUnits={Object.values(forecast.hourly_units)}
                  location={location}
                />
              </section>
              <section className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 grid-rows-4 border-2 border-grey rounded h-max-[100vh] h-min-[75vh]">
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
                <section className="min-h-[300px]">
                  <Line
                    options={{
                      ...options,
                      plugins: {
                        ...options.plugins,
                        title: {
                          display: true,
                          text: "Precipitation Probability, Relative Humidity",
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
                        borderColor: 'rgb(0, 190, 255)',
                        backgroundColor: 'rgba(0, 190, 255, 0.5)',
                      },
                      {
                        fill: true,
                        label: 'Relative Humidity (%)',
                        data: forecast.hourly.relativehumidity_2m.slice(24 * day, 24 * (day + 1)).map(Number),
                        borderColor: 'rgb(10, 220, 132)',
                        backgroundColor: 'rgba(10, 220, 132, 0.5)',
                      }
                      ],
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
                          text: "Wind Speed",
                        },
                      },
                    }}
                    data={{
                      labels: forecast.hourly.time.slice(24 * day, 24 * (day + 1)),
                      datasets: [{
                        fill: true,
                        label: 'Wind Speed (km/h)',
                        data: forecast.hourly.windspeed_10m.slice(24 * day, 24 * (day + 1)).map(Number),
                        borderColor: 'rgb(99, 132, 220)',
                        backgroundColor: 'rgba(99, 132, 220, 0.5)',
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
                          text: "Hourly changes as percent",
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
                      labels: forecast.hourly.time.slice(24 * day + 1, 24 * (day + 1)),
                      datasets: [{
                        label: 'Change in Relative Humidity (%)',
                        data: findPercentDiffs(forecast.hourly.relativehumidity_2m.slice(24 * day, 24 * (day + 1)).map(Number)),
                        borderColor: 'rgb(10, 220, 132)',
                        backgroundColor: 'rgba(10, 220, 132, 0.5)',
                      },
                      {
                        label: 'Change in Temperature (%)',
                        data: findPercentDiffs(forecast.hourly.temperature_2m.slice(24 * day, 24 * (day + 1)).map(Number)),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      },
                      {
                        label: 'Change in PoP (%)',
                        data: findPercentDiffs(forecast.hourly.precipitation_probability.slice(24 * day, 24 * (day + 1)).map(Number)),
                        borderColor: 'rgb(0, 190, 255)',
                        backgroundColor: 'rgba(0, 190, 255, 0.5)'
                      },
                      {
                        label: 'Change in Windspeed (%)',
                        data: findPercentDiffs(forecast.hourly.windspeed_10m.slice(24 * day, 24 * (day + 1)).map(Number)),
                        borderColor: 'rgb(99, 132, 220)',
                        backgroundColor: 'rgba(99, 132, 220, 0.5)',
                      },
                      ],
                    }}
                  />
                </section>
              </section>
            </section>
          </>
        )}
      </Layout>
    )
  }
}

export default Weather;