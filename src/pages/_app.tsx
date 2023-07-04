import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from '@clerk/nextjs'
import "~/styles/globals.css";
import { useRouter } from "next/router";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const clerkFrontendAPI = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

const MyApp: AppType = ({ Component, pageProps }) => {

  const router = useRouter();

  return (
    <>
    <Head>
      <title>Better Weather</title>
      <meta name="description" content="Weather forecast aggregator, includes wet bulb temperatures, and moon phase" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ClerkProvider 
      navigate={(to) => router.push(to)}
      >
      <Toaster position="top-right" />
      <Component {...pageProps} />;
    </ClerkProvider>
    </>
  )
};

export default api.withTRPC(MyApp);
