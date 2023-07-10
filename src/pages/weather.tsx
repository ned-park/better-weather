import { useEffect, useState } from "react";
import Layout from "~/components/layout/Layout";

const LAT = process.env.NEXT_PUBLIC_TEST_LAT || "";
const LONG = process.env.NEXT_PUBLIC_TEST_LONG || "";

const Weather = () => {
  type Hourly = {
    time?: Array<string>,
    temperature_2m?: Array<number>
  }

  type Forecast = {
    elevation?: number,
    generationtime_ms?: number,
    hourly?: Hourly,
    hourly_units?: { time: string, temperature_2m: string },
    temperature_2m?: string,
    time?: string,
    latitude?: number,
    longitude?: number,
    timezone?: string,
    timezone_abbreviation?: string,
    utc_offset_seconds?: number,
}


/*

*/

  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState<Forecast | undefined>();

  const getForecast = async () => {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LONG}&hourly=temperature_2m&timezone=auto&`);
    if (res.ok) {
      const data: Forecast = await res.json() as Forecast;
      if (!data) return;
      setForecast(data);
    } 
  }

  useEffect(() => {
    console.log(location)
    // fetch to backend to check if location has coordinates in DB
    // if not send request to position API
    // save response to avoid more queries
    // 

    void getForecast();
    
    // query weather API with coordinates provided and mutate state for display
  }, [location])

  return (
    <Layout>
      <input 
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          />
        {forecast && (
        <ul className="text-black">
          {Object.entries(forecast).map(([key, value], i) => <li key={i}>{key}: {value.toString()}</li>)}
        </ul>
        
        )}
        <h4>Testing whether this shows up</h4>
    </Layout>
  )
};

export default Weather;