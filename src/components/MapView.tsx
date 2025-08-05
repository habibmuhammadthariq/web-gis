// "use client";

// import { MapContainer, TileLayer, Marker, LayersControl, Popup, Circle, Polygon, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L, { LatLngExpression } from "leaflet";
// import { useEffect, useState } from "react";
// import { DrawLayer } from "./DrawLayer";
// import MarkerLayer from "./MarkerLayer";

// // Import images manually
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// // fix for default icon issue in nextjs
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl,
//   iconRetinaUrl,
//   shadowUrl,
// });
// const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

// const position: LatLngExpression = [-6.2, 106.816666]; // Jakarta, for example

// const MapView = () => {
//   useEffect(() => {
//   }, []);

//   const [markerPos, setMarkerPos] = useState<[number, number]>(position as [number, number])

//   return (
//     <MapContainer center={position} zoom={6} style={{ height: "100vh", width: "100%" }}>
//       <LayersControl position="topright">
//         <LayersControl.BaseLayer name="OpenStreetMap" checked>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="MapTiler Streets">
//           <TileLayer
//             url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
//             attribution="&copy; <a href='https://www.maptiler.com/'>MapTiler</a> contributors"
//           />
//         </LayersControl.BaseLayer>
        
//         <LayersControl.BaseLayer name="MapTiler Satellite">
//           <TileLayer
//             url={`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`}
//             attribution='&copy; MapTiler'
//           />
//         </LayersControl.BaseLayer>
//       </LayersControl>

//       <DrawLayer />
//       <MarkerLayer 
//         initialPosition={position} 
//         onPositionChange={(newPos) => {
//           console.log(`Marker move to : ${newPos.lat}, ${newPos.lng}`);
//           setMarkerPos([newPos.lat, newPos.lng]);
//         }}
//         />
//     </MapContainer>
//   )
// }

// export default MapView;