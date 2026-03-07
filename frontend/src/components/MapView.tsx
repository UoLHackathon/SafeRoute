"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { initMapbox, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/mapbox";
import type { RouteOption, IncidentReport, SafeStop, HeatmapPoint } from "@/types";
import { ROUTE_COLORS, SAFE_STOP_ICONS } from "@/lib/mapbox";

interface MapViewProps {
  routes?: RouteOption[];
  incidents?: IncidentReport[];
  safeStops?: SafeStop[];
  heatmapData?: HeatmapPoint[];
  selectedRoute?: string;
  showHeatmap?: boolean;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  onBoundsChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  userLocation?: [number, number] | null;
  trackUser?: boolean;
}

export default function MapView({
  routes,
  incidents,
  safeStops,
  heatmapData,
  selectedRoute,
  showHeatmap = false,
  onMapClick,
  onBoundsChange,
  userLocation,
  trackUser = false,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // ── Initialise map ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    initMapbox();

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: userLocation ?? DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    map.on("click", (e) => {
      onMapClick?.({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });

    map.on("moveend", () => {
      const b = map.getBounds();
      if (!b) return;
      onBoundsChange?.({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Draw route polylines ────────────────────────────────────────────────
  const drawRoutes = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Remove old route layers/sources
    ["fastest", "lowerRisk", "comfort"].forEach((id) => {
      if (map.getLayer(`route-${id}`)) map.removeLayer(`route-${id}`);
      if (map.getSource(`route-${id}`)) map.removeSource(`route-${id}`);
    });

    if (!routes?.length) return;

    routes.forEach((route) => {
      const id = `route-${route.type}`;
      const isSelected = selectedRoute === route.type;

      map.addSource(id, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.geometry,
          },
        },
      });

      map.addLayer({
        id,
        type: "line",
        source: id,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": ROUTE_COLORS[route.type] ?? "#888",
          "line-width": isSelected ? 6 : 3,
          "line-opacity": isSelected ? 1 : 0.5,
        },
      });
    });

    // Fit map to selected or first route
    const target = routes.find((r) => r.type === selectedRoute) ?? routes[0];
    if (target?.geometry?.length) {
      const bounds = new mapboxgl.LngLatBounds();
      target.geometry.forEach((coord) => bounds.extend(coord as [number, number]));
      map.fitBounds(bounds, { padding: 80, duration: 800 });
    }
  }, [routes, selectedRoute]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      drawRoutes();
    } else {
      map.once("style.load", drawRoutes);
    }
  }, [drawRoutes]);

  // ── Heatmap layer ───────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      // Remove existing heatmap
      if (map.getLayer("risk-heat")) map.removeLayer("risk-heat");
      if (map.getSource("risk-heat")) map.removeSource("risk-heat");

      if (!showHeatmap || !heatmapData?.length) return;

      map.addSource("risk-heat", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: heatmapData.map((p) => ({
            type: "Feature" as const,
            properties: { weight: p.weight },
            geometry: {
              type: "Point" as const,
              coordinates: [p.longitude, p.latitude],
            },
          })),
        },
      });

      map.addLayer(
        {
          id: "risk-heat",
          type: "heatmap",
          source: "risk-heat",
          paint: {
            // Weight each point by its risk weight
            "heatmap-weight": ["get", "weight"],
            "heatmap-intensity": 1,
            "heatmap-radius": 30,
            "heatmap-opacity": 0.6,
            // Green → Yellow → Red colour ramp
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0,0,0,0)",
              0.2, "rgb(34,197,94)",   // green
              0.5, "rgb(234,179,8)",   // yellow
              0.8, "rgb(239,68,68)",   // red
              1,   "rgb(185,28,28)",   // dark red
            ],
          },
        },
        // Place under labels
        "waterway-label"
      );
    };

    if (map.isStyleLoaded()) apply();
    else map.once("style.load", apply);
  }, [heatmapData, showHeatmap]);

  // ── Incident markers ────────────────────────────────────────────────────
  useEffect(() => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const map = mapRef.current;
    if (!map || !incidents?.length) return;

    const typeEmoji: Record<string, string> = {
      harassment: "⚠️",
      suspicious_behaviour: "👁️",
      poorly_lit: "🌑",
      isolated_street: "🚧",
    };

    incidents.forEach((inc) => {
      const el = document.createElement("div");
      el.className = "text-xl cursor-pointer";
      el.textContent = typeEmoji[inc.type] ?? "📍";
      el.title = `${inc.type}: ${inc.description ?? ""}`;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([inc.longitude, inc.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setHTML(
            `<div class="text-sm p-1">
              <strong>${inc.type.replace("_", " ")}</strong>
              ${inc.description ? `<p class="mt-1">${inc.description}</p>` : ""}
              <p class="text-xs text-gray-400 mt-1">${new Date(inc.timestamp).toLocaleString()}</p>
            </div>`
          )
        )
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [incidents]);

  // ── Safe-stop markers ───────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // We use a separate array appended to markersRef — simple approach
    if (!safeStops?.length) return;

    safeStops.forEach((stop) => {
      const el = document.createElement("div");
      el.className = "text-lg cursor-pointer";
      el.textContent = SAFE_STOP_ICONS[stop.category] ?? "📌";
      el.title = stop.name;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([stop.longitude, stop.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setHTML(
            `<div class="text-sm p-1"><strong>${stop.name}</strong><p class="text-xs capitalize text-gray-400">${stop.category.replace("_", " ")}</p></div>`
          )
        )
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [safeStops]);

  // ── Track user location ─────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.className =
        "w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg";
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(userLocation)
        .addTo(map);
    } else {
      userMarkerRef.current.setLngLat(userLocation);
    }

    if (trackUser) {
      map.easeTo({ center: userLocation, duration: 500 });
    }
  }, [userLocation, trackUser]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0"
    />
  );
}
