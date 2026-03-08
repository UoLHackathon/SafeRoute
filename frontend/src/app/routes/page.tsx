"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchAllRoutes } from "@/lib/api";
import type { RouteOption, RouteMode } from "@/types";

export default function RoutesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">
          Loading route options…
        </div>
      }
    >
      <RoutesContent />
    </Suspense>
  );
}

const ROUTE_LABELS: Record<RouteMode, string> = {
  FASTEST: "Fastest Route",
  LOWER_RISK: "Lower Risk Route",
  COMFORT: "Comfort Route",
};

function riskLabel(score: number) {
  if (score < 30) return { label: "Low", color: "text-green-600" };
  if (score < 60) return { label: "Medium", color: "text-yellow-600" };
  return { label: "High", color: "text-red-600" };
}

function RoutesContent() {
  const params = useSearchParams();
  const dest = params.get("dest") ?? "";
  const destLat = Number(params.get("destLat")) || 0;
  const destLng = Number(params.get("destLng")) || 0;

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selected, setSelected] = useState<RouteMode>("LOWER_RISK");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setError("Location access is needed to compare routes")
    );
  }, []);

  useEffect(() => {
    if (!userLocation || (!destLat && !destLng)) return;

    setLoading(true);
    setError("");
    fetchAllRoutes(userLocation[0], userLocation[1], destLat, destLng)
      .then(setRoutes)
      .catch(() => setError("Failed to fetch routes"))
      .finally(() => setLoading(false));
  }, [userLocation, destLat, destLng]);

  const selectedRoute = routes.find((r) => r.mode === selected);
  const durationMin = selectedRoute ? Math.round(selectedRoute.durationSeconds / 60) : 10;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-6 pt-14 pb-4">
        <div className="max-w-lg mx-auto">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Route Options</h1>
          {dest && (
            <p className="text-sm text-gray-400 mt-1 truncate">To: {dest}</p>
          )}
        </div>
      </div>

      <div className="px-6">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              Comparing routes…
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          ) : routes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-2">🛣️</p>
              <p className="text-sm text-gray-400 mb-4">No routes available.</p>
              <Link href="/" className="text-sm text-blue-500 hover:text-blue-600">
                ← Enter a destination
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map((route) => {
                const risk = riskLabel(route.riskScore);
                const mins = Math.round(route.durationSeconds / 60);
                const isSelected = selected === route.mode;
                return (
                  <button
                    key={route.mode}
                    onClick={() => setSelected(route.mode)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? "border-blue-500" : "border-gray-300"
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-semibold text-gray-900">
                            {ROUTE_LABELS[route.mode]}
                          </h2>
                          <span className="text-sm font-medium text-gray-500">{mins} min</span>
                        </div>
                        <p className={`text-sm mt-0.5 ${risk.color}`}>
                          Risk: {risk.label}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              <Link
                href={`/walk?route=${selected}&duration=${durationMin}`}
                className="block w-full text-center py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors mt-6"
              >
                Select
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
