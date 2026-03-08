"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { geocode } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  async function handleStartWalk() {
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
        mode: "LOWER_RISK",
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

  async function handleChooseRoute() {
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
      });
      router.push(`/routes?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="pt-14 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">SafeRoute</h1>
      </div>

      <div className="px-6">
        <div className="max-w-lg mx-auto space-y-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleStartWalk()}
              placeholder="Enter destination"
              className="w-full bg-amber-50 border border-amber-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleChooseRoute}
            disabled={loading || !destination.trim()}
            className="w-full py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Choose Route Mode
          </button>

          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-56 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="mx-auto mb-2" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              <p className="text-sm">Map Preview</p>
              {userLocation && (
                <p className="text-xs mt-1 text-gray-300">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/walk"
              className="flex-1 py-3.5 border-2 border-blue-500 text-blue-500 font-semibold rounded-xl text-center hover:bg-blue-50 transition-colors"
            >
              Walk session
            </Link>
            <button
              onClick={handleStartWalk}
              disabled={loading || !destination.trim()}
              className="flex-1 py-3.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Finding…" : "Start walk"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
