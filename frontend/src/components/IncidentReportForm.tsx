"use client";

import { useState } from "react";
import type { IncidentType } from "@/types";
import { submitReport } from "@/lib/api";

interface IncidentReportFormProps {
  latitude: number | null;
  longitude: number | null;
  onClose: () => void;
  onSubmitted: () => void;
}

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: "harassment", label: "HARASSMENT" },
  { value: "suspicious_behaviour", label: "SUSPICIOUS ACTIVITY" },
  { value: "poorly_lit", label: "POOR LIGHTING" },
  { value: "isolated_street", label: "ISOLATED STREET" },
];

export default function IncidentReportForm({
  latitude,
  longitude,
  onClose,
  onSubmitted,
}: IncidentReportFormProps) {
  const [type, setType] = useState<IncidentType>("harassment");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = latitude !== null && longitude !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");
    try {
      await submitReport({
        latitude: latitude!,
        longitude: longitude!,
        type,
        timestamp: new Date().toISOString(),
        description,
      });
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="absolute top-4 right-4 z-30 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Report Incident
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {!canSubmit && (
          <p className="text-xs text-yellow-600 bg-yellow-50 rounded-lg p-2">
            Getting your location…
          </p>
        )}
        {canSubmit && (
          <p className="text-xs text-gray-400">
            📍 {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {INCIDENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                type === t.value
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened (optional)…"
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
