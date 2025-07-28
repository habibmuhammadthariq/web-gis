import "@/styles/globals.css";
import type { AppProps } from "next/app";
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "cesium/Build/Cesium/Widgets/CesiumWidget/CesiumWidget.css"
import "cesium/Build/Cesium/Widgets/Cesium3DTilesInspector/Cesium3DTilesInspector.css"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
