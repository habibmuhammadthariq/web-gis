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
          "osm-tiles": {
            type: "vector",
            url: "https://api.maptiler.com/tiles/v3/tiles.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_KEY,
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
            id: 'water-layer',
            type: 'fill',
            source: 'osm-tiles',
            'source-layer': 'water',
            paint: {
              'fill-color': '#0f5e9c',
              'fill-opacity': 0.7,
            }
          },
          {
            id: 'aeroway-layer',
            type: 'line',
            source: 'osm-tiles',
            'source-layer': 'aeroway',
            paint: {
              'line-color': '#010203',
              'line-opacity': 0.6,
              "line-width": 3
            }
          }
        ]
      },
      center: [106.816666, -6.2], // Jakarta coordinates
      zoom: 10,
      maxZoom: 18
    });

    mapRef.current.on('load', () => {
      // Building Footprints (2D)
      mapRef.current?.addLayer({
        id: 'buildings-2d',
        type: 'fill',
        source: 'osm-tiles',
        'source-layer': 'building',
        paint: {
          'fill-color': [
            'step',
            ['coalesce', ['get', 'render_height'], 0],
            '#f8d5cc', // Default color for buildings without height
            5, '#f8d5cc', //"#0000ff",  // >=5 and <10: blue
            10, "#00ff00", // >=10 and <20: green
            20, "#ffff00", // >=20 and <50: yellow
            50, "#800080"  // >=50: purple
          ],
        }
      });  

      // Building Footprints (3D)
      mapRef.current?.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'osm-tiles',
        'source-layer': 'building',
        paint: {
          'fill-extrusion-color': [
            'step',
            ['coalesce', ['get', 'render_height'], 0],
            '#f8d5cc', // Default color for buildings without height
            5, '#f8d5cc', //"#0000ff",  // >=5 and <10: blue
            10, "#00ff00", // >=10 and <20: green
            20, "#ffff00", // >=20 and <50: yellow
            50, "#800080"  // >=50: purple
          ],
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 10],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
          'fill-extrusion-opacity': 0.6
        }
      });

      mapRef.current?.setLayoutProperty('buildings-3d', 'visibility', 'none');
    });

    mapRef.current.on('click', (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['buildings-2d', 'buildings-3d']
      });
      if (!features?.length) return;

      const feature = features[0];
      const props = feature.properties;
      const { lng, lat } = e.lngLat;

      let html = "<strong>Building feature properties:</strong><br/><ul>";
      for (const k in props) {
        html += `<li><code>${k}</code>: ${props[k]}</li>`;
      }
      html += "</ul>";
      
      // Street View deep link (Google Maps)
      const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=0&pitch=0&fov=90`;
      // Append button row
      html += `
        <div style="margin-top:8px;">
          <a 
            href="${streetViewUrl}" 
            target="_blank" 
            style="
              display:inline-block;
              padding:6px 12px;
              background:#1a73e8;
              color:white;
              text-decoration:none;
              border-radius:4px;
              font-size:13px;
            "
          >
            Open Street View
          </a>
        </div>
      `;

      new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(mapRef.current!);
    });

    ['buildings-2d', 'buildings-3d'].forEach(layerId => {
      mapRef.current?.on('mouseenter', layerId, () => {
        const canvas = mapRef.current?.getCanvas();
        if (canvas) {
          canvas.style.cursor = 'pointer';
        }
      });
  
      mapRef.current?.on('mouseleave', layerId, () => {
        const canvas = mapRef.current?.getCanvas();
        if (canvas) {
          canvas.style.cursor = '';
        }
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "100vh", width: "100%" }}
    >
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '50px',
        background: '#fff',
        padding: '8px',
        borderRadius: '6px',
        fontFamily: 'system-ui',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 2
      }}>
        <label>
          <input 
            type="radio" 
            name="mode" 
            value="2d" 
            checked={mode === '2d'}
            onChange={handleChange}
            style={{
              verticalAlign: 'middle',
              position: 'relative',
            }} />
          &nbsp; 2D
        </label>
        <label style={{ marginLeft: '8px' }}>
          <input 
            type="radio"
            name="mode"
            value="3d"
            checked={mode === '3d'}
            onChange={handleChange} 
            style={{
              verticalAlign: 'middle',
              position: 'relative',
            }}/>
          &nbsp; 3D
        </label>
      </div>
    </div>
  )
}

export default Map;