"use client";

import type { RouteOption } from "@/types";
import { ROUTE_COLORS } from "@/lib/mapbox";

interface RouteSelectorProps {
  routes: RouteOption[];
  selectedRoute: string | undefined;
  onSelect: (type: string) => void;
  onStartWalk: (route: RouteOption) => void;
}

const ROUTE_LABELS: Record<string, string> = {
  fastest: "Fastest Route",
  lowerRisk: "Lower Risk",
  comfort: "Comfort Route",
};

const ROUTE_DESCRIPTIONS: Record<string, string> = {
  fastest: "Shortest travel time to destination",
  lowerRisk: "Avoids higher‑risk areas based on safety data",
  comfort: "Prioritises well‑lit, busier streets",
};

function riskBadge(score: number) {
  if (score <= 0.3)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
        Low
      </span>
    );
  if (score <= 0.6)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
        Medium
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
      Higher
    </span>
  );
}

export default function RouteSelector({
  routes,
  selectedRoute,
  onSelect,
  onStartWalk,
}: RouteSelectorProps) {
  if (!routes.length) return null;

  return (
    <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:bottom-8 md:w-96 z-20">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Choose a Route
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {routes.map((route) => {
            const isActive = selectedRoute === route.type;
            return (
              <button
                key={route.type}
                onClick={() => onSelect(route.type)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {/* Colour dot */}
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: ROUTE_COLORS[route.type] ?? "#888",
                      }}
                    />
                    <span className="text-sm font-medium text-white">
                      {ROUTE_LABELS[route.type] ?? route.type}
                    </span>
                  </div>
                  {riskBadge(route.riskScore)}
                </div>

                <p className="text-xs text-white/50 mb-2 pl-5">
                  {ROUTE_DESCRIPTIONS[route.type] ?? ""}
                </p>

                <div className="flex items-center gap-4 pl-5 text-xs text-white/60">
                  <span>🕐 {route.duration} min</span>
                  <span>
                    Risk:{" "}
                    <span className="font-mono">
                      {(route.riskScore * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>

                {isActive && (
                  <div className="mt-3 pl-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartWalk(route);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                      Start Walk
                    </button>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
