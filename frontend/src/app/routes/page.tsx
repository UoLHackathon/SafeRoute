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
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white/50 text-sm">
          Loading route options…
        </div>
      }
    >
      <RoutesContent />
    </Suspense>
  );
}

const ROUTE_META: Record<RouteMode, { icon: string; color: string; tagColor: string }> = {
  FASTEST: {
    icon: "⚡",
    color: "border-blue-500/40 bg-blue-500/5",
    tagColor: "bg-blue-500/20 text-blue-300",
  },
  LOWER_RISK: {
    icon: "🛡️",
    color: "border-green-500/40 bg-green-500/5",
    tagColor: "bg-green-500/20 text-green-300",
  },
  COMFORT: {
    icon: "🌙",
    color: "border-yellow-500/40 bg-yellow-500/5",
    tagColor: "bg-yellow-500/20 text-yellow-300",
  },
};

function RoutesContent() {
  const params = useSearchParams();
  const dest = params.get("dest") ?? "";
  const destLat = Number(params.get("destLat")) || 0;
  const destLng = Number(params.get("destLng")) || 0;

  const [routes, setRoutes] = useState<RouteOption[]>([]);
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

  function riskLabel(score: number) {
    if (score < 30) return { label: "Low", color: "text-green-400" };
    if (score < 60) return { label: "Medium", color: "text-yellow-400" };
    return { label: "High", color: "text-red-400" };
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      <div className="px-6 pt-14 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">Route Options</h1>
              {dest && (
                <p className="text-sm text-white/40 truncate">To: {dest}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <div className="text-center py-16 text-white/30 text-sm">
              Comparing routes…
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-400 text-sm">{error}</div>
          ) : routes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-2">🛣️</p>
              <p className="text-sm text-white/40 mb-4">No routes available.</p>
              <Link
                href="/"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                ← Enter a destination
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route) => {
                const meta = ROUTE_META[route.mode];
                const risk = riskLabel(route.riskScore);
                const durationMin = Math.round(route.durationSeconds / 60);
                return (
                  <div
                    key={route.mode}
                    className={`rounded-2xl border p-5 ${meta.color}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{meta.icon}</span>
                        <h2 className="text-base font-semibold text-white">
                          {route.mode === "LOWER_RISK"
                            ? "Lower Risk"
                            : route.mode.charAt(0) + route.mode.slice(1).toLowerCase()}
                        </h2>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${meta.tagColor}`}>
                        {durationMin} min
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-xs text-white/40">Duration</p>
                        <p className="text-sm font-medium text-white">
                          {durationMin} min
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-xs text-white/40">Risk Level</p>
                        <p className={`text-sm font-medium ${risk.color}`}>
                          {risk.label} ({route.riskScore.toFixed(0)}%)
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-xs text-white/40">Confidence</p>
                        <p className="text-sm font-medium text-white/70">
                          {route.confidence}
                        </p>
                      </div>
                    </div>

                    {route.reasons.length > 0 && (
                      <div className="mb-4 space-y-1">
                        {route.reasons.map((reason, i) => (
                          <p key={i} className="text-xs text-white/40 pl-1">
                            • {reason}
                          </p>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/walk?route=${route.mode}&duration=${durationMin}`}
                      className="block w-full text-center py-3 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium text-white transition-colors"
                    >
                      Start Walk →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
