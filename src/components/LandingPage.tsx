// import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import image from "../../public/sample.png"
import Link from "next/link";
function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col gap-8 mt-16">
      <h1 className="text-6xl">{process.env.NEXT_PUBLIC_TITLE}</h1>
      <section className="flex flex-col xl:flex-row gap-4">
        <section className="flex flex-col justify-center gap-8">
          <h2 className="font-bold text-xl">{process.env.NEXT_PUBLIC_TITLE} offers </h2>
          <ul className="flex flex-col gap-2">
            <li>Weekly Weather Forecasts</li>
            <li>Customizable saved locations</li>
            <li>Comparisons for last year&apos;s weather data (coming soon)</li>
            <li>Weather alerts (coming soon)</li>
            <li>Assorted graphs to easily visualize data weather</li>
          </ul>
          <p>Signing up enables default and saved locations (coming soon), since geolocated IP addresses tend to be inaccurate outside of large cities.</p>
          <section>
            <Link href="weather">Find your weather <span className="font-bold">here</span>!</Link>
          </section>
        </section>

        <section>
          <Image src={image} alt="How site is displaying the weather forecast for Toronto" />
        </section>
      </section>
    </main>
  )
}

export default LandingPage;