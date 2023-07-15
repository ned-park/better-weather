// import { useUser } from "@clerk/nextjs";
// import Image from "next/image";

function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <h1 className="text-6xl">{process.env.NEXT_PUBLIC_TITLE}</h1>
      <section>
        <h2 className="font-bold">{process.env.NEXT_PUBLIC_TITLE} offers </h2>
        <ul>
          <li>Weekly Weather Forecasts</li>
          <li>Customizable saved locations</li>
          <li>Comparisons for last year&apos;s weather data (coming soon)</li>
          <li>Weather alerts (coming soon)</li>
          <li>Assorted graphs to easily visualize data weather</li>
        </ul>
        <p>Signing up enables default and saved locations, since geolocated IP addresses tend to be inaccurate outside of large cities.</p>
      </section>
      <section>
        {/* <p>Full functionality of the site exists for all users, but signing up enables saving multiple locations, notes, </p> */}
      </section>
    </main>
  )
}

export default LandingPage;