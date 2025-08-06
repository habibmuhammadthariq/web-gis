import dynamic from "next/dynamic";
import Head from "next/head";

const Map = dynamic(() => import("../components/MapJakarta"), {
  ssr: false
});

export default function VectorTilePage() {
  return (
    <>
      <Head>
        <title>Jakarta</title>
      </Head>
      <main>
        <Map />
      </main>
    </>
  );
} 