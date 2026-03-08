"use client";

import { useState } from "react";
import Link from "next/link";
import {
  seedData,
  fetchAdminIncidents,
  fetchAdminSafeStops,
} from "@/lib/api";
import type { IncidentReport, SafeStop } from "@/types";

export default function AdminPage() {
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [safeStops, setSafeStops] = useState<SafeStop[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [loadingStops, setLoadingStops] = useState(false);
  const [error, setError] = useState("");

  async function handleSeed() {
    setSeeding(true);
    setSeedStatus(null);
    setError("");
    try {
      const res = await seedData();
      setSeedStatus(res.message || "Data seeded successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  async function loadIncidents() {
    setLoadingIncidents(true);
    try {
      const data = await fetchAdminIncidents();
      setIncidents(data);
    } catch {
      setError("Failed to load incidents");
    } finally {
      setLoadingIncidents(false);
    }
  }

  async function loadSafeStops() {
    setLoadingStops(true);
    try {
      const data = await fetchAdminSafeStops();
      setSafeStops(data);
    } catch {
      setError("Failed to load safe stops");
    } finally {
      setLoadingStops(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      <div className="px-6 pt-14 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">Admin / Dev Tools</h1>
              <p className="text-sm text-white/40">Seed data &amp; inspect records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <section className="bg-gray-900 rounded-2xl border border-white/10 p-5">
            <h2 className="text-base font-semibold text-white mb-2">Seed Database</h2>
            <p className="text-xs text-white/40 mb-4">
              Populate the backend with sample incidents, safe stops, and contacts for testing.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {seeding ? "Seeding…" : "Seed Data"}
            </button>
            {seedStatus && (
              <p className="mt-3 text-sm text-green-400">{seedStatus}</p>
            )}
          </section>

          <section className="bg-gray-900 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                Incidents{" "}
                {incidents.length > 0 && (
                  <span className="text-xs font-normal text-white/40">
                    ({incidents.length})
                  </span>
                )}
              </h2>
              <button
                onClick={loadIncidents}
                disabled={loadingIncidents}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 font-medium rounded-lg transition-colors"
              >
                {loadingIncidents ? "Loading…" : "Load"}
              </button>
            </div>

            {incidents.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-left">
                      <th className="pb-2 pr-4 font-medium">Type</th>
                      <th className="pb-2 pr-4 font-medium">Location</th>
                      <th className="pb-2 pr-4 font-medium">Timestamp</th>
                      <th className="pb-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {incidents.map((inc) => (
                      <tr key={inc.id ?? inc.timestamp} className="text-white/60">
                        <td className="py-2 pr-4 capitalize whitespace-nowrap">
                          {inc.type.replace(/_/g, " ")}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {new Date(inc.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2 truncate max-w-[200px]">
                          {inc.description || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-gray-900 rounded-2xl border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                Safe Stops{" "}
                {safeStops.length > 0 && (
                  <span className="text-xs font-normal text-white/40">
                    ({safeStops.length})
                  </span>
                )}
              </h2>
              <button
                onClick={loadSafeStops}
                disabled={loadingStops}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 font-medium rounded-lg transition-colors"
              >
                {loadingStops ? "Loading…" : "Load"}
              </button>
            </div>

            {safeStops.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-left">
                      <th className="pb-2 pr-4 font-medium">Name</th>
                      <th className="pb-2 pr-4 font-medium">Category</th>
                      <th className="pb-2 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {safeStops.map((stop) => (
                      <tr key={stop.id} className="text-white/60">
                        <td className="py-2 pr-4">{stop.name}</td>
                        <td className="py-2 pr-4 capitalize whitespace-nowrap">
                          {stop.category.replace(/_/g, " ")}
                        </td>
                        <td className="py-2 whitespace-nowrap">
                          {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
