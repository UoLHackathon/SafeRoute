"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { geocode } from "@/lib/api";

const ROUTE_MODES = [
  {
    id: "fastest",
    label: "Fastest",
    icon: "⚡",
    description: "Shortest travel time",
    color: "border-blue-500/50 bg-blue-500/10 text-blue-400",
    activeColor: "border-blue-500 bg-blue-500/20 text-blue-300 ring-2 ring-blue-500/30",
  },
  {
    id: "lowerRisk",
    label: "Lower Risk",
    icon: "🛡️",
    description: "Avoids higher‑risk areas",
    color: "border-green-500/50 bg-green-500/10 text-green-400",
    activeColor: "border-green-500 bg-green-500/20 text-green-300 ring-2 ring-green-500/30",
  },
  {
    id: "comfort",
    label: "Comfort",
    icon: "🌙",
    description: "Well‑lit, busier streets",
    color: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
    activeColor: "border-yellow-500 bg-yellow-500/20 text-yellow-300 ring-2 ring-yellow-500/30",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [selectedMode, setSelectedMode] = useState("LOWER_RISK");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  async function handleStart() {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const coords = await geocode(destination);
      if (!coords) {
        setError("Could not find that destination. Try a more specific address.");
        return;
      }

      const params = new URLSearchParams({
        dest: destination,
        destLat: String(coords[0]),
        destLng: String(coords[1]),
        mode: selectedMode,
        ...(userLocation
          ? { startLat: String(userLocation[0]), startLng: String(userLocation[1]) }
          : {}),
      });
      router.push(`/map?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      <div className="px-6 pt-14 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-lg">
              🛡️
            </div>
            <h1 className="text-2xl font-bold text-white">SafeRoute AI</h1>
          </div>
          <p className="text-sm text-white/50 ml-[52px]">
            Safety-aware navigation for walking routes
          </p>
        </div>
      </div>

      <div className="px-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${userLocation ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
              <span className="text-sm text-white/60">
                {userLocation ? "Location detected" : "Getting your location…"}
              </span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-white/10 p-5">
            <label className="block text-sm font-medium text-white/70 mb-3">
              Where are you going?
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">📍</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  placeholder="Enter destination address…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            )}
          </div>

          <div>
            <h2 className="text-sm font-medium text-white/70 mb-3 px-1">
              Choose route mode
            </h2>
            <div className="space-y-2">
              {ROUTE_MODES.map((mode) => {
                const isActive = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      isActive ? mode.activeColor : mode.color
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{mode.label}</p>
                        <p className="text-xs opacity-70">{mode.description}</p>
                      </div>
                      {isActive && (
                        <span className="ml-auto text-xs font-medium opacity-80">Selected</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading || !destination.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors text-base shadow-lg shadow-blue-600/20"
          >
            {loading ? "Finding routes…" : "Start Walk →"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <QuickLink href="/safe-stops" icon="🏥" label="Nearby Safe Stops" />
            <QuickLink href="/report" icon="🚨" label="Report Incident" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 bg-gray-900 rounded-2xl border border-white/10 p-4 hover:bg-white/5 transition-colors"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-white/70 font-medium">{label}</span>
    </a>
  );
}
