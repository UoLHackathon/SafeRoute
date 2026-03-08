"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import RouteSelector from "@/components/RouteSelector";
import SafeStopsLayer from "@/components/SafeStopsLayer";
import RiskLegend from "@/components/RiskLegend";
import IncidentReportForm from "@/components/IncidentReportForm";
import { fetchAllRoutes, fetchSafeStops, fetchReports } from "@/lib/api";
import type { RouteOption, SafeStop, IncidentReport } from "@/types";

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Loading map…
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}

function MapContent() {
  const params = useSearchParams();
  const destination = params.get("dest") ?? "";
  const destLat = Number(params.get("destLat")) || 0;
  const destLng = Number(params.get("destLng")) || 0;
  const mode = params.get("mode") ?? "LOWER_RISK";
  const startLat = params.get("startLat") ? Number(params.get("startLat")) : null;
  const startLng = params.get("startLng") ? Number(params.get("startLng")) : null;

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>(mode);
  const [safeStops, setSafeStops] = useState<SafeStop[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    startLat && startLng ? [startLat, startLng] : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, [userLocation]);

  const loadRoutes = useCallback(async () => {
    if (!userLocation || !destLat || !destLng) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchAllRoutes(
        userLocation[0], userLocation[1],
        destLat, destLng
      );
      setRoutes(data);
      if (data.length > 0) {
        const preferred = data.find((r) => r.mode === mode) ?? data[0];
        setSelectedRoute(preferred.mode);
        fetchSafeStops(preferred.mode).then(setSafeStops).catch(() => {});
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [userLocation, destLat, destLng, mode]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  useEffect(() => {
    fetchReports().then(setIncidents).catch(() => {});
  }, []);

  function handleRouteSelect(type: string) {
    setSelectedRoute(type);
    fetchSafeStops(type).then(setSafeStops).catch(() => {});
  }

  const currentRoute = routes.find((r) => r.mode === selectedRoute);
  const riskLevel = currentRoute
    ? currentRoute.riskScore < 30
      ? "Low"
      : currentRoute.riskScore < 60
        ? "Medium"
        : "High"
    : null;
  const riskColor = currentRoute
    ? currentRoute.riskScore < 30
      ? "text-green-600"
      : currentRoute.riskScore < 60
        ? "text-yellow-600"
        : "text-red-600"
    : "";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        <div className="text-center space-y-2">
          <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <p>Map area</p>
          {userLocation && (
            <p className="text-xs text-gray-300">
              {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
              ← Back
            </Link>
            {destination && (
              <span className="text-xs text-gray-500 truncate ml-4 flex-1 text-right">
                📍 {destination}
              </span>
            )}
          </div>

          {currentRoute && riskLevel && (
            <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-xs text-gray-500">Route risk</span>
              <span className={`text-sm font-semibold ${riskColor}`}>
                {riskLevel} ({currentRoute.riskScore.toFixed(0)}%)
              </span>
            </div>
          )}

          {loading && (
            <p className="mt-2 text-xs text-gray-400 text-center">Finding routes…</p>
          )}
        </div>
      </div>

      {incidents.length > 0 && (
        <div className="absolute top-36 left-4 z-20">
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-500">
            ⚠️ {incidents.length} incident{incidents.length !== 1 ? "s" : ""} in area
          </div>
        </div>
      )}

      {!showReportForm && (
        <button
          onClick={() => setShowReportForm(true)}
          className="absolute bottom-44 right-4 z-30 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-2xl flex items-center gap-2 text-white text-sm font-semibold shadow-lg transition-colors"
        >
          🚨 I feel unsafe
        </button>
      )}

      {showReportForm && (
        <IncidentReportForm
          latitude={userLocation?.[0] ?? null}
          longitude={userLocation?.[1] ?? null}
          onClose={() => setShowReportForm(false)}
          onSubmitted={() => {
            setShowReportForm(false);
            fetchReports().then(setIncidents).catch(() => {});
          }}
        />
      )}

      <RouteSelector
        routes={routes}
        selectedRoute={selectedRoute}
        onSelect={handleRouteSelect}
        onStartWalk={(route) => {
          window.location.href = `/walk?route=${route.mode}&duration=${Math.round(route.durationSeconds / 60)}`;
        }}
      />

      {safeStops.length > 0 && routes.length > 0 && (
        <SafeStopsLayer stops={safeStops} />
      )}

      {!showReportForm && (
        <RiskLegend
          visible={showHeatmap}
          onToggle={() => setShowHeatmap((v) => !v)}
        />
      )}
    </div>
  );
}
