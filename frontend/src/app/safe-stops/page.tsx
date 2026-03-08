"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllSafeStops } from "@/lib/api";
import type { SafeStop, SafeStopCategory } from "@/types";

const SAFE_STOP_ITEMS: {
  id: SafeStopCategory;
  label: string;
}[] = [
  { id: "pharmacy", label: "Nearby Pharmacies" },
  { id: "late_open_shop", label: "Nearby Stations" },
  { id: "hospital", label: "Nearby Hospitals" },
  { id: "police", label: "Nearby Police / help" },
];

export default function SafeStopsPage() {
  const [selected, setSelected] = useState<SafeStopCategory | null>(null);
  const [stops, setStops] = useState<SafeStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError("");
    fetchAllSafeStops(selected)
      .then(setStops)
      .catch(() => setError("Failed to load safe stops"))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-6 pt-14 pb-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Safe Stops</h1>
        </div>
      </div>

      <div className="px-6">
        <div className="max-w-lg mx-auto">
          {!selected ? (
            <div className="divide-y divide-gray-100">
              {SAFE_STOP_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base text-gray-900">{item.label}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => { setSelected(null); setStops([]); }}
                className="text-sm text-blue-500 hover:text-blue-600 mb-4 inline-block"
              >
                ← Back to categories
              </button>

              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
              ) : error ? (
                <div className="text-center py-12 text-red-500 text-sm">{error}</div>
              ) : stops.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-400">No safe stops found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stops.map((stop) => (
                    <div
                      key={stop.id}
                      className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {stop.name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize mt-0.5">
                          {stop.category.replace(/_/g, " ")}
                        </p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
