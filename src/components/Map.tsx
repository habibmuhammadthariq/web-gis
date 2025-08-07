'use client'

import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Feature } from "maplibre-gl";
import MaplibreGeocoder, { MaplibreGeocoderFeatureResults } from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css"

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mode, setMode] = useState<'2d' | '3d'>('3d');

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
      // center: [106.816666, -6.2], // Jakarta coordinates
      center: [101.02941029389802, 1.6424889026350797], // home
      pitch: 60,
      bearing: 90,
      zoom: 18,
      maxZoom: 19
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

      mapRef.current?.setLayoutProperty('buildings-2d', 'visibility', 'none');
    });

    const geocoder = new MaplibreGeocoder(
      {
        forwardGeocode: async (config) => {
          const query = config.query ?? "";
          // @ts-expect-error: query might be number[], and that's okay for now
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson`);
          // const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`);
          const data = await response.json();
          // // Convert Nominatim results to Carmen GeoJSON format
          // return {
          //   type: "FeatureCollection",
          //   features: data.map((result) => ({
          //     type: 'Feature',
          //     geometry: {
          //         type: 'Point',
          //         coordinates: [parseFloat(result.lon), parseFloat(result.lat)]
          //     },
          //     properties: {
          //         address: result.display_name
          //     },
          //     place_name: result.display_name,
          //     center: [parseFloat(result.lon), parseFloat(result.lat)]
          //   })) as Feature[]
          // }
          return {
            type: "FeatureCollection",
            features: data.features.map((feature: Feature) => ({
              type: "Feature",
              geometry: feature.geometry,
              place_name: feature.properties.display_name,
              properties: feature.properties
            }))
          } as MaplibreGeocoderFeatureResults;
        }
      },
      maplibregl
    );
    mapRef.current.addControl(geocoder);

    mapRef.current.on('click', async (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['buildings-2d', 'buildings-3d']
      });
      if (!features?.length) return;

      const { lng, lat } = e.lngLat;

      // location detail
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'WebGis/1.0 (thariqhabibmuhammad@gmail.com)'
        }
      });
      if (!response.ok) { throw new Error(`Failed to fetch location info`); }

      const properties = await response.json();

      const village = properties.address.village || properties.address.suburb || ''
      const subdistrict = properties.address.city_district || properties.address.subdistrict || properties.address.municipality || ''
      const city = properties.address.city || properties.address.county || ''; // || properties.address.town (sometimes it is a subdistrict and not kota/kabupaten )
      const province = properties.address.state || ''
      let html = `
          <strong>Detail Bangunan</strong>
          <ul>
            ${properties.address.road ? `<li><strong>Jalan:</strong> ${properties.address.road}</li>` : ''}
            ${village ? `<li><strong>Kelurahan/Desa:</strong> ${village}</li>` : ''}
            ${subdistrict ? `<li><strong>Kecamatan:</strong> ${subdistrict}</li>` : ''}
            ${city ? `<li><strong>Kabupaten/Kota:</strong> ${city}</li>` : ''}
            ${province ? `<li><strong>Provinsi:</strong> ${province}</li>` : ''}
            <li><strong>Negara:</strong> ${properties.address.country}</li>  
          </ul>
        `
      
      // Street View deep link (Google Maps)
      const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=90&pitch=0&fov=90`;
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
        top: '70px',
        right: '10px',
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
          &nbsp;2D
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
          &nbsp;3D
        </label>
      </div>
    </div>
  )
}

export default Map;