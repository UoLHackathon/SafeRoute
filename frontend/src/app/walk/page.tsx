"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { WalkSession, RouteMode } from "@/types";
import { fetchContacts } from "@/lib/api";
import type { TrustedContact } from "@/types";

export default function WalkPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">
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
  const routeMode = params.get("route") ?? "FASTEST";
  const durationMin = Number(params.get("duration")) || 10;

  const [session, setSession] = useState<WalkSession | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [checkingIn, setCheckingIn] = useState(false);
  const [ended, setEnded] = useState(false);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchContacts().then(setContacts).catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.isActive) return;

    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.isActive]);

  const totalSeconds = durationMin * 60;
  const remainingSeconds = Math.max(totalSeconds - elapsed, 0);
  const progress = Math.min(elapsed / totalSeconds, 1);
  const expectedArrival = session
    ? new Date(new Date(session.startTime).getTime() + durationMin * 60 * 1000)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : new Date(Date.now() + durationMin * 60 * 1000)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  async function handleStart() {
    setStarting(true);
    setError("");
    try {
      const s: WalkSession = {
        id: crypto.randomUUID(),
        routeMode: routeMode as RouteMode,
        startTime: new Date().toISOString(),
        expectedArrival: new Date(Date.now() + durationMin * 60 * 1000).toISOString(),
        isActive: true,
      };
      setSession(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start walk session");
    } finally {
      setStarting(false);
    }
  }

  const handleCheckIn = useCallback(async () => {
    if (!session) return;
    setCheckingIn(true);
    setSession((prev) => prev ? { ...prev, lastCheckIn: new Date().toISOString() } : prev);
    setTimeout(() => setCheckingIn(false), 500);
  }, [session]);

  async function handleEnd() {
    if (!session) return;
    setSession((prev) => prev ? { ...prev, isActive: false } : prev);
    setEnded(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  if (ended) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">You Arrived Safely!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Walk session ended. Your trusted contacts have been notified.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 pt-14">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm mb-6 inline-block">
          ← Back
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Session status:</p>
            <p className={`text-sm font-semibold ${session?.isActive ? "text-green-600" : "text-gray-400"}`}>
              {session?.isActive ? "Active" : "Not started"}
            </p>
          </div>
          {session?.isActive && (
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Walk session</h1>

        <p className="text-gray-500 mb-6">
          Expected Arrival time: <span className="font-semibold text-gray-900">{expectedArrival}</span>
        </p>

        {contacts.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">My favourite contacts</h3>
            <div className="space-y-2">
              {contacts.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {session?.isActive && (
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="w-full py-4 bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold rounded-2xl transition-colors mb-4"
          >
            {checkingIn ? "Checked in!" : "Check in"}
          </button>
        )}

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3 mb-4">{error}</p>
        )}

        {!session ? (
          <button
            onClick={handleStart}
            disabled={starting}
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {starting ? "Starting…" : "Start session"}
          </button>
        ) : session.isActive ? (
          <button
            onClick={handleEnd}
            className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
          >
            I Arrived
          </button>
        ) : null}
      </div>
    </div>
  );
}
