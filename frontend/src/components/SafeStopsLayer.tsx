"use client";

import type { SafeStop } from "@/types";
import { SAFE_STOP_ICONS } from "@/lib/mapbox";

interface SafeStopsLayerProps {
  stops: SafeStop[];
}

export default function SafeStopsLayer({ stops }: SafeStopsLayerProps) {
  if (!stops.length) return null;

  return (
    <div className="absolute top-4 left-4 z-20 w-64 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Safe Stops Nearby
        </h2>
      </div>

      <ul className="max-h-64 overflow-y-auto divide-y divide-white/5">
        {stops.map((stop) => (
          <li
            key={stop.id}
            className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors"
          >
            <span className="text-lg shrink-0">
              {SAFE_STOP_ICONS[stop.category] ?? "📌"}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{stop.name}</p>
              <p className="text-xs text-white/40 capitalize">
                {stop.category.replace("_", " ")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
