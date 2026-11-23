// src/components/map/ComplaintMap.tsx
// NOTE: This component is loaded dynamically (no SSR) because Leaflet needs window

"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import type { ComplaintResponse, NearbyFacility } from "@/types/complaint";
import { getPriorityColor, formatIssueType } from "@/lib/utils";

// Fix default marker icon broken by Webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom SVG marker factory
function createSvgIcon(color: string, symbol: string, size = 36): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background:${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid rgba(255,255,255,0.9);
        box-shadow:0 4px 12px rgba(0,0,0,0.4);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="
          transform:rotate(45deg);
          font-size:${Math.round(size * 0.44)}px;
          line-height:1;
          display:block;
          text-align:center;
        ">${symbol}</span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

interface ComplaintMapProps {
  data: ComplaintResponse;
}

export default function ComplaintMap({ data }: ComplaintMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const center: [number, number] = [data.latitude, data.longitude];
  const priorityColor = getPriorityColor(data.priority_level);

  const mainIcon = createSvgIcon(priorityColor, "⚠", 40);
  const hospitalIcon = createSvgIcon("#EF4444", "🏥", 30);
  const schoolIcon = createSvgIcon("#3B82F6", "🏫", 30);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, 14, { duration: 1.2 });
    }
  }, [data.latitude, data.longitude]);

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%", minHeight: "420px" }}
      ref={mapRef}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Pulse circle around main marker */}
      <Circle
        center={center}
        radius={300}
        pathOptions={{
          color: priorityColor,
          fillColor: priorityColor,
          fillOpacity: 0.08,
          weight: 1.5,
          opacity: 0.4,
          dashArray: "6 4",
        }}
      />

      {/* Main complaint marker */}
      <Marker position={center} icon={mainIcon}>
        <Popup>
          <div className="p-1">
            <div className="font-display font-bold text-white text-sm mb-1">
              {data.report_id}
            </div>
            <div className="text-slate-400 text-xs mb-2 leading-relaxed">
              {data.issue_description.slice(0, 120)}
              {data.issue_description.length > 120 ? "…" : ""}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className="px-2 py-0.5 rounded-full font-mono font-medium uppercase"
                style={{
                  background: `${priorityColor}25`,
                  color: priorityColor,
                  border: `1px solid ${priorityColor}50`,
                }}
              >
                {data.priority_level}
              </span>
              <span className="text-slate-500">
                {formatIssueType(data.issue_type)}
              </span>
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Hospital markers */}
      {data.nearby.hospitals.map((h: NearbyFacility, i: number) => (
        <Marker key={`h-${i}`} position={[h.lat, h.lon]} icon={hospitalIcon}>
          <Popup>
            <div className="p-1">
              <div className="text-xs font-mono uppercase tracking-wide text-red-400 mb-0.5">
                Hospital
              </div>
              <div className="font-display font-semibold text-white text-sm">
                {h.name}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* School markers */}
      {data.nearby.schools.map((s: NearbyFacility, i: number) => (
        <Marker key={`s-${i}`} position={[s.lat, s.lon]} icon={schoolIcon}>
          <Popup>
            <div className="p-1">
              <div className="text-xs font-mono uppercase tracking-wide text-civic-blue mb-0.5">
                School
              </div>
              <div className="font-display font-semibold text-white text-sm">
                {s.name}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
