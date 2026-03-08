"use client";

import { useState } from "react";
import Link from "next/link";
import type { IncidentType } from "@/types";
import { submitReport } from "@/lib/api";

const INCIDENT_TYPES: { value: IncidentType; label: string; icon: string }[] = [
  { value: "harassment", label: "Harassment", icon: "⚠️" },
  { value: "suspicious_behaviour", label: "Suspicious Behaviour", icon: "👁️" },
  { value: "poorly_lit", label: "Poorly Lit Area", icon: "🌑" },
  { value: "isolated_street", label: "Isolated Street", icon: "🚧" },
];

export default function ReportPage() {
  const [type, setType] = useState<IncidentType>("harassment");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function getLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not get your location. Please enable location services.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!coords) return;

    setSubmitting(true);
    setError("");
    try {
      await submitReport({
        latitude: coords.lat,
        longitude: coords.lng,
        type,
        timestamp: new Date().toISOString(),
        description,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-semibold text-white mb-2">Report Submitted</h1>
          <p className="text-sm text-white/50 mb-6">
            Thank you. Your report helps keep the community safer.
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
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Report an Incident</h1>
            <p className="text-sm text-white/40">Help others stay safe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Location
            </label>
            {coords ? (
              <p className="text-sm text-green-400 bg-green-400/10 rounded-lg p-3">
                📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            ) : (
              <button
                type="button"
                onClick={getLocation}
                disabled={locating}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60 hover:bg-white/10 transition-colors"
              >
                {locating ? "Getting location…" : "📍 Use Current Location"}
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Type of Incident
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INCIDENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
                    type === t.value
                      ? "bg-white/15 border-white/30 text-white"
                      : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description <span className="text-white/30">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened?"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!coords || submitting}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
