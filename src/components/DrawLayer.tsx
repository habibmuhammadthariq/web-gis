import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from "leaflet";
import '@geoman-io/leaflet-geoman-free';
import FeatureModal from "./FeatureModal";


export function DrawLayer() {
  const map = useMap()
  // const drawnLayersRef = useRef<L.LayerGroup>(new L.LayerGroup()).current;
  const drawnLayersRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const [hasDrawn, setHasDrawn] = useState(false);

  // attributes modeal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<any>(null);

  useEffect(() => {
    if (!map) return;

    // enable drawing controls
    map.pm.addControls({
      position: 'topleft',
      drawCircle: true,
      drawRectangle: true,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      removalMode: true
    })

    map.on('pm:create', (e: any) => {
      const layer = e.layer;
      drawnLayersRef.current.addLayer(layer);
      setHasDrawn(true);
      
      console.log("open modal : ", modalOpen)
      setModalOpen(true)
      setModalOpen(true)
      setModalOpen(true)
      console.log("open modal now : ", modalOpen)
      openFeatureEditor(layer, {})
      // handleNewLayer(e.layer);
    })

    map.on("pm:remove", (e: any) => {
      const layer = e.layer;
      if (drawnLayersRef.current.hasLayer(layer)) {
        drawnLayersRef.current.removeLayer(layer);
      }
    })

    // add drawn layers group to map
    drawnLayersRef.current.addTo(map);

    return () => {
      // Remove event listeners to avoid duplicates
      map.off('pm:create');
      map.off("pm:remove");
      // Remove the drawn layers group from the map
      map.removeLayer(drawnLayersRef.current);
    }
  }, [map]);

  // const attachPopup = (layer: L.Layer) => {
  //   const content = document.createElement("div");
  //   const input = document.createElement("input");
  //   const textarea = document.createElement("textarea");
  //   const saveBtn = document.createElement("button");
  
  //   input.placeholder = "Name";
  //   textarea.placeholder = "Description";
  //   saveBtn.textContent = "Save";
  
  //   content.appendChild(input);
  //   content.appendChild(textarea);
  //   content.appendChild(saveBtn);
  
  //   const feature = (layer as any).feature || { properties: {} };
  
  //   // Pre-fill existing values if present
  //   input.value = feature.properties.name || "";
  //   textarea.value = feature.properties.description || "";
  
  //   saveBtn.onclick = () => {
  //     feature.properties.name = input.value;
  //     feature.properties.description = textarea.value;
  //     (layer as any).feature = feature;
  //     layer.closePopup();
  //   }
  
  //   layer.bindPopup(content);
  // };
  
  // const handleNewLayer = (layer: L.Layer) => {
  //   attachPopup(layer);
  //   drawnLayersRef.current.addLayer(layer);
  //   layer.openPopup();
  // };

  const openFeatureEditor = (layer: L.Layer, properties: any) => {
    setActiveFeature({ layer, properties });
    setModalOpen(true);
    console.log(`Modal open ? ${modalOpen}`)
  }

  const handleSaveAttributes = (attrs: Record<string, any>) => {
    if (activeFeature) {
      activeFeature.layer.feature = activeFeature.layer.feature || { type: "Feature", properties: {} };
      activeFeature.layer.feature.properties = attrs;
      setModalOpen(false);
    }
  }

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on("click", () => {
      openFeatureEditor(layer, feature.properties || {});
    });
    drawnLayersRef.current.addLayer(layer);
  }

  const downloadGeoJSON = () => {
    const geojson = drawnLayersRef.current.toGeoJSON();
    const dataStr = JSON.stringify(geojson, null, 2);
    const blob = new Blob([dataStr], { type: "application/geo+json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "drawn_features.geojson";
    a.click()

    URL.revokeObjectURL(url);
  };

  return (
    <>
      {hasDrawn && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 50,
            background: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
          }}
        >
          <button onClick={downloadGeoJSON}>Download GeoJSON</button>
        </div>
      )}

      <FeatureModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAttributes}
        initialData={activeFeature?.properties}
        />
    </>
  )
}