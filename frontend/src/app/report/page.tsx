"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { IncidentType } from "@/types";
import { submitReport } from "@/lib/api";

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: "harassment", label: "HARASSMENT" },
  { value: "suspicious_behaviour", label: "SUSPICIOUS ACTIVITY" },
  { value: "poorly_lit", label: "POOR LIGHTING" },
  { value: "isolated_street", label: "ISOLATED STREET" },
];

export default function ReportPage() {
  const [type, setType] = useState<IncidentType>("harassment");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Report Submitted</h1>
          <p className="text-sm text-gray-500 mb-6">
            Thank you. Your report helps keep the community safer.
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
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-blue-500 px-6 pt-14 pb-6">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            ←
          </Link>
          <h1 className="text-lg font-bold text-white uppercase tracking-wide">Report</h1>
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Report Incident</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Select Incident type:
              </label>
              <div className="flex flex-wrap gap-2">
                {INCIDENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      type === t.value
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident..."
                rows={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!coords || submitting}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
