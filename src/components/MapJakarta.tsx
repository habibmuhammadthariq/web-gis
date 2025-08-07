'use client'

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mode, setMode] = useState<'2d' | '3d'>('2d');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMode = event.target.value as '2d' | '3d';
    setMode(selectedMode);
    
    if (mapRef.current) {
      mapRef.current.setLayoutProperty('buildings-3d', 'visibility', selectedMode === '3d' ? 'visible' : 'none');
      mapRef.current.setLayoutProperty('buildings-2d', 'visibility', selectedMode === '2d' ? 'visible' : 'none');
    }
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maplibregl.Map({
      transformRequest: (url) => {
        return {
          url: url,
          headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`}
        }
      },
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'openstreetmap': {
            type: 'raster',
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256, 
            attribution: '© OpenStreetMap contributors',
          },
          "jakarta-tiles": {
            type: "vector",
            tiles: [
              "https://nginx-production-d7b5.up.railway.app/public.vector_tiles/{z}/{x}/{y}.pbf",
            ]
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'openstreetmap',
            minzoom: 0,
            maxzoom: 18
          },
          {
            id: 'bo-layer',
            type: 'line',
            source: 'jakarta-tiles',
            'source-layer': 'public.vector_tiles',
            paint: {
              'line-color': '#f44336',
              "line-width": 1
            },
            maxzoom: 18
          }
        ]
      },
      center: [106.816666, -6.2], // Jakarta coordinates
      zoom: 10,
      maxZoom: 18
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "100vh", width: "100%" }}
    />
      
  )
}

export default Map;