import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from '@clerk/nextjs'
import "~/styles/globals.css";
import { useRouter } from "next/router";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {

  const router = useRouter();

  return (
    <>
    <Head>
      <title>Weekly Weather</title>
      <meta name="description" content="Weather forecast aggregator, includes wet bulb temperatures, and moon phase" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ClerkProvider 
      navigate={(to) => router.push(to)}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </ClerkProvider>
    </>
  )
};

export default api.withTRPC(MyApp);
