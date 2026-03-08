"use client";

import type { SafeStop } from "@/types";

const SAFE_STOP_ICONS: Record<string, string> = {
  pharmacy: "💊",
  hospital: "🏥",
  police: "🚔",
  late_open_shop: "🏪",
};

interface SafeStopsLayerProps {
  stops: SafeStop[];
}

export default function SafeStopsLayer({ stops }: SafeStopsLayerProps) {
  if (!stops.length) return null;

  return (
    <div className="absolute top-4 left-4 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Safe Stops Nearby
        </h2>
      </div>

      <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
        {stops.map((stop) => (
          <li
            key={stop.id}
            className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg shrink-0">
              {SAFE_STOP_ICONS[stop.category] ?? "📌"}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-gray-900 truncate">{stop.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {stop.category.replace("_", " ")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
