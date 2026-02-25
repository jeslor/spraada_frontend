"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function ToolMap() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const marker = new mapboxgl.Marker()
      .setLngLat([32.5825, 0.3476])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<h3>Tool Location</h3><p style="color: red; font-weight: bold; font-size: 10px;">This tool is located around here</p>',
        ),
      );
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [32.5825, 0.3476], // [lng, lat]
      zoom: 14,
    });

    marker.addTo(map);

    return () => map.remove();
  }, [mapContainer !== null]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", borderRadius: "12px" }}
    />
  );
}
