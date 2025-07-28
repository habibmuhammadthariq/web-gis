'use client'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.vectorgrid';
import '@maplibre/maplibre-gl-leaflet'
import { useEffect, useRef } from 'react';

export default function VectorTileMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([-6.2, 106.816666], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    /* VectorGrid */
    /*
    const vectorTileLayer = L.vectorGrid.protobuf(
      'localhost:8080/tiles/{z}/{x}/{y}.pbf',
      {
        rendererFactory: L.canvas.tile,
        fetchOptions: {
          headers: { 'Authorization': 'Basic ' + btoa('digitaltwinugm:16Algnk8OIeY5m') }
        },
        vectorTileLayerStyles: {
          buildings: {
            fill: true,
            fillColor: '#00BCD4',
            fillOpacity: 0.5,
            stroke: true,
            color: '#0097A7',
            weight: 1,
          }
        },
        interactive: true,
        attribution: '© Vector Tile Source',
      }
    );
    vectorTileLayer.addTo(map);
    */

        /* Map Libre GL JS */
    /* */
    const vectorLayer = L.maplibreGL({
      transformRequest: (url)=> {
        return {
          url: url,
          headers: { 'Authorization': 'Basic ' + btoa('digitaltwinugm:16Algnk8OIeY5m') }
        };
      },
      style: {
        version: 8,
        sources: {
          mytiles: {
            type: 'vector',
            tiles: [
              "https://nginx-production-d7b5.up.railway.app/tiles/public.vector_tiles/{z}/{x}/{y}.pbf"
              // "http://localhost/tiles/{z}/{x}/{y}.pbf",
            ],
            minzoom: 0,
            maxzoom: 20
          }
        },
        layers: [
          {
            id: 'outline',
            type: 'line',
            source: 'mytiles',
            'source-layer': 'public.vector_tiles',
            paint: {
              'line-color': '#f44336',
              'line-width': 1
            }
          }
        ]
      }
    })
    vectorLayer.addTo(map);
    vectorLayer.getContainer().style.zIndex = '1000';
    /* */

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />

    // </div>
  )
}