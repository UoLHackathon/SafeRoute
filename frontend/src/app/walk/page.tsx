"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { startWalkSession, checkIn, endWalkSession } from "@/lib/api";
import type { WalkSession } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function WalkPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white/50 text-sm">
          Loading walk session…
        </div>
      }
    >
      <WalkContent />
    </Suspense>
  );
}

function WalkContent() {
  const params = useSearchParams();
  const routeType = params.get("route") ?? "fastest";
  const durationMin = Number(params.get("duration")) || 10;

  const [session, setSession] = useState<WalkSession | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [checkingIn, setCheckingIn] = useState(false);
  const [ended, setEnded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<number | null>(null);

  // ── Track user location continuously ───────────────────────────────────
  useEffect(() => {
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => setUserLocation([pos.coords.longitude, pos.coords.latitude]),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.isActive) return;

    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.isActive]);

  const remainingSeconds = Math.max(durationMin * 60 - elapsed, 0);
  const remainingDisplay = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  // ── Start session ─────────────────────────────────────────────────────
  async function handleStart() {
    setStarting(true);
    setError("");
    try {
      const s = await startWalkSession({
        routeType,
        expectedMinutes: durationMin,
        contactId: "default", // Settings page would set this
      });
      setSession(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start walk session");
    } finally {
      setStarting(false);
    }
  }

  // ── Check in ──────────────────────────────────────────────────────────
  const handleCheckIn = useCallback(async () => {
    if (!session) return;
    setCheckingIn(true);
    try {
      await checkIn(session.id);
    } catch {
      // Silent — user can retry
    } finally {
      setCheckingIn(false);
    }
  }, [session]);

  // ── End walk ──────────────────────────────────────────────────────────
  async function handleEnd() {
    if (!session) return;
    try {
      await endWalkSession(session.id);
      setEnded(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch {
      // Silent
    }
  }

  // ── Arrived screen ────────────────────────────────────────────────────
  if (ended) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-semibold text-white mb-2">You Arrived Safely!</h1>
          <p className="text-sm text-white/50 mb-6">
            Walk session ended. Your trusted contacts have been notified.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Map tracking user */}
      <MapView userLocation={userLocation} trackUser />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="text-white/50 hover:text-white text-sm">
              ← Exit Walk
            </Link>
            <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
              {routeType.replace(/([A-Z])/g, " $1")} Route
            </span>
          </div>

          {!session ? (
            /* ── Not started yet ─────────────────────────────────────── */
            <div className="text-center py-4">
              <p className="text-sm text-white/60 mb-4">
                Estimated walk: <span className="text-white font-medium">{durationMin} min</span>
              </p>
              {error && (
                <p className="text-xs text-red-400 mb-3">{error}</p>
              )}
              <button
                onClick={handleStart}
                disabled={starting}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
              >
                {starting ? "Starting…" : "Start Walk"}
              </button>
            </div>
          ) : (
            /* ── Active walk ─────────────────────────────────────────── */
            <div>
              {/* Timer */}
              <div className="text-center mb-4">
                <p className="text-xs text-white/40 mb-1">Time Remaining</p>
                <p className="text-4xl font-mono font-bold text-white">
                  {remainingDisplay}
                </p>
                {remainingSeconds === 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Expected arrival time passed — check in!
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {checkingIn ? "…" : "✓ Check In"}
                </button>
                <button
                  onClick={handleEnd}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors"
                >
                  I Arrived
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
