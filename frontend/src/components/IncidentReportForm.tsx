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

const INCIDENT_TYPES: { value: IncidentType; label: string; icon: string }[] = [
  { value: "harassment", label: "Harassment", icon: "⚠️" },
  { value: "suspicious_behaviour", label: "Suspicious Behaviour", icon: "👁️" },
  { value: "poorly_lit", label: "Poorly Lit Area", icon: "🌑" },
  { value: "isolated_street", label: "Isolated Street", icon: "🚧" },
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
    <div className="absolute top-4 right-4 z-30 w-80 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Report Incident
        </h2>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {!canSubmit && (
          <p className="text-xs text-yellow-400 bg-yellow-400/10 rounded-lg p-2">
            Tap on the map to select incident location
          </p>
        )}
        {canSubmit && (
          <p className="text-xs text-white/40">
            📍 {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          {INCIDENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
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

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened (optional)…"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 rounded-lg p-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
