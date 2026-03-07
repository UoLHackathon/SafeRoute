"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import RouteSelector from "@/components/RouteSelector";
import IncidentReportForm from "@/components/IncidentReportForm";
import SafeStopsLayer from "@/components/SafeStopsLayer";
import RiskLegend from "@/components/RiskLegend";
import { fetchRoutes, fetchSafeStops, fetchReports, fetchHeatmapData } from "@/lib/api";
import type { RouteOption, IncidentReport, SafeStop, HeatmapPoint } from "@/types";

// Mapbox relies on `window` — lazy-load with SSR disabled
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function HomePage() {
  // ── Map state ──────────────────────────────────────────────────────────
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // ── Route state ────────────────────────────────────────────────────────
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>();
  const [routeLoading, setRouteLoading] = useState(false);

  // ── Incident state ─────────────────────────────────────────────────────
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportCoords, setReportCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);

  // ── Safe stops ─────────────────────────────────────────────────────────
  const [safeStops, setSafeStops] = useState<SafeStop[]>([]);

  // ── Heatmap ────────────────────────────────────────────────────────────
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);

  // ── Get user's current position on mount ───────────────────────────────
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.longitude, pos.coords.latitude]),
      () => {
        /* fallback: default center handled by MapView */
      }
    );
  }, []);

  // ── Geocode destination via Mapbox ─────────────────────────────────────
  async function geocode(query: string): Promise<[number, number] | null> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&limit=1`
    );
    const data = await res.json();
    const coords = data.features?.[0]?.center;
    return coords ? [coords[1], coords[0]] : null; // [lat, lng]
  }

  // ── Request routes from backend ────────────────────────────────────────
  async function handleSearch() {
    if (!destination.trim() || !userLocation) return;

    setRouteLoading(true);
    try {
      const dest = await geocode(destination);
      if (!dest) {
        alert("Could not find that destination");
        return;
      }

      const start: [number, number] = [userLocation[1], userLocation[0]]; // lat,lng
      const end: [number, number] = [dest[0], dest[1]];
      const data = await fetchRoutes(start, end);
      setRoutes(data);
      setSelectedRoute(data[0]?.type);

      // Fetch safe stops for the first route
      if (data[0]?.type) {
        fetchSafeStops(data[0].type).then(setSafeStops).catch(() => {});
      }
    } catch (err) {
      console.error("Route fetch failed:", err);
    } finally {
      setRouteLoading(false);
    }
  }

  // ── Bounds change → load heatmap + incidents ───────────────────────────
  const handleBoundsChange = useCallback(
    (bounds: { north: number; south: number; east: number; west: number }) => {
      fetchReports(bounds).then(setIncidents).catch(() => {});

      if (showHeatmap) {
        fetchHeatmapData(bounds).then(setHeatmapData).catch(() => {});
      }
    },
    [showHeatmap]
  );

  // ── Map click → set report coords ─────────────────────────────────────
  function handleMapClick(lngLat: { lng: number; lat: number }) {
    if (showReportForm) {
      setReportCoords(lngLat);
    }
  }

  // ── Select route + load safe stops ─────────────────────────────────────
  function handleRouteSelect(type: string) {
    setSelectedRoute(type);
    fetchSafeStops(type).then(setSafeStops).catch(() => {});
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <MapView
        routes={routes}
        incidents={incidents}
        safeStops={safeStops}
        heatmapData={heatmapData}
        selectedRoute={selectedRoute}
        showHeatmap={showHeatmap}
        onMapClick={handleMapClick}
        onBoundsChange={handleBoundsChange}
        userLocation={userLocation}
      />

      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Where are you going?"
            className="flex-1 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={routeLoading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shrink-0"
          >
            {routeLoading ? "…" : "Go"}
          </button>
        </div>
      </div>

      {/* ── Nav links ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:bottom-4 md:left-4 md:translate-x-0">
        <Link
          href="/report"
          className="px-4 py-2.5 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors"
        >
          📝 Report
        </Link>
        <Link
          href="/settings"
          className="px-4 py-2.5 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors"
        >
          ⚙️ Settings
        </Link>
      </div>

      {/* ── Floating action: report ─────────────────────────────────────── */}
      {!showReportForm && (
        <button
          onClick={() => setShowReportForm(true)}
          className="absolute bottom-28 right-4 md:bottom-8 md:right-[26rem] z-30 w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-colors"
          title="Report incident"
        >
          🚨
        </button>
      )}

      {/* ── Incident report form ────────────────────────────────────────── */}
      {showReportForm && (
        <IncidentReportForm
          latitude={reportCoords?.lat ?? null}
          longitude={reportCoords?.lng ?? null}
          onClose={() => {
            setShowReportForm(false);
            setReportCoords(null);
          }}
          onSubmitted={() => {
            setShowReportForm(false);
            setReportCoords(null);
            fetchReports().then(setIncidents).catch(() => {});
          }}
        />
      )}

      {/* ── Route selector panel ────────────────────────────────────────── */}
      <RouteSelector
        routes={routes}
        selectedRoute={selectedRoute}
        onSelect={handleRouteSelect}
        onStartWalk={(route) => {
          window.location.href = `/walk?route=${route.type}&duration=${route.duration}`;
        }}
      />

      {/* ── Safe stops panel ────────────────────────────────────────────── */}
      {safeStops.length > 0 && routes.length > 0 && (
        <SafeStopsLayer stops={safeStops} />
      )}

      {/* ── Risk legend / heatmap toggle ────────────────────────────────── */}
      {!showReportForm && (
        <RiskLegend
          visible={showHeatmap}
          onToggle={() => setShowHeatmap((v) => !v)}
        />
      )}
    </div>
  );
}
