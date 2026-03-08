"use client";

import type { RouteOption } from "@/types";

interface RouteSelectorProps {
  routes: RouteOption[];
  selectedRoute: string | undefined;
  onSelect: (mode: string) => void;
  onStartWalk: (route: RouteOption) => void;
}

const ROUTE_LABELS: Record<string, string> = {
  FASTEST: "Fastest Route",
  LOWER_RISK: "Lower Risk",
  COMFORT: "Comfort Route",
};

function riskBadge(score: number) {
  if (score <= 30)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
        Low
      </span>
    );
  if (score <= 60)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
        Medium
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Choose a Route
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {routes.map((route) => {
            const isActive = selectedRoute === route.mode;
            const durationMin = Math.round(route.durationSeconds / 60);
            return (
              <button
                key={route.mode}
                onClick={() => onSelect(route.mode)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {ROUTE_LABELS[route.mode] ?? route.mode}
                  </span>
                  {riskBadge(route.riskScore)}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>🕐 {durationMin} min</span>
                  <span>Risk: {route.riskScore.toFixed(0)}%</span>
                </div>

                {isActive && (
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartWalk(route);
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors"
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
