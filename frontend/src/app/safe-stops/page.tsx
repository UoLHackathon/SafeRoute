"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllSafeStops } from "@/lib/api";
import type { SafeStop, SafeStopCategory } from "@/types";

const CATEGORIES: {
  id: SafeStopCategory | "all";
  label: string;
  icon: string;
}[] = [
  { id: "all", label: "All", icon: "📍" },
  { id: "pharmacy", label: "Pharmacies", icon: "💊" },
  { id: "hospital", label: "Hospitals", icon: "🏥" },
  { id: "police", label: "Police", icon: "🚔" },
  { id: "late_open_shop", label: "Late‑Night Shops", icon: "🏪" },
];

const CATEGORY_ICONS: Record<SafeStopCategory, string> = {
  pharmacy: "💊",
  hospital: "🏥",
  police: "🚔",
  late_open_shop: "🏪",
};

export default function SafeStopsPage() {
  const [category, setCategory] = useState<SafeStopCategory | "all">("all");
  const [stops, setStops] = useState<SafeStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchAllSafeStops(category === "all" ? undefined : category)
      .then(setStops)
      .catch(() => setError("Failed to load safe stops"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      <div className="px-6 pt-14 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">Nearby Safe Stops</h1>
              <p className="text-sm text-white/40">Find help & safety nearby</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="max-w-lg mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                category === cat.id
                  ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/70"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <div className="text-center py-12 text-white/30 text-sm">Loading…</div>
          ) : error ? (
            <div className="text-center py-12 text-red-400 text-sm">{error}</div>
          ) : stops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm text-white/40">No safe stops found in this category.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-white/30 mb-3">
                {stops.length} result{stops.length !== 1 ? "s" : ""}
              </p>
              {stops.map((stop) => (
                <div
                  key={stop.id}
                  className="bg-gray-900 rounded-2xl border border-white/10 p-4 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                    {CATEGORY_ICONS[stop.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {stop.name}
                    </p>
                    <p className="text-xs text-white/40 capitalize mt-0.5">
                      {stop.category.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-white/20 mt-1">
                      {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
