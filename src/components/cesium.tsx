// import { ArcGisMapServerImageryProvider, Rectangle, Math as CesiumMath, Cartesian3, OpenStreetMapImageryProvider, Viewer as NativeCesiumViewer, viewerCesium3DTilesInspectorMixin } from "cesium";
// import { useEffect, useRef, useState } from "react";
// import { CameraFlyTo, Cesium3DTileset, CesiumComponentRef, GeoJsonDataSource, ImageryLayer, Viewer } from "resium";

// import "cesium/Build/Cesium/Widgets/CesiumWidget/CesiumWidget.css"
// import "cesium/Build/Cesium/Widgets/Cesium3DTilesInspector/Cesium3DTilesInspector.css"

// const data = {
//   type: "Feature",
//   properties: {
//     name: "Coors Field",
//     amenity: "Baseball Stadium",
//     popupContent: "This is where the Rockies play!",
//   },
//   geometry: {
//     type: "Point",
//     coordinates: [-104.99404, 39.75621],
//   },
// };

// // const BONTANG_TOP_VIEW = {
// //   west: 2.047389588305716,
// //   south: -0.0010411240826794367,
// //   east: 2.0524672808226265,
// //   north: 0.004400886915452604,
// //   height: 0.005442010998132041,
// //   width: 0.005077692516910481,
// // }
// const osmImageryProvider = new OpenStreetMapImageryProvider({
//   url: "https://a.tile.openstreetmap.org/",
// });
// export default function Cesium() {
//   const ref = useRef<CesiumComponentRef<NativeCesiumViewer>>(null);
//   const [geojson, setGeojson] = useState(null);
//   const [tilesetUrls, setTilesetUrls] = useState<{ url: string, category: string}[]>([]);
//   const baseUrl = "http://localhost:5000"

//   useEffect(() => {
//     if (ref.current?.cesiumElement) {
//       const viewer = ref.current.cesiumElement;
//       viewer.scene.globe.depthTestAgainstTerrain = true;
//       viewer.extend(viewerCesium3DTilesInspectorMixin);
//       viewer.cesium3DTilesInspector.viewModel.inspectorVisible = true;

//       // // Force visible and styled
//       const el = viewer.cesium3DTilesInspector.container;
//       console.log(el)
//       // el.style.top = "10px";
//       // el.style.left = "10px";
//       // el.style.zIndex = "1000";
//       // el.style.display = "block";
//     }

//     // fetch(`${baseUrl}/parcel`, { method: "GET", headers: { "Content-type": "application/json" } })
//     //   .then(res => res.json())
//     //   .then(data => setGeojson(data))
//     //   .catch(err => console.error(`Failed to fetch GeoJSON : ${err}`));


//       const fetchTileset = async () => {
//         try {
//           const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0ODRkODFlLWE2ZTktNDkyZS05ZWRmLTBiNGI4Mzc4ZjdjZSIsImVtYWlsIjoiaGFiaWJAaXQuY29tIiwiZmlyc3ROYW1lIjoiaGFiaWIiLCJsYXN0TmFtZSI6IklUIFRlYW0iLCJhY3RpdmVPcmdhbml6YXRpb25JZCI6IjdjYTc2M2IyLTc1OGMtNDUxOS04NjVhLTYyOWUwNzljNjFiMSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc1MTk1MzQwNSwiZXhwIjoxNzUyMDM5ODA1fQ.Mspqjqsp_V8NooAkBve3V5zA0O6a50yxYA-HyDijp_Y";
//           const res = await fetch(`https://dt-ugm-api-production.up.railway.app/3d-tiles?category=building`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             }
//           });
    
//           if (!res.ok) throw new Error(`Failed to fetch tileset url`);
//           const data = await res.json();
    
//           let tilesets = data.map((item: any) => ({
//             url: item.url,
//             category: item.category || 'unknown'
//           }));
//           console.log(`Number of tilesets fetched: ${tilesets.length}`);
//           tilesets = tilesets.slice(0, 300)
//           setTilesetUrls(tilesets);
//         } catch (error) {
//           console.error("Error fetching tileset:", error);
//         }
//       }
//     fetchTileset()
//   }, []);

//   return (
//     <Viewer ref={ref} full>
//       <CameraFlyTo
//         // destination={Cartesian3.fromDegrees(112.75250265452641, -7.261938806214568, 200)} // surabaya
//         // destination={Cartesian3.fromDegrees(117.482286804, 0.160783894, 1000)} // bontang
//         destination={Cartesian3.fromDegrees(106.741644, -6.093152, 1000)} // jakarta
//         // destination={
//         //   new Rectangle(BONTANG_TOP_VIEW.west, BONTANG_TOP_VIEW.south, BONTANG_TOP_VIEW.east, BONTANG_TOP_VIEW.north)
//         // }
//         duration={2}
//         // orientation={{ heading: CesiumMath.toRadians(20.0), pitch: CesiumMath.toRadians(-90.0), roll: 0.0 }}
//         orientation={{ heading: CesiumMath.toRadians(15.0), pitch: CesiumMath.toRadians(-35.0), roll: 0.0 }}
//         once
//       />
//       {geojson && <GeoJsonDataSource data={geojson} />}
//       {/* <ImageryLayer
//         imageryProvider={
//           new ArcGisMapServerImageryProvider({
//             url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
//             // url: "//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
//           })
//         }
//       /> */}
//       {/* <Cesium3DTileset
//         // url="https://localhost:5000/public/PERSIL_RT18/tileset.json"
//         // url="https://localhost:5000/public/SAMPLE_RT1_LOKTUAN_BIDANGTANAH/tileset.json"
//         url="/public/tileset/SAMPLE_RT1_LOKTUAN_BIDANGTANAH/tileset.json"
//         // onReady={tileset => console.log("Tileset is ready", tileset)}
//       /> */}
//       {tilesetUrls.map((tileset, index) => (
//         <Cesium3DTileset
//           key={index}
//           url={tileset.url}
//           preferLeaves={true}
//           cullRequestsWhileMoving={true}
//           // immediatelyLoadDesiredLevelOfDetail={true}
//           skipLevelOfDetail={true}
//           foveatedScreenSpaceError={true}
//           foveatedTimeDelay={1000}
//           maximumScreenSpaceError={32}
//           maximumCacheOverflowBytes={64}
//           cacheBytes={256}
//           // onReady={(tileset) => console.log(`Tileset ${tilesetUrls[index].category} is ready`, tileset)}
//         />
//       ))}
      
//       {/* <Cesium3DTileset url="https://dt-jakarta.s3.ap-southeast-2.amazonaws.com/model3d/dki_pik/tileset.json"  /> */}

//       {/* <ImageryLayer imageryProvider={osmImageryProvider} /> */}
//     </Viewer>
//   )
// }