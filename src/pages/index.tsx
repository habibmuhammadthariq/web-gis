import dynamic from "next/dynamic";
import Head from "next/head";

// import MapView from "@/components/MapView";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Leaflet with Next.js</title>
      </Head>
      <main>
        <MapView />
      </main>
    </>
  )
}