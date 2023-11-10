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
import type { Forecast, ForecastData } from "~/interfaces/forecast";

export const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      align: "start" as const,
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

export default function WeatherCharts({ forecast, day }: { forecast: Forecast, day: number }) {
  return (
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

    </section >
  )
}