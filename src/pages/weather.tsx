import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import Layout from "~/components/layout/Layout";

const LAT = process.env.NEXT_PUBLIC_TEST_LAT || "";
const LONG = process.env.NEXT_PUBLIC_TEST_LONG || "";

interface Hourly {
  time: Array<string>;
  temperature_2m: Array<number>;
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
  hourly_units: { time: string, temperature_2m: string };
  temperature_2m: string;
  time: string;
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
      text: "Hourly temperatures C",
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
  Legend
);


const Weather = () => {
  const [location, setLocation] = useState('');
  const [latLong, setLatLong] = useState<LatLong/* | undefined*/>({ latitude: LAT, longitude: LONG });
  const [forecast, setForecast] = useState<Forecast>();
  const [isLoaded, setIsLoaded] = useState(false);

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
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latLong.latitude}&longitude=${latLong.longitude}&hourly=temperature_2m&timezone=auto&`);
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
  }, [latLong])

  return (
    <Layout>
      <input
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      />
      {isLoaded && forecast && (
        <>
          <ul className="text-black">
            {Object.entries(forecast).map(([key, value], i) => typeof value == 'object'? <li key={i}>{key}: Object</li> : <li key={i}>{key}: {value}</li>)}
          </ul>
          <Line options={options} data={{labels: forecast.hourly.time, datasets:[{data: forecast.hourly.temperature_2m.map(Number)}]}} />
        </>
      )}
      <h4>Testing whether this shows up</h4>
    </Layout>
  )
};

export default Weather;